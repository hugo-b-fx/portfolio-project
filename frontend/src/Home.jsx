import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    document.body.className = "dark";
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="home-page">
      <div className="background-blob" />
      <div className="background-blob warm"/>

      <div className="navbar">
        <div className="logo">JobFinder.AI</div>
        <div className="nav-buttons">
          <Link to="/profile">
            <button className="btn btn-secondary">Profile</button>
          </Link>
          {isLoggedIn ? (
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/auth">
              <button className="btn btn-primary">Login / Register</button>
            </Link>
          )}
        </div>
      </div>

      <div className="home-content">
        <h1 className="home-title">Build Your Professional Resume</h1>
        <p className="home-subtitle">
          Step through a guided process to craft a standout resume in minutes.
        </p>
        <Link to="/form">
          <button className="btn btn-primary start-btn">Let’s Get Started</button>
        </Link>
      </div>
    </div>
  );
}
