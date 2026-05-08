import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import "../../styles/landing_page/login.css";
import logoImg from "../../assets/images/logo2.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate(result.redirect);
    } else {
      setError(result.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    // credential is the Google id_token — backend verifies it directly
    const result = await loginWithGoogle(credentialResponse.credential, "student");
    setLoading(false);

    if (result.success) {
      navigate(result.redirect);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Form Side */}
        <div className="login-form-side">
          <div className="login-form-inner">
            <div
              className="login-logo clickable"
              onClick={() => navigate("/")}
              style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "28px" }}
            >
              <img src={logoImg} alt="Tayssir Logo" style={{ height: "56px" }} />
              <span className="logo-text" style={{ fontSize: "2rem", fontWeight: 800, color: "#2563eb" }}>
                Tayssir
              </span>
            </div>

            <div className="login-header">
              <h2>Welcome back</h2>
              <p>Enter your credentials to access your account.</p>
            </div>

            {error && (
              <div style={{ color: "#ef4444", backgroundColor: "#fef2f2", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", textAlign: "center", border: "1px solid #fee2e2" }}>
                {error}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>Password</label>
                  <span
                    className="forgot-password"
                    style={{ cursor: "pointer", color: "#4f46e5", fontSize: "13px" }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </span>
                </div>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </button>

              <div className="login-divider">
                <span>Or sign in with</span>
              </div>

              <div className="social-login" style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in failed. Please try again.")}
                  useOneTap={false}
                  shape="rectangular"
                  text="signin_with"
                  locale="en"
                />
              </div>
            </form>

            <div className="login-footer">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="link"
                style={{ cursor: "pointer", color: "#4f46e5", fontWeight: "600" }}
              >
                Sign up free
              </span>
            </div>
          </div>
        </div>

        {/* Right Brand Side */}
        <div className="login-brand-side">
          <div className="brand-overlay"></div>
          <div className="brand-content">
            <h1 className="brand-title">Your complete digital learning ecosystem</h1>
            <p className="brand-desc">
              Join thousands of educators and students who are transforming classrooms with our powerful interface.
            </p>
            <div className="brand-stats">
              <div className="stat-item">
                <div className="stat-avatar">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80" alt="User" />
                </div>
                <div className="stat-text">
                  <span className="stat-val">15k+</span>
                  <span className="stat-lbl">Active Students</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-avatar">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80&h=80" alt="User" />
                </div>
                <div className="stat-text">
                  <span className="stat-val">4.9/5</span>
                  <span className="stat-lbl">Instructor Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
