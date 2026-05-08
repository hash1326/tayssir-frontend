import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, BookOpen, Briefcase, FileText, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { submitApplication } from "../../api/teacher_applications";
import "../../styles/teacher_pages/teacher_application.css";

const TeacherApplication = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    specialization: "",
    levelTaught: "",
    teaching_experience: "",
    certifications: "",
    qualifications: "",
    documents: null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Combine free-text fields into qualifications/experience for backend
    const qualifications = [
      formData.qualifications,
      formData.certifications && `Certifications: ${formData.certifications}`,
      formData.levelTaught && `Level taught: ${formData.levelTaught}`,
      formData.phone && `Phone: ${formData.phone}`,
    ].filter(Boolean).join("\n\n");

    try {
      await submitApplication({
        specialization: formData.specialization,
        teaching_experience: formData.teaching_experience,
        qualifications,
        documents: formData.documents,
      });
      navigate("/waiting-page");
    } catch (err) {
      const detail = err.response?.data?.detail
        || (err.response?.data && Object.values(err.response.data).flat().join(" "))
        || "Failed to submit application. Please try again.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-page">
      <div className="application-container">
        <div className="application-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <button
              onClick={() => navigate("/signup")}
              style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", padding: "0" }}
            >
              <ArrowLeft size={15} /> Role Selection
            </button>
            <span style={{ color: "#e2e8f0" }}>›</span>
            <span style={{ color: "#4f46e5", fontWeight: "700", fontSize: "0.85rem" }}>Teacher Sign Up</span>
          </div>
          <h2>Teacher Onboarding</h2>
          <p>Complete your profile to submit your application for review.</p>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="form-row">
              <div className="input-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+213 xxx xxx xxx" />
                </div>
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          {/* Professional Information */}
          <div className="form-section">
            <h3 className="section-title">Professional Information</h3>
            <div className="form-row">
              <div className="input-group">
                <label>Subject / Specialization</label>
                <div className="input-wrapper">
                  <BookOpen className="input-icon" size={18} />
                  <input required type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g., Mathematics, Physics" />
                </div>
              </div>
              <div className="input-group">
                <label>Level Taught</label>
                <div className="input-wrapper">
                  <BookOpen className="input-icon" size={18} />
                  <select required name="levelTaught" value={formData.levelTaught} onChange={handleChange}>
                    <option value="" disabled>Select level</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="University">University</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Teaching Experience</label>
                <div className="input-wrapper">
                  <Briefcase className="input-icon" size={18} />
                  <input required type="text" name="teaching_experience" value={formData.teaching_experience} onChange={handleChange} placeholder="e.g., 5 years of high school math" />
                </div>
              </div>
              <div className="input-group">
                <label>Certifications (Optional)</label>
                <div className="input-wrapper">
                  <FileText className="input-icon" size={18} />
                  <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} placeholder="e.g., CAPES, Master's degree..." />
                </div>
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          {/* Additional Info */}
          <div className="form-section">
            <h3 className="section-title">Qualifications & Bio</h3>
            <div className="input-group full-width" style={{ marginBottom: "16px" }}>
              <label>Qualifications / Bio</label>
              <div className="input-wrapper textarea-wrapper">
                <FileText className="input-icon textarea-icon" size={18} />
                <textarea required name="qualifications" value={formData.qualifications} onChange={handleChange} placeholder="Briefly describe your qualifications, methodology, and teaching experience..." rows="4" />
              </div>
            </div>

            <div className="input-group full-width">
              <label>Upload Documents (PDF certificates)</label>
              <div className="upload-dropzone">
                <Upload size={24} className="upload-icon" />
                <p>
                  {formData.documents
                    ? <strong>{formData.documents.name}</strong>
                    : <>Drag and drop or <span>click to browse</span></>}
                </p>
                <input type="file" name="documents" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "10px", padding: "12px 16px", fontSize: "0.875rem", textAlign: "center", margin: "16px 0" }}>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/signup")}>Back</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting…" : <>Submit for Review <ArrowRight size={18} style={{ marginLeft: "8px" }} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherApplication;
