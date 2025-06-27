import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await fetch(`http://localhost:3000/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password has been reset!");
        setError("");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        navigate("/auth");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="auth-message">{error}</p>}
        {message ? (
          <p className="message">{message} Redirecting to login...</p>
        ) : (
          <button className="btn btn-primary" onClick={handleReset}>
            Reset Password
          </button>
        )}
      </div>
    </div>
  );
}
