import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";


const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await axios.get("http://localhost:3001/api/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(res.data.user);
            } catch (err) {
                setError("Failed to fetch profile information. You need to log in.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px" }} className="auth-container">
            <h2>Profile Page</h2>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>

            <button onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
            }}>
                Log Out
            </button>
        </div>
    );
};

export default Profile;
