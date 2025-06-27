import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:3000/auth/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful!");
        navigate("/");
      } else {
        setMessage("Registered successfully! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="switch-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="btn-text">
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
        <p className="switch-auth">
          Forgot your password?{" "}
          <button className="btn-text" onClick={() => navigate("/forgot-password")}>
            Reset it here
          </button>
        </p>


        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
