import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function ProfilePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/resume/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load resumes");

        const data = await res.json();
        setResumes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleView = (resume) => {
    navigate("/resume-preview", {
      state: { resumeHtml: resume.content },
    });
  };

  return (
    <div className="form-page">
      <h2 className="form-header">Your Previous Resumes</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && resumes.length === 0 && (
        <p>No resumes found yet.</p>
      )}
      <div className="resume-list">
        {resumes.map((resume) => (
          <div className="resume-card" key={resume._id}>
            <p><strong>Name:</strong> {resume.name}</p>
            <p><strong>Date:</strong> {new Date(resume.createdAt).toLocaleString()}</p>
            <button className="btn btn-outline" onClick={() => handleView(resume)}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
