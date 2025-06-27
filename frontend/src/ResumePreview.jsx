import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./App.css";

export default function ResumePreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeHtml = location.state?.resumeHtml || location.state?.resumeText || "";
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (resumeHtml) {
      setIsReady(true);
    }
  }, [resumeHtml]);

  const handleDownloadPDF = () => {
    const iframe = document.getElementById("resume-frame");
    if (iframe) {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      html2pdf()
        .set({
          margin: 0.5,
          filename: "resume.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(iframeDocument.body)
        .save();
    }
  };

  if (!resumeHtml) {
    return <div className="form-page">No resume data found.</div>;
  }

  return (
    <div className="form-page">
      <h2 className="form-header">Your Resume</h2>
      <div className="resume-preview-box">
        <iframe
          id="resume-frame"
          title="Resume Preview"
          style={{ width: "100%", height: "80vh", border: "none", borderRadius: "12px", boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}
          srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="/templates/free/style.css"></head><body>${resumeHtml}</body></html>`}
        />
      </div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>
          Download as PDF
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
