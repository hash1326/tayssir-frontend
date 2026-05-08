import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAllRead as apiMarkAllRead, markNotificationRead } from '../../api/notifications';
import NotificationDropdown from '../shared/NotificationDropdown';

const Topbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');
  const [notifications, setNotifications] = useState([]);
  
  const [profileName, setProfileName] = useState('User');
  const [profileEmail, setProfileEmail] = useState('user@tayssir.com');
  const [profilePhoto, setProfilePhoto] = useState(null);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    getNotifications({ limit: 20 })
      .then(res => setNotifications(res.data.results || res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    // Sync dark mode
    const syncDarkMode = () => {
      const dark = localStorage.getItem('platform-dark-mode') === 'true';
      setIsDarkMode(dark);
    };
    syncDarkMode();
    window.addEventListener('theme-changed', syncDarkMode);

    const loadProfile = () => {
      const savedName = localStorage.getItem('platform-profile-name');
      const savedEmail = localStorage.getItem('platform-profile-email');
      const savedPhoto = localStorage.getItem('platform-profile-photo');
      if (savedName) setProfileName(savedName);
      if (savedEmail) setProfileEmail(savedEmail);
      if (savedPhoto) setProfilePhoto(savedPhoto);
      else setProfilePhoto(null);
    };
    loadProfile();
    window.addEventListener('profile-changed', loadProfile);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('theme-changed', syncDarkMode);
      window.removeEventListener('profile-changed', loadProfile);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('platform-dark-mode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    window.dispatchEvent(new Event('theme-changed'));
  };

  const markAllRead = () => {
    apiMarkAllRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = (id) => {
    markNotificationRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
      </div>
      <div className="topbar-right">
        {/* Dark mode toggle */}
        <div className="icon-btn" onClick={toggleDarkMode} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
          {isDarkMode ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
          )}
        </div>

        {/* Notification Bell */}
        <div className="notif-wrapper" ref={notifRef}>
          <div className="icon-btn" onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }} title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && <div className="notif-dot"></div>}
          </div>

          {notifOpen && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={markRead}
              onMarkAllRead={markAllRead}
            />
          )}
        </div>

        {/* Profile dropdown */}
        <div className="profile-wrapper" ref={profileRef}>
          <div className="topbar-profile" onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}>
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            )}
            <div className="profile-online"></div>
          </div>
          <div className={`profile-dropdown ${profileOpen ? 'open' : ''}`} id="profileDropdown">
            <div className="pd-header">
              <div className="pd-avatar" style={{ padding: profilePhoto ? '0' : undefined, overflow: 'hidden' }}>
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profileName.trim() ? profileName.trim()[0].toUpperCase() : 'U'
                )}
              </div>
              <div>
                <div className="pd-name">{profileName}</div>
                <div className="pd-email">{profileEmail}</div>
                <div className="pd-status"><span className="pd-status-dot"></span> Online</div>
              </div>
            </div>
            <div className="pd-body">
              <div className="pd-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                Full Name
                <span className="pd-row-val">{profileName}</span>
              </div>
              <div className="pd-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email
                <span className="pd-row-val">{profileEmail}</span>
              </div>
              <div className="pd-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                Role
                <span className="pd-row-val">Student</span>
              </div>
              <div className="pd-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Joined
                <span className="pd-row-val">Sept 2024</span>
              </div>
              <div className="pd-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>
                Enrolled Courses
                <span className="pd-row-val">12</span>
              </div>
              <div className="pd-divider"></div>
              <div className="pd-row" onClick={() => { setProfileOpen(false); navigate('/student/settings'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                Settings
              </div>
              <div className="pd-divider"></div>
              <div className="pd-signout" onClick={handleSignOut}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
