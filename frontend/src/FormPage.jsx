import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function FormPage() {
  const navigate = useNavigate();

  const steps = [
    "name", "email", "phone", "experience", "education",
    "competencies", "languages", "interests", "github"
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
    competencies: "",
    languages: "",
    interests: "",
    github: "",
    userPrompt: "", // required by backend for AI summary
    photo: null,
    templateType: "paid",
    templateFile: "fancy.html"
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setError("");
    const payload = new FormData();
    payload.append("templateType", formData.templateType);
    payload.append("templateFile", formData.templateFile);
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("userPrompt", formData.userPrompt || formData.competencies);
    payload.append("experience", JSON.stringify([{ title: formData.experience }]));
    payload.append("education", JSON.stringify([{ degree: formData.education }]));
    payload.append("competencies", formData.competencies);
    payload.append("languages", formData.languages);
    payload.append("interests", formData.interests);
    payload.append("github", formData.github);
    if (formData.photo) payload.append("photo", formData.photo);

    try {
      const response = await fetch("http://localhost:3000/resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: payload,
      });

      const text = await response.text();
      console.log("Raw response text:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        setError("Server returned invalid response.");
        return;
      }

      if (response.ok) {
        navigate("/resume-preview", { state: { resumeHtml: data.resumeText } });
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Form error:", err);
      setError("Network or server error.");
    }
  };

  return (
    <div className="form-page" style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <div
        className="progress-blob"
        style={{
          transform: `scale(${1 + currentStep * 0.1})`,
        }}
      ></div>

      <h2>{`Step ${currentStep + 1} of ${steps.length}`}</h2>
      <label style={{ display: "block", marginBottom: "1rem", fontWeight: "bold" }}>
        {steps[currentStep].charAt(0).toUpperCase() + steps[currentStep].slice(1)}
      </label>

      {steps[currentStep] === "photo" ? (
        <input type="file" name="photo" onChange={handleChange} />
      ) : (
        <input
          type="text"
          name={steps[currentStep]}
          value={formData[steps[currentStep]]}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", fontSize: "1rem" }}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      <div style={{ marginTop: "1.5rem" }}>
        {currentStep > 0 && (
          <button className="btn btn-outline" onClick={handlePrev}>Back</button>
        )}
        {currentStep < steps.length - 1 ? (
          <button className="btn btn-primary" onClick={handleNext} style={{ marginLeft: "1rem" }}>
            Next
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit} style={{ marginLeft: "1rem" }}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
