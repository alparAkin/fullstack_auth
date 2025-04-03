const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');


const router = express.Router();

// Kullanıcı kayıt
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Kayıt hatası:', err);
                return res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu.' });
            }

            res.status(201).json({ message: 'Kayıt başarılı 🎉' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kullanıcı girişi
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Kullanıcı adı ve şifre zorunludur.' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Sunucu hatası' });
        if (results.length === 0) {
            return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Şifre hatalı.' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Giriş başarılı 🎉', token });
    });
});

// ✅ Korumalı profil rotası
router.get('/profile', verifyToken, (req, res) => {
    const user = req.user;
    res.json({
        message: 'Profil bilgisi',
        user: {
            id: user.id,
            username: user.username
        }
    });
});


module.exports = router;
