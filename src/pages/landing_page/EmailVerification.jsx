import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/landing_page/email_verification.css";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && code[index] === "" && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length === 6) {
      // Role was already set before this step — navigate directly to the right dashboard
      if (user?.role === 'student') {
        navigate("/student-dashboard");
      } else if (user?.role === 'teacher') {
        navigate("/waiting-page");
      } else {
        // Fallback: shouldn't happen in normal flow
        navigate("/role-selection");
      }
    } else {
      alert("Please enter the 6-digit verification code.");
    }
  };

  return (
    <div className="verification-page">
      <div className="verification-card">
        <div className="verification-icon-wrapper">
          <Mail className="mail-icon" size={32} />
        </div>
        <h2>Check your email</h2>
        <p>We sent a verification code to <strong>name@example.com</strong></p>

        <form className="verification-form" onSubmit={handleSubmit}>
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="code-input"
              />
            ))}
          </div>

          <button type="submit" className="btn-verify-submit">
            Verify Email <CheckCircle size={18} style={{ marginLeft: '8px' }} />
          </button>
        </form>

        <div className="verification-footer">
          Didn't receive the email? <span className="link">Click to resend</span>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
