import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, GraduationCap, BookOpen, Layers } from "lucide-react";
import studentImg from "../../assets/images/student_photo.png";
import teacherImg from "../../assets/images/teacher_photo.png";
import logoImg from "../../assets/images/logo2.png";
import "../../styles/landing_page/role_selection.css";
import "../../styles/landing_page/signup_role.css";

/**
 * Step 1 of Sign Up — Choose role BEFORE creating an account.
 * Public route (no auth required).
 */
const SignUpRoleSelect = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole === "student") {
      navigate("/signup/student");
    } else if (selectedRole === "teacher") {
      navigate("/signup/teacher");
    }
  };

  return (
    <div className="signup-role-page">
      {/* Minimal top bar */}
      <header className="sr-topbar">
        <div className="sr-logo" onClick={() => navigate("/")} style={{ cursor: "pointer", display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoImg} alt="Tayssir Logo" style={{ height: '44px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>Tayssir</span>
        </div>
        <button className="sr-back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </header>

      {/* Step indicator */}
      <div className="sr-steps">
        <div className="sr-step active">
          <div className="sr-step-dot">1</div>
          <span>Choose Role</span>
        </div>
        <div className="sr-step-line" />
        <div className="sr-step">
          <div className="sr-step-dot">2</div>
          <span>Create Account</span>
        </div>
        <div className="sr-step-line" />
        <div className="sr-step">
          <div className="sr-step-dot">3</div>
          <span>Get Started</span>
        </div>
      </div>

      {/* Main content */}
      <div className="role-container">
        <div className="role-header">
          <h2>Choose Your Role</h2>
          <p>Tell us how you'll be using Tayssir — we'll personalize your experience from day one.</p>
        </div>

        <div className="role-cards">
          {/* Student Card */}
          <div
            className={`role-card ${selectedRole === "student" ? "selected" : ""}`}
            onClick={() => setSelectedRole("student")}
          >
            <div className="role-photo-wrapper">
              <img src={studentImg} alt="Student" className="role-photo" />
            </div>
            <h3>I am a Student</h3>
            <p>Join classes, access learning materials, and track your academic progress.</p>
            {selectedRole === "student" && (
              <div className="role-selected-badge">Selected ✓</div>
            )}
          </div>

          {/* Teacher Card */}
          <div
            className={`role-card ${selectedRole === "teacher" ? "selected" : ""}`}
            onClick={() => setSelectedRole("teacher")}
          >
            <div className="role-photo-wrapper">
              <img src={teacherImg} alt="Teacher" className="role-photo" />
            </div>
            <h3>I am a Teacher</h3>
            <p>Create classrooms, share resources, assign quizzes, and guide your students.</p>
            {selectedRole === "teacher" && (
              <div className="role-selected-badge">Selected ✓</div>
            )}
          </div>
        </div>

        <button
          className={`btn-continue ${selectedRole ? "active" : "disabled"}`}
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue <ArrowRight size={20} style={{ marginLeft: "10px" }} />
        </button>

        <div className="sr-login-hint">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="sr-link">
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpRoleSelect;
