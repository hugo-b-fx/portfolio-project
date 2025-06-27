import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import FormPage from "./FormPage";
import "./App.css";
import AuthPage from "./AuthPage";
import ResumePreview from "./ResumePreview";
import ProfilePage from "./ProfilePage";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";
import { Helmet } from "react-helmet";  

export default function App() {
  return (
      <>
      <Helmet>
        <title>JobFinderAI</title>
      </Helmet>
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/resume-preview" element={<ResumePreview />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router></>
  );
}
