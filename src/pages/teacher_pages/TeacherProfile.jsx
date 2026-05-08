import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, BookOpen, Star, Users, Edit,
  Settings, LayoutDashboard, Calendar, FileText, MessageSquare, Briefcase, MapPin, Award, Search, Moon, Bell, Menu, BookMarked, Sun
} from "lucide-react";
import { getMe, updateProfile } from "../../api/users";
import { getMyCourses } from "../../api/courses";
import "../../styles/teacher_pages/teacher_shared.css";
import "../../styles/teacher_pages/teacher_profile.css";

const TeacherProfile = () => {
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
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    level: 'High School',
    experience: '',
    bio: '',
  });

  useEffect(() => {
    getMe()
      .then(res => {
        const u = res.data;
        const tp = u.teacher_profile || {};
        setFormData({
          fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
          phone: tp.phone || '',
          email: u.email || '',
          subject: tp.specialization || '',
          level: tp.level_taught || 'High School',
          experience: tp.experience_years ?? '',
          bio: tp.bio || '',
        });
      })
      .catch(() => {});

    getMyCourses()
      .then(res => {
        const courses = res.data.results || res.data || [];
        setCurrentStats(prev => ({ ...prev, classes: courses.length }));
      })
      .catch(() => {});
  }, []);

  const handleSave = () => {
    const [first, ...rest] = formData.fullName.trim().split(' ');
    updateProfile({
      first_name: first || '',
      last_name: rest.join(' '),
      phone: formData.phone,
      specialization: formData.subject,
      level_taught: formData.level,
      experience_years: formData.experience !== '' ? Number(formData.experience) : null,
      bio: formData.bio,
    }).then(() => alert('Profile successfully updated!'))
      .catch(() => alert('Failed to save profile.'));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [currentStats, setCurrentStats] = useState({ students: 0, classes: 0, rating: 0 });

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrap" style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}><img src="/src/assets/logo2.png" alt="Tayssir" style={{ width: '38px', height: '38px', objectFit: 'contain' }} /></div>
          <div className="brand-text">
            <h3>Tayssir Panel</h3>
            <p>Admin Dashboard</p>
          </div>
        </div>
        
        <p className="nav-section-title">Main Menu</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-dashboard'); }}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => e.preventDefault()}>
            <User size={20} />
            <span>My Profile</span>
          </a>
        </nav>

        <p className="nav-section-title">Class Management</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-classes'); }}>
            <BookOpen size={20} />
            <span>Classes</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-students'); }}>
            <Users size={20} />
            <span>Students</span>
          </a>
        </nav>

        <p className="nav-section-title">Resources</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-library'); }}>
            <BookMarked size={20} />
            <span>Library</span>
          </a>
        </nav>

        <p className="nav-section-title">Teaching</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-schedule'); }}>
            <Calendar size={20} />
            <span>Schedule</span>
          </a>
        </nav>

        <div className="sidebar-bottom"><a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-settings'); }}><Settings size={20} /><span>Settings</span></a><button className="nav-item" onClick={(e) => { e.preventDefault(); localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user'); navigate('/login'); }} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '10px', color: 'inherit' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>Sign Out</span></button></div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="nav-left">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          
          <div className="nav-right">
            <button className="icon-button" onClick={toggleDarkMode} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-button notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <div className="user-profile-nav">
              <div className="nav-avatar">AB</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-header">
          <div className="page-title-box">
            <h1>My Profile</h1>
            <p>Home / <span>Profile</span></p>
          </div>
        </div>

        <div className="profile-grid">
          {/* Left Column: Edit Profile Form */}
          <div className="grid-left">
            <div className="card edit-profile-card">
              <div className="card-header">
                <h2><Edit size={20} className="header-icon" /> Edit Profile</h2>
              </div>
              
              <form className="edit-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="input-icon" />
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group full-width">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="input-icon" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Subject</label>
                    <div className="input-with-icon">
                      <BookOpen size={18} className="input-icon" />
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <div className="input-with-icon number-input-wrap">
                      <Briefcase size={18} className="input-icon" />
                      <input type="number" name="experience" value={formData.experience} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Level Taught</label>
                    <div className="input-with-icon">
                      <Award size={18} className="input-icon" />
                      <select name="level" value={formData.level} onChange={handleChange}>
                        <option value="Middle School">Middle School</option>
                        <option value="High School">High School</option>
                        <option value="University">University</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group full-width">
                    <label>Bio (Personal Statement)</label>
                    <div className="input-with-icon align-top">
                      <FileText size={18} className="input-icon" style={{ marginTop: '14px' }} />
                      <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4"></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-save-changes" onClick={handleSave}>
                    Save Changes ✓
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Profile Summary */}
          <div className="grid-right">
            <div className="card summary-card">
              <div className="summary-banner"></div>
              
              <div className="summary-content">
                <div className="summary-avatar-wrapper">
                  <div className="summary-avatar">
                    <img src={`https://ui-avatars.com/api/?name=${formData.fullName.replace(' ', '+')}&background=4f46e5&color=fff&size=150`} alt={formData.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                </div>
                
                <h3 className="summary-name">{formData.fullName}</h3>
                <p className="summary-role">Professional Teacher • {formData.level}</p>
                
                <div className="summary-tags">
                  <span className="tag yellow-tag">{formData.subject}</span>
                  <span className="tag light-tag">{formData.level}</span>
                  <span className="tag light-tag">Algeria</span>
                </div>

                <div className="summary-stats">
                  <div className="s-stat-box">
                    <span className="s-stat-num">{formData.experience || 0}</span>
                    <span className="s-stat-label">Years</span>
                  </div>
                  <div className="s-stat-box">
                    <span className="s-stat-num">{currentStats.students}</span>
                    <span className="s-stat-label">Students</span>
                  </div>
                  <div className="s-stat-box">
                    <span className="s-stat-num">{currentStats.classes}</span>
                    <span className="s-stat-label">Classes</span>
                  </div>
                </div>

                <p className="summary-bio">
                  {formData.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfile;



