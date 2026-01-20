import React, { useState } from "react";
import { createAdmin, createUser } from "../api/client";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
function Register() {
  const [form, setform] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setform({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const role = localStorage.getItem("role");
    try {
        if(role=="ADMIN"){
            await createAdmin(form);
            alert("Admin user created!");
            navigate("/register");
        }
        else{
            await createUser(form);
            alert("User registered!");
            navigate("/login");
        }
   
    } catch (err: any) {
      setError("Registration failed.");
    }
  }
  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="login-link">Already have Account? <Link to="/login">Login Here</Link></p>
    </div>
  );
}
export default Register;
