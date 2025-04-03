import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/AuthForm.css";



const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ VALIDATION
        if (!form.username || !form.password) {
            toast.error("Username and password are required.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3001/api/auth/login", form);

            localStorage.setItem("token", res.data.token);

            toast.success("Login successful! Redirecting to your profile page.");
            navigate("/profile");
        } catch (err) {
            toast.error(err.response?.data?.error || "Login failed.");
        }
    };


    return (
        <div style={{ padding: "20px" }} className="auth-container">
            <h2>Log In</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                /><br /><br />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                /><br /><br />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default Login;
