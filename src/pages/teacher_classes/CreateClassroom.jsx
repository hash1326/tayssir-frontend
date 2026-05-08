import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronDown, DollarSign, BookOpen, Settings, Sun, Moon, Bell } from "lucide-react";
import * as coursesApi from "../../api/courses";
import "../../styles/teacher_classes/create_classroom.css";
import "../../styles/teacher_pages/teacher_shared.css";

const CreateClassroom = () => {
  const navigate = useNavigate();
  
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');

  React.useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(localStorage.getItem('platform-dark-mode') === 'true');
    };
    window.addEventListener('theme-changed', handleThemeChange);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('platform-dark-mode', isDarkMode);
    
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem('platform-dark-mode', newVal);
    window.dispatchEvent(new Event('theme-changed'));
  };

  const [formData, setFormData] = useState({
    classroomName: "",
    subject: "",
    level: "beginner",
    academicYear: "",
    details: "",
    language: "ar",
    includes: {
      liveVideo: true,
      exercises: false,
      quizzes: false,
      grades: false,
      summaries: false,
      message: true
    },
    isPaid: false,
    price: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  // Load categories
  useEffect(() => {
    coursesApi.getCategories().then((res) => {
      setCategories(res.data.results || res.data || []);
    }).catch(() => {});
  }, []);

  const handleIncludeChange = (item) => {
    setFormData({
      ...formData,
      includes: { ...formData.includes, [item]: !formData.includes[item] }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.isPaid && (!formData.price || Number(formData.price) <= 0)) {
      setError("Please enter a valid price greater than 0 for a paid course.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: formData.classroomName,
        description: formData.details || formData.classroomName,
        short_description: formData.subject,
        level: formData.level,
        language: formData.language,
        price: formData.isPaid ? Number(formData.price) : 0,
        is_free: !formData.isPaid,
        status: "published",
      };
      if (categoryId) payload.category_id = categoryId;

      await coursesApi.createCourse(payload);
      navigate("/teacher-classes");
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.detail
        || (typeof data === "object" ? Object.values(data).flat().join(" ") : "Failed to create classroom.");
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-class-layout">
      
      {/* Top Header */}
      <header className="create-header">
        <button className="back-btn" onClick={() => navigate('/teacher-classes')}>
          <ArrowLeft size={20} />
          <span>Back to Classes</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="icon-btn"><Bell size={20}/><span className="badge-dot red"></span></button>
          <button className="icon-btn" onClick={toggleDarkMode} title={isDarkMode ? 'Light mode' : 'Dark mode'} style={{ color: isDarkMode ? '#f8fafc' : '#64748b' }}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="user-avatar-wrapper" onClick={() => navigate('/teacher-profile')}>
            <div className="user-avatar">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{width: '40px', height: '40px'}}/>
            </div>
            <div className="online-indicator"></div>
          </div>
          <div className="header-badge">
            <BookOpen size={16} />
            <span>Class Setup</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="create-main">
        <div className="form-container">
          <div className="form-heading">
            <h1>Create New Classroom</h1>
            <p>Fill out the details below to set up your new learning environment.</p>
          </div>

          <form onSubmit={handleSubmit} className="classroom-form">
            
            {/* Section 1: Basic Info */}
            <div className="form-section">
              <h3 className="section-title">General Information</h3>
              
              <div className="input-group full-width">
                <label>Classroom Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Advanced Algebra 101" 
                  required
                  value={formData.classroomName}
                  onChange={(e) => setFormData({...formData, classroomName: e.target.value})}
                />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mathematics" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Level</label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                  >
                    <option value="ar">Arabic</option>
                    <option value="fr">French</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group full-width">
                <label>Classroom Details</label>
                <textarea 
                  rows="4" 
                  placeholder="What will students learn in this classroom?"
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="form-divider"></div>

            {/* Section 2: Features */}
            <div className="form-section">
              <h3 className="section-title">What will this classroom include?</h3>
              
              <div className="features-grid">
                {Object.keys(formData.includes).map((key) => {
                  const titles = {
                    liveVideo: "Live Video", exercises: "Exercises", quizzes: "Quizzes",
                    grades: "Grades", summaries: "Summaries", message: "Message Board"
                  };
                  return (
                    <label 
                      key={key} 
                      className={`feature-box ${formData.includes[key] ? 'active' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={formData.includes[key]} 
                        onChange={() => handleIncludeChange(key)}
                        hidden
                      />
                      <div className="box-indicator">
                        {formData.includes[key] && <CheckCircle2 size={16} strokeWidth={3}/>}
                      </div>
                      <span>{titles[key]}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-divider"></div>

            {/* Section 3: Access & Settings */}
            <div className="form-section">
              <h3 className="section-title"><Settings size={18}/> Settings & Access</h3>
              
              <div className="access-toggle">
                <p className="access-label">Classroom Type</p>
                <div className="toggle-wrapper">
                  <button 
                    type="button"
                    className={`toggle-btn ${!formData.isPaid ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, isPaid: false, price: ""})}
                  >
                    Free
                  </button>
                  <button 
                    type="button"
                    className={`toggle-btn ${formData.isPaid ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, isPaid: true})}
                  >
                    Paid
                  </button>
                </div>
              </div>

              {formData.isPaid && (
                <div className="price-input-wrapper animate-slide-down">
                  <label>Price (DA)</label>
                  <div className="price-input">
                    <DollarSign size={18} className="price-icon" />
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required={formData.isPaid}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "10px", padding: "12px 16px", fontSize: "0.875rem", textAlign: "center", margin: "16px 0" }}>
                {error}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="form-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate('/teacher-classes')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={submitting}>
                {submitting ? "Saving…" : "Save Classroom"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateClassroom;


