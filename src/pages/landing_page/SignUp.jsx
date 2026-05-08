import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/landing_page/signup.css";
import "../../styles/landing_page/signup_role.css";
import logoImg from "../../assets/images/logo2.png";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    const result = await register({
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      role: "student",
    });
    setLoading(false);

    if (result.success) {
      navigate("/login", {
        state: { message: "Account created! Please sign in." },
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <div
            className="signup-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "28px" }}
          >
            <img src={logoImg} alt="Tayssir Logo" style={{ height: "56px" }} />
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "#2563eb" }}>Tayssir</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <button
              onClick={() => navigate("/signup")}
              style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", padding: "0" }}
            >
              <ArrowLeft size={15} /> Role Selection
            </button>
            <span style={{ color: "#e2e8f0" }}>›</span>
            <span style={{ color: "#4f46e5", fontWeight: "700", fontSize: "0.85rem" }}>Student Sign Up</span>
          </div>

          <h2>Create your account</h2>
          <p>You're signing up as a <strong>Student</strong>. Fill in your details below.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label>First Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "10px", padding: "12px 16px", fontSize: "0.875rem", fontWeight: "500", marginBottom: "4px", textAlign: "center" }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-signup-submit" disabled={loading}>
            {loading ? "Creating account…" : <><span>Create Account</span><ArrowRight size={18} style={{ marginLeft: "10px" }} /></>}
          </button>
        </form>

        <div className="signup-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="link" style={{ cursor: "pointer", color: "#4f46e5", fontWeight: "600" }}>
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
