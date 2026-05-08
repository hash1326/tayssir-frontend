import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, LayoutDashboard, Calendar, FileText, MessageSquare,
  Settings, BookOpen, Users as UsersIcon, Award, Bell, BookMarked, Moon, Sun,
  Shield, Palette, Globe, Lock, Eye, EyeOff,
  Check, Camera, Mail, Phone, MapPin, ChevronRight,
  DollarSign, TrendingUp, Clock, AlertCircle, CheckCircle, XCircle
} from "lucide-react";
import { getMyEarnings, getMyWithdrawRequests, submitWithdrawRequest } from "../../api/payments";
import "../../styles/teacher_pages/teacher_settings.css";
import "../../styles/teacher_pages/teacher_dashboard.css";

const MENU_THEMES = [
  { id: 'blue', name: 'Ocean Blue', menuGrad: ['#1a237e', '#283593', '#1565c0', '#0288d1'] },
  { id: 'red', name: 'Ruby Red', menuGrad: ['#450a0a', '#7f1d1d', '#b91c1c', '#ef4444'] },
  { id: 'pink', name: 'Sweet Pink', menuGrad: ['#4c0519', '#831843', '#be185d', '#e11d48'] },
  { id: 'purple', name: 'Royal Purple', menuGrad: ['#2e1065', '#4c1d95', '#6d28d9', '#7c3aed'] },
  { id: 'green', name: 'Emerald Green', menuGrad: ['#022c22', '#064e3b', '#047857', '#10b981'] },
  { id: 'orange', name: 'Sunset Orange', menuGrad: ['#431407', '#7c2d12', '#c2410c', '#ea580c'] },
  { id: 'dark', name: 'Midnight Dark', menuGrad: ['#0f172a', '#1e293b', '#334155', '#475569'] }
];

const ACCENT_COLORS = [
  { id: 'blue', color: '#4F46E5', hover: '#4338ca' },
  { id: 'red', color: '#ef4444', hover: '#dc2626' },
  { id: 'pink', color: '#ec4899', hover: '#db2777' },
  { id: 'purple', color: '#8b5cf6', hover: '#7c3aed' },
  { id: 'green', color: '#10b981', hover: '#059669' },
  { id: 'orange', color: '#f97316', hover: '#ea580c' },
  { id: 'yellow', color: '#eab308', hover: '#ca8a04' },
];

const TeacherSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  // Platform-wide theming states
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');
  const [activeMenuTheme, setActiveMenuTheme] = useState('blue');
  const [activeAccentColor, setActiveAccentColor] = useState('blue');

  useEffect(() => {
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
    
    // Sync menu theme
    const savedMenuThemeId = localStorage.getItem('platform-menu-theme') || 'blue';
    const menuTheme = MENU_THEMES.find(t => t.id === savedMenuThemeId) || MENU_THEMES[0];
    setActiveMenuTheme(menuTheme.id);
    applyMenuTheme(menuTheme);

    // Sync accent color
    const savedAccentColorId = localStorage.getItem('platform-accent-color') || 'blue';
    const accentTheme = ACCENT_COLORS.find(t => t.id === savedAccentColorId) || ACCENT_COLORS[0];
    setActiveAccentColor(accentTheme.id);
    applyAccentColor(accentTheme);
  }, []);

  const handleModeChange = (dark) => {
    setIsDarkMode(dark);
    localStorage.setItem('platform-dark-mode', dark);
    if (dark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  const applyMenuTheme = (theme) => {
    document.documentElement.style.setProperty('--menu-grad-1', theme.menuGrad[0]);
    document.documentElement.style.setProperty('--menu-grad-2', theme.menuGrad[1]);
    document.documentElement.style.setProperty('--menu-grad-3', theme.menuGrad[2]);
    document.documentElement.style.setProperty('--menu-grad-4', theme.menuGrad[3]);
  };

  const applyAccentColor = (theme) => {
    document.documentElement.style.setProperty('--primary-color', theme.color);
    document.documentElement.style.setProperty('--primary', theme.color);
    document.documentElement.style.setProperty('--primary-hover', theme.hover);
    document.documentElement.style.setProperty('--blue', theme.color);
    document.documentElement.style.setProperty('--accent', theme.color);
  };

  const handleMenuThemeChange = (theme) => {
    setActiveMenuTheme(theme.id);
    applyMenuTheme(theme);
    localStorage.setItem('platform-menu-theme', theme.id);
  };

  const handleAccentColorChange = (theme) => {
    setActiveAccentColor(theme.id);
    applyAccentColor(theme);
    localStorage.setItem('platform-accent-color', theme.id);
  };

  const [profile, setProfile] = useState({
    firstName: "Ahmed",
    lastName: "Yelles",
    email: "ahmed.yelles@example.com",
    phone: "+213 770 123 456",
    bio: "Passionate educator with 8+ years teaching Mathematics and Sciences.",
    location: "Algiers, Algeria",
    language: "English"
  });

  const [notifications, setNotifications] = useState({
    newStudent: true,
    sessionReminder: true,
    assignmentSubmission: false,
    messageAlert: true,
    weeklyDigest: false,
    platformNews: true
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEmail: false,
    showPhone: false
  });

  // Payments / Earnings state
  const [earnings, setEarnings] = useState(null);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', payment_info: '', note: '' });
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  useEffect(() => {
    if (activeTab === 'payments') {
      getMyEarnings().then(r => setEarnings(r.data)).catch(() => {});
      getMyWithdrawRequests().then(r => setWithdrawHistory(r.data.results || r.data || [])).catch(() => {});
    }
  }, [activeTab]);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');
    if (!withdrawForm.amount || Number(withdrawForm.amount) <= 0) {
      setWithdrawError('Please enter a valid amount.');
      return;
    }
    if (!withdrawForm.payment_info.trim()) {
      setWithdrawError('Please provide your payment / bank details.');
      return;
    }
    setWithdrawSubmitting(true);
    try {
      await submitWithdrawRequest({
        amount: Number(withdrawForm.amount),
        payment_info: withdrawForm.payment_info,
        note: withdrawForm.note,
      });
      setWithdrawSuccess('Withdrawal request submitted! The admin will review it shortly.');
      setWithdrawForm({ amount: '', payment_info: '', note: '' });
      getMyWithdrawRequests().then(r => setWithdrawHistory(r.data.results || r.data || [])).catch(() => {});
    } catch (err) {
      setWithdrawError(err.response?.data?.detail || 'Failed to submit request.');
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: "profile",       label: "Profile",       icon: <User size={18}/> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18}/> },
    { id: "security",      label: "Security",      icon: <Shield size={18}/> },
    { id: "privacy",       label: "Privacy",       icon: <Eye size={18}/> },
    { id: "appearance",    label: "Appearance",    icon: <Palette size={18}/> },
    { id: "payments",      label: "Payments",      icon: <DollarSign size={18}/> },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrap" style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}><img src="/src/assets/logo2.png" alt="Tayssir" style={{ width: '38px', height: '38px', objectFit: 'contain' }} /></div>
          <div className="brand-text"><h3>Tayssir Panel</h3><p>Teacher Portal</p></div>
        </div>

        <p className="nav-section-title">Main Menu</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-dashboard'); }}>
            <LayoutDashboard size={20}/><span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-profile'); }}>
            <User size={20}/><span>My Profile</span>
          </a>
        </nav>

        <p className="nav-section-title">Class Management</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-classes'); }}>
            <BookOpen size={20}/><span>Classes</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-students'); }}>
            <UsersIcon size={20}/><span>Students</span>
          </a>

        </nav>

        <p className="nav-section-title">Resources</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-library'); }}>
            <BookMarked size={20}/>
            <span>Library</span>
          </a>
        </nav>

        <p className="nav-section-title">Teaching</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-schedule'); }}>
            <Calendar size={20}/><span>Schedule</span>
          </a>
        </nav>

        <div className="sidebar-bottom"><a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-settings'); }}><Settings size={20} /><span>Settings</span></a><button className="nav-item" onClick={(e) => { e.preventDefault(); localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user'); navigate('/login'); }} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '10px', color: 'inherit' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>Sign Out</span></button></div>
      </aside>

      {/* Main Content */}
      <main className="main-content dashboard-bg">
        <header className="dash-header">
          <div className="header-greeting">
            <h1>Settings</h1>
            <p>Manage your account preferences and configurations</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={20}/><span className="badge-dot red"></span></button>
            <button className="icon-btn" onClick={() => handleModeChange(!isDarkMode)} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
               {isDarkMode ? <Sun size={20}/> : <Moon size={20} />}
            </button>
            <div className="user-avatar-wrapper" onClick={() => navigate('/teacher-profile')}>
              <div className="user-avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
              </div>
              <div className="online-indicator"></div>
            </div>
          </div>
        </header>

        <div className="settings-container">

          {/* Left Tabs */}
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab-btn ${activeTab === tab.id ? "active-tab" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
                <ChevronRight size={16} className="tab-arrow"/>
              </button>
            ))}
          </div>

          {/* Right Panel */}
          <div className="settings-panel">

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <div className="settings-section">
                <div className="section-heading">
                  <h2>Profile Information</h2>
                  <p>Update your personal details and public profile</p>
                </div>

                {/* Avatar Upload */}
                <div className="avatar-upload-row">
                  <div className="avatar-preview">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Avatar"/>
                    <button className="avatar-edit-btn"><Camera size={16}/></button>
                  </div>
                  <div>
                    <p className="avatar-hint-title">Profile Photo</p>
                    <p className="avatar-hint">JPG, PNG or GIF. Max size 2MB.</p>
                    <button className="btn-upload-avatar">Upload New Photo</button>
                  </div>
                </div>

                <div className="settings-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label>First Name</label>
                      <input type="text" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})}/>
                    </div>
                    <div className="form-field">
                      <label>Last Name</label>
                      <input type="text" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})}/>
                    </div>
                  </div>

                  <div className="form-field">
                    <label><Mail size={15}/> Email Address</label>
                    <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})}/>
                  </div>

                  <div className="form-field">
                    <label><Phone size={15}/> Phone Number</label>
                    <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})}/>
                  </div>

                  <div className="form-field">
                    <label><MapPin size={15}/> Location</label>
                    <input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})}/>
                  </div>

                  <div className="form-field">
                    <label>Bio</label>
                    <textarea rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}/>
                  </div>

                  <div className="form-field">
                    <label><Globe size={15}/> Language</label>
                    <select value={profile.language} onChange={e => setProfile({...profile, language: e.target.value})}>
                      <option>English</option>
                      <option>Arabic</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <div className="settings-section">
                <div className="section-heading">
                  <h2>Notification Preferences</h2>
                  <p>Choose what you want to be notified about</p>
                </div>

                <div className="notification-list">
                  {[
                    { key: "newStudent",           label: "New Student Enrolled",       desc: "Get notified when a new student joins your class" },
                    { key: "sessionReminder",       label: "Session Reminders",          desc: "Reminders 30 minutes before a session starts" },
                    { key: "assignmentSubmission",  label: "Assignment Submissions",     desc: "Alerts when students submit their assignments" },
                    { key: "messageAlert",          label: "New Messages",               desc: "Notifications for new direct messages" },
                    { key: "weeklyDigest",          label: "Weekly Digest",              desc: "A weekly summary of your class activity" },
                    { key: "platformNews",          label: "Platform News & Updates",    desc: "Stay informed about new Tayssir features" },
                  ].map(item => (
                    <div key={item.key} className="notif-row">
                      <div className="notif-info">
                        <p className="notif-label">{item.label}</p>
                        <p className="notif-desc">{item.desc}</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={() => setNotifications({...notifications, [item.key]: !notifications[item.key]})}
                        />
                        <span className="toggle-track"><span className="toggle-thumb"></span></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === "security" && (
              <div className="settings-section">
                <div className="section-heading">
                  <h2>Security Settings</h2>
                  <p>Keep your account safe and up-to-date</p>
                </div>

                <div className="settings-form">
                  <div className="form-field">
                    <label><Lock size={15}/> Current Password</label>
                    <div className="password-input">
                      <input type={showPassword ? "text" : "password"} placeholder="Enter your current password"/>
                      <button type="button" className="password-eye" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>
                  <div className="form-field">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password"/>
                  </div>
                  <div className="form-field">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Repeat new password"/>
                  </div>
                </div>

                <div className="security-info-box">
                  <Shield size={18} className="text-blue"/>
                  <div>
                    <p className="sec-title">Two-Factor Authentication</p>
                    <p className="sec-desc">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-2fa">Enable 2FA</button>
                </div>
              </div>
            )}

            {/* ── PRIVACY ── */}
            {activeTab === "privacy" && (
              <div className="settings-section">
                <div className="section-heading">
                  <h2>Privacy Controls</h2>
                  <p>Manage who can see your information</p>
                </div>

                <div className="notification-list">
                  {[
                    { key: "showProfile", label: "Public Profile",    desc: "Show your profile to enrolled students" },
                    { key: "showEmail",   label: "Show Email Address", desc: "Display your email address on your profile" },
                    { key: "showPhone",   label: "Show Phone Number",  desc: "Display your phone number on your profile" },
                  ].map(item => (
                    <div key={item.key} className="notif-row">
                      <div className="notif-info">
                        <p className="notif-label">{item.label}</p>
                        <p className="notif-desc">{item.desc}</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={privacy[item.key]}
                          onChange={() => setPrivacy({...privacy, [item.key]: !privacy[item.key]})}
                        />
                        <span className="toggle-track"><span className="toggle-thumb"></span></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── APPEARANCE ── */}
            {activeTab === "appearance" && (
              <div className="settings-section">
                <div className="set-panel animate-fade-in">
                  <h3 className="set-panel-title">Appearance</h3>
                  <p className="set-panel-sub">Customize how Tayssir looks for you</p>
                  
                  <div className="mode-cards">
                    <div className={`mode-card light ${!isDarkMode ? 'active' : ''}`} onClick={() => handleModeChange(false)}>
                      <div className="mode-card-preview" style={{ background: '#f8fafc' }}>
                         <div className="m-nav" style={{ background: 'var(--menu-grad-2)' }}></div>
                         <div className="m-content">
                           <div className="m-line" style={{ background: '#cbd5e1' }}></div>
                           <div className="m-line" style={{ background: '#e2e8f0' }}></div>
                         </div>
                      </div>
                      <div className="mode-label">Light Mode</div>
                      {!isDarkMode ? (
                        <div className="mode-badge active-badge"><Check size={12}/> Active</div>
                      ) : (
                        <div style={{ height: '24px' }}></div>
                      )}
                    </div>
                    <div className={`mode-card dark ${isDarkMode ? 'active' : ''}`} onClick={() => handleModeChange(true)}>
                      <div className="mode-card-preview" style={{ background: '#0f172a' }}>
                         <div className="m-nav" style={{ background: 'var(--menu-grad-2)' }}></div>
                         <div className="m-content">
                           <div className="m-line" style={{ background: '#334155' }}></div>
                           <div className="m-line" style={{ background: '#1e293b' }}></div>
                         </div>
                      </div>
                      <div className="mode-label">Dark Mode</div>
                      {isDarkMode ? (
                        <div className="mode-badge active-badge"><Check size={12}/> Active</div>
                      ) : (
                        <div style={{ height: '24px' }}></div>
                      )}
                    </div>
                  </div>

                  <div className="theme-section">
                    <h4 className="theme-sub-heading">Menu Theme</h4>
                    <p className="theme-desc">Select the background gradient for your main navigation menu.</p>
                    
                    <div className="theme-grid">
                      {MENU_THEMES.map((theme) => (
                        <div 
                          key={theme.id}
                          className={`theme-swatch ${activeMenuTheme === theme.id ? 'active' : ''}`}
                          style={{ background: `linear-gradient(135deg, ${theme.menuGrad[0]}, ${theme.menuGrad[3]})` }}
                          onClick={() => handleMenuThemeChange(theme)}
                          title={theme.name}
                        >
                          {activeMenuTheme === theme.id && <Check className="theme-check" color="white" size={24} />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="theme-section" style={{ marginTop: '32px' }}>
                    <h4 className="theme-sub-heading">Accent Color</h4>
                    <p className="theme-desc">Select the color used for buttons, toggles, and the active menu indicator.</p>
                    
                    <div className="theme-grid">
                      {ACCENT_COLORS.map((theme) => (
                        <div 
                          key={theme.id}
                          className={`theme-swatch ${activeAccentColor === theme.id ? 'active' : ''}`}
                          style={{ backgroundColor: theme.color }}
                          onClick={() => handleAccentColorChange(theme)}
                          title={theme.name}
                        >
                          {activeAccentColor === theme.id && <Check className="theme-check" color="white" size={24} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PAYMENTS ── */}
            {activeTab === "payments" && (
              <div className="settings-section">
                <div className="section-heading">
                  <h2>Earnings & Withdrawals</h2>
                  <p>View your earnings and request a withdrawal</p>
                </div>

                {/* Earnings summary cards */}
                {earnings && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {[
                      { label: 'Total Earned', value: earnings.total_earned, icon: <TrendingUp size={18}/>, color: '#10b981' },
                      { label: 'Pending Payout', value: earnings.total_pending, icon: <Clock size={18}/>, color: '#f59e0b' },
                      { label: 'Paid Out', value: earnings.total_paid_out, icon: <CheckCircle size={18}/>, color: '#3b82f6' },
                    ].map(card => (
                      <div key={card.label} style={{ background: 'var(--bg-card,#fff)', border: '1px solid var(--border-color,#e2e8f0)', borderRadius: '12px', padding: '18px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: card.color }}>{card.icon}<span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-light,#64748b)' }}>{card.label}</span></div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main,#0f172a)' }}>{Number(card.value).toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-light,#94a3b8)' }}>{earnings.currency}</span></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Withdrawal request form */}
                <div style={{ background: 'var(--bg-card,#fff)', border: '1px solid var(--border-color,#e2e8f0)', borderRadius: '14px', padding: '24px', marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main,#0f172a)', marginBottom: '4px' }}>Request Withdrawal</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-light,#64748b)', marginBottom: '20px' }}>Only pending earnings can be withdrawn. One request at a time.</p>

                  {withdrawError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
                      <AlertCircle size={15}/> {withdrawError}
                    </div>
                  )}
                  {withdrawSuccess && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#16a34a' }}>
                      <CheckCircle size={15}/> {withdrawSuccess}
                    </div>
                  )}

                  <form onSubmit={handleWithdrawSubmit} className="settings-form">
                    <div className="form-row">
                      <div className="form-field">
                        <label><DollarSign size={14}/> Amount ({earnings?.currency || 'DZD'})</label>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder={`Max: ${earnings ? Number(earnings.total_pending).toLocaleString() : '0'}`}
                          value={withdrawForm.amount}
                          onChange={e => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Payment Details</label>
                      <input
                        type="text"
                        placeholder="e.g. CCP: 1234567890 / BaridiMob: 0770123456"
                        value={withdrawForm.payment_info}
                        onChange={e => setWithdrawForm({ ...withdrawForm, payment_info: e.target.value })}
                      />
                      <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Enter your CCP, RIP, or mobile payment number</span>
                    </div>
                    <div className="form-field">
                      <label>Note (optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Any additional information for the admin"
                        value={withdrawForm.note}
                        onChange={e => setWithdrawForm({ ...withdrawForm, note: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={withdrawSubmitting}
                      style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 700, fontSize: '14px', cursor: withdrawSubmitting ? 'not-allowed' : 'pointer', opacity: withdrawSubmitting ? 0.7 : 1 }}
                    >
                      {withdrawSubmitting ? 'Submitting…' : 'Submit Request'}
                    </button>
                  </form>
                </div>

                {/* Withdrawal history */}
                {withdrawHistory.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main,#0f172a)', marginBottom: '14px' }}>Request History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {withdrawHistory.map(r => (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card,#fff)', border: '1px solid var(--border-color,#e2e8f0)', borderRadius: '10px', padding: '14px 18px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main,#0f172a)' }}>{Number(r.amount).toLocaleString()} {r.currency}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                            {r.admin_note && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Admin: {r.admin_note}</div>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                            background: r.status === 'approved' ? '#dcfce7' : r.status === 'rejected' ? '#fef2f2' : '#fef9c3',
                            color: r.status === 'approved' ? '#16a34a' : r.status === 'rejected' ? '#dc2626' : '#ca8a04'
                          }}>
                            {r.status === 'approved' ? <CheckCircle size={13}/> : r.status === 'rejected' ? <XCircle size={13}/> : <Clock size={13}/>}
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save Button — only shown on non-payments tabs */}
            {activeTab !== "payments" && (
            <div className="settings-footer">
              <button className={`btn-save-settings ${saved ? "saved" : ""}`} onClick={handleSave}>
                {saved ? <><Check size={18}/> Changes Saved!</> : "Save Changes"}
              </button>
            </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherSettings;



