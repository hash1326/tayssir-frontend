import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/StudentDashboard/Sidebar';
import Topbar from '../../components/StudentDashboard/Topbar';
import { Bell, Shield, Lock, Palette, ChevronRight, Check, Eye, User, Camera, X } from 'lucide-react';
import '../../styles/teacher_pages/dashboard.css';

const MENU_THEMES = [
  { 
    id: 'blue', name: 'Ocean Blue',
    menuGrad: ['#1a237e', '#283593', '#1565c0', '#0288d1']
  },
  { 
    id: 'red', name: 'Ruby Red',
    menuGrad: ['#450a0a', '#7f1d1d', '#b91c1c', '#ef4444'] 
  },
  { 
    id: 'pink', name: 'Sweet Pink',
    menuGrad: ['#4c0519', '#831843', '#be185d', '#e11d48'] 
  },
  { 
    id: 'purple', name: 'Royal Purple',
    menuGrad: ['#2e1065', '#4c1d95', '#6d28d9', '#7c3aed'] 
  },
  { 
    id: 'green', name: 'Emerald Green',
    menuGrad: ['#022c22', '#064e3b', '#047857', '#10b981'] 
  },
  { 
    id: 'orange', name: 'Sunset Orange',
    menuGrad: ['#431407', '#7c2d12', '#c2410c', '#ea580c'] 
  },
  { 
    id: 'dark', name: 'Midnight Dark',
    menuGrad: ['#0f172a', '#1e293b', '#334155', '#475569'] 
  }
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

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [activeMenuTheme, setActiveMenuTheme] = useState('blue');
  const [activeAccentColor, setActiveAccentColor] = useState('blue');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');

  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileEmail, setProfileEmail] = useState('user@tayssir.com');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [profileLevel, setProfileLevel] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // base64 or null
  const [profileSaved, setProfileSaved] = useState(false);
  const fileInputRef = useRef(null);

  const [toggles, setToggles] = useState({
    enrolled: true,
    reminders: true,
    assignments: false,
    messages: true,
    digest: false,
    news: true,
    publicProfile: true,
    showEmail: false,
    showPhone: false,
  });

  useEffect(() => {
    const savedMenuTheme = localStorage.getItem('platform-menu-theme') || 'blue';
    const savedAccentTheme = localStorage.getItem('platform-accent-color') || 'blue';
    const savedMode = localStorage.getItem('platform-dark-mode') === 'true';
    
    setActiveMenuTheme(savedMenuTheme);
    setActiveAccentColor(savedAccentTheme);
    
    applyMenuTheme(MENU_THEMES.find(t => t.id === savedMenuTheme) || MENU_THEMES[0]);
    applyAccentColor(ACCENT_COLORS.find(t => t.id === savedAccentTheme) || ACCENT_COLORS[0]);
    
    if (savedMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-mode');
    }

    // Load profile
    const savedName = localStorage.getItem('platform-profile-name') || '';
    const savedBio = localStorage.getItem('platform-profile-bio') || '';
    const savedEmail = localStorage.getItem('platform-profile-email') || 'user@tayssir.com';
    const savedPhone = localStorage.getItem('platform-profile-phone') || '';
    const savedDob = localStorage.getItem('platform-profile-dob') || '';
    const savedLevel = localStorage.getItem('platform-profile-level') || '';
    const savedLocation = localStorage.getItem('platform-profile-location') || '';
    const savedPhoto = localStorage.getItem('platform-profile-photo') || null;
    setProfileName(savedName);
    setProfileBio(savedBio);
    setProfileEmail(savedEmail);
    setProfilePhone(savedPhone);
    setProfileDob(savedDob);
    setProfileLevel(savedLevel);
    setProfileLocation(savedLocation);
    setProfilePhoto(savedPhoto);

    const syncTheme = () => {
      const isDark = localStorage.getItem('platform-dark-mode') === 'true';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    };

    window.addEventListener('theme-changed', syncTheme);
    return () => window.removeEventListener('theme-changed', syncTheme);
  }, []);

  const handleToggle = (key) => setToggles(p => ({...p, [key]: !p[key]}));

  const applyMenuTheme = (theme) => {
    document.documentElement.style.setProperty('--menu-grad-1', theme.menuGrad[0]);
    document.documentElement.style.setProperty('--menu-grad-2', theme.menuGrad[1]);
    document.documentElement.style.setProperty('--menu-grad-3', theme.menuGrad[2]);
    document.documentElement.style.setProperty('--menu-grad-4', theme.menuGrad[3]);
  };

  const applyAccentColor = (theme) => {
    document.documentElement.style.setProperty('--primary-color', theme.color);
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

  const handleModeChange = (dark) => {
    setIsDarkMode(dark);
    localStorage.setItem('platform-dark-mode', dark);
    if (dark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    window.dispatchEvent(new Event('theme-changed'));
  };

  // Profile handlers
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target.result;
      setProfilePhoto(data);
      localStorage.setItem('platform-profile-photo', data);
      window.dispatchEvent(new Event('profile-changed'));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    localStorage.removeItem('platform-profile-photo');
    window.dispatchEvent(new Event('profile-changed'));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('platform-profile-name', profileName);
    localStorage.setItem('platform-profile-bio', profileBio);
    localStorage.setItem('platform-profile-email', profileEmail);
    localStorage.setItem('platform-profile-phone', profilePhone);
    localStorage.setItem('platform-profile-dob', profileDob);
    localStorage.setItem('platform-profile-level', profileLevel);
    localStorage.setItem('platform-profile-location', profileLocation);
    if (profilePhoto) {
      localStorage.setItem('platform-profile-photo', profilePhoto);
    } else {
      localStorage.removeItem('platform-profile-photo');
    }
    // Notify other components
    window.dispatchEvent(new Event('profile-changed'));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const displayInitial = profileName ? profileName.trim()[0].toUpperCase() : 'U';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content dashboard-bg">
        <Topbar />
        
        <div className="content">
          <div className="set-wrapper">
            <div className="set-header">
              <h2>Settings</h2>
              <p>Manage your account preferences and configurations</p>
            </div>
            
            <div className="set-layout">
              <div className="set-sidebar">
                <button 
                  className={`set-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <div className="set-nav-left">
                    <User size={18} />
                    <span>Profile</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`set-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('appearance')}
                >
                  <div className="set-nav-left">
                    <Palette size={18} />
                    <span>Appearance</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`set-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <div className="set-nav-left">
                    <Bell size={18} />
                    <span>Notifications</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`set-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <div className="set-nav-left">
                    <Shield size={18} />
                    <span>Security</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`set-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('privacy')}
                >
                  <div className="set-nav-left">
                    <Lock size={18} />
                    <span>Privacy</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="set-content">

                {/* ── PROFILE TAB ── */}
                {activeTab === 'profile' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">Profile</h3>
                    <p className="set-panel-sub">Update your personal information and profile photo</p>

                    {/* Avatar upload */}
                    <div className="prof-avatar-row">
                      <div className="prof-avatar-wrap">
                        {profilePhoto ? (
                          <img src={profilePhoto} alt="Profile" className="prof-avatar-img" />
                        ) : (
                          <div className="prof-avatar-placeholder">
                            {displayInitial}
                          </div>
                        )}
                        <button
                          className="prof-camera-btn"
                          onClick={() => fileInputRef.current?.click()}
                          title="Change photo"
                        >
                          <Camera size={15} />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handlePhotoChange}
                        />
                      </div>
                      <div className="prof-avatar-info">
                        <div className="prof-avatar-name">{profileName || 'Your Name'}</div>
                        <div className="prof-avatar-role">Student · Tayssir Platform</div>
                        <div className="prof-avatar-btns">
                          <button className="prof-upload-btn" onClick={() => fileInputRef.current?.click()}>
                            Upload Photo
                          </button>
                          {profilePhoto && (
                            <button className="prof-remove-btn" onClick={handleRemovePhoto}>
                              <X size={13} /> Remove
                            </button>
                          )}
                        </div>
                        <p className="prof-avatar-hint">JPG, PNG or GIF. Max 5MB.</p>
                      </div>
                    </div>

                    {/* Form fields */}
                    <div className="prof-form">
                      <div className="prof-form-row">
                        <div className="set-input-group">
                          <label className="set-label">Full Name</label>
                          <div className="set-input-wrap">
                            <input
                              type="text"
                              placeholder="Enter your full name"
                              value={profileName}
                              onChange={e => setProfileName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="set-input-group">
                          <label className="set-label">Email Address</label>
                          <div className="set-input-wrap">
                            <input
                              type="email"
                              placeholder="Enter your email"
                              value={profileEmail}
                              onChange={e => setProfileEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="prof-form-row">
                        <div className="set-input-group">
                          <label className="set-label">Phone Number</label>
                          <div className="set-input-wrap">
                            <input
                              type="tel"
                              placeholder="+213 5XX XXX XXX"
                              value={profilePhone}
                              onChange={e => setProfilePhone(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="set-input-group">
                          <label className="set-label">Role</label>
                          <div className="set-input-wrap">
                            <input type="text" value="Student" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                          </div>
                        </div>
                      </div>

                      <div className="prof-form-row">
                        <div className="set-input-group">
                          <label className="set-label">Date of Birth</label>
                          <div className="set-input-wrap">
                            <input
                              type="date"
                              value={profileDob}
                              onChange={e => setProfileDob(e.target.value)}
                              style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', color: '#1e293b' }}
                            />
                          </div>
                        </div>
                        <div className="set-input-group">
                          <label className="set-label">Education Level</label>
                          <div className="set-input-wrap">
                            <select 
                              value={profileLevel}
                              onChange={e => setProfileLevel(e.target.value)}
                              style={{ width: '100%', padding: '0.625rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', color: '#1e293b', background: 'white' }}
                            >
                              <option value="">Select Level</option>
                              <option value="Middle School">Middle School</option>
                              <option value="High School">High School</option>
                              <option value="Undergraduate">Undergraduate</option>
                              <option value="Postgraduate">Postgraduate</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="set-input-group">
                        <label className="set-label">Location / Address</label>
                        <div className="set-input-wrap">
                          <input
                            type="text"
                            placeholder="Enter your city or address"
                            value={profileLocation}
                            onChange={e => setProfileLocation(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="set-input-group">
                        <label className="set-label">Bio</label>
                        <div className="set-input-wrap">
                          <textarea
                            className="prof-bio-textarea"
                            placeholder="Tell us a little about yourself…"
                            value={profileBio}
                            onChange={e => setProfileBio(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="set-save-footer">
                      {profileSaved && (
                        <div className="prof-saved-toast">
                          <Check size={14} /> Profile saved!
                        </div>
                      )}
                      <button className="set-btn-save" onClick={handleSaveProfile}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
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
                      <p className="theme-desc">Select the color used for buttons, toggles, and the active menu indicator (the small bar).</p>
                      
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
                )}

                {activeTab === 'notifications' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">Notification Preferences</h3>
                    <p className="set-panel-sub">Choose what you want to be notified about</p>
                    
                    <div className="set-list">
                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>New Student Enrolled</h4>
                          <p>Get notified when a new student joins your class</p>
                        </div>
                        <div className={`set-toggle ${toggles.enrolled ? 'on' : 'off'}`} onClick={() => handleToggle('enrolled')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>
                      
                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Session Reminders</h4>
                          <p>Reminders 30 minutes before a session starts</p>
                        </div>
                        <div className={`set-toggle ${toggles.reminders ? 'on' : 'off'}`} onClick={() => handleToggle('reminders')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Assignment Submissions</h4>
                          <p>Alerts when students submit their assignments</p>
                        </div>
                        <div className={`set-toggle ${toggles.assignments ? 'on' : 'off'}`} onClick={() => handleToggle('assignments')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>New Messages</h4>
                          <p>Notifications for new direct messages</p>
                        </div>
                        <div className={`set-toggle ${toggles.messages ? 'on' : 'off'}`} onClick={() => handleToggle('messages')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Weekly Digest</h4>
                          <p>A weekly summary of your class activity</p>
                        </div>
                        <div className={`set-toggle ${toggles.digest ? 'on' : 'off'}`} onClick={() => handleToggle('digest')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Platform News &amp; Updates</h4>
                          <p>Stay informed about new Tayssir features</p>
                        </div>
                        <div className={`set-toggle ${toggles.news ? 'on' : 'off'}`} onClick={() => handleToggle('news')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">Security Settings</h3>
                    <p className="set-panel-sub">Keep your account safe and up-to-date</p>
                    
                    <div style={{ maxWidth: '600px', marginTop: '32px' }}>
                      <div className="set-input-group">
                        <label className="set-label"><Lock size={14} /> Current Password</label>
                        <div className="set-input-wrap">
                          <input type="password" placeholder="Enter your current password" />
                          <Eye size={18} className="set-input-icon" />
                        </div>
                      </div>

                      <div className="set-input-group">
                        <label className="set-label">New Password</label>
                        <div className="set-input-wrap">
                          <input type="password" placeholder="Enter new password" />
                        </div>
                      </div>

                      <div className="set-input-group">
                        <label className="set-label">Confirm New Password</label>
                        <div className="set-input-wrap">
                          <input type="password" placeholder="Repeat new password" />
                        </div>
                      </div>
                    </div>

                    <div className="set-box">
                      <div className="set-box-icon">
                        <Shield size={22} />
                      </div>
                      <div className="set-box-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <button className="set-btn-dark" style={{ background: isDarkMode ? '#f8fafc' : '#0f172a', color: isDarkMode ? '#0f172a' : 'white' }}>Enable 2FA</button>
                    </div>

                    <div className="set-save-footer">
                      <button className="set-btn-save">Save Changes</button>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">Privacy Controls</h3>
                    <p className="set-panel-sub">Manage who can see your information</p>
                    
                    <div className="set-list">
                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Public Profile</h4>
                          <p>Show your profile to enrolled students</p>
                        </div>
                        <div className={`set-toggle ${toggles.publicProfile ? 'on' : 'off'}`} onClick={() => handleToggle('publicProfile')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>
                      
                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Show Email Address</h4>
                          <p>Display your email address on your profile</p>
                        </div>
                        <div className={`set-toggle ${toggles.showEmail ? 'on' : 'off'}`} onClick={() => handleToggle('showEmail')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Show Phone Number</h4>
                          <p>Display your phone number on your profile</p>
                        </div>
                        <div className={`set-toggle ${toggles.showPhone ? 'on' : 'off'}`} onClick={() => handleToggle('showPhone')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>
                    </div>

                    <div className="set-save-footer">
                      <button className="set-btn-save">Save Changes</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
