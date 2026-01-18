import React, { useState } from "react";
import { login } from "../api/client";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await login(username, password);
      const token = response.data.access_token;

      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));

      localStorage.setItem("token", token);
      localStorage.setItem("role", payload.role);
      localStorage.setItem("userId", payload.id);
      localStorage.setItem("username", payload.sub);
      window.location.href = "/";
    } catch (err: any) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="register-link">
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
