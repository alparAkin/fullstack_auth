import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";


const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    // ✅ VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
  
    // ✅ Send to server
    try {
      const res = await axios.post("http://localhost:3001/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };
  

  return (
    <div style={{ padding: "20px" }} className="auth-container">
      <h2>Sign Up</h2>
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
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
