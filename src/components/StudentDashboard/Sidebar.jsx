import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users as UsersIcon,
  Calendar, BookMarked, Settings, LogOut
} from "lucide-react";
import logo from '../../assets/logo2.png';
import '../../styles/teacher_pages/teacher_shared.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState('User');

  useEffect(() => {
    const loadProfile = () => {
      const savedName = localStorage.getItem('platform-profile-name');
      if (savedName) setProfileName(savedName);
    };
    loadProfile();
    window.addEventListener('profile-changed', loadProfile);
    return () => window.removeEventListener('profile-changed', loadProfile);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-wrap" style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
          <img src={logo} alt="Tayssir Logo" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
        </div>
        <div className="brand-text">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0' }}>Tayssir Panel</h3>
        </div>
      </div>

      <p className="nav-section-title">Main Menu</p>
      <nav className="sidebar-nav">
        <NavLink to="/student-dashboard" end className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/student-classrooms" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <BookOpen size={20} />
          <span>Classrooms</span>
        </NavLink>
      </nav>

      <p className="nav-section-title">Community</p>
      <nav className="sidebar-nav">
        <NavLink to="/courses" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <UsersIcon size={20} />
          <span>Courses</span>
        </NavLink>
      </nav>

      <p className="nav-section-title">Resources</p>
      <nav className="sidebar-nav">
        <NavLink to="/student-schedule" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Calendar size={20} />
          <span>Schedule</span>
        </NavLink>
        <NavLink to="/student-library" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <BookMarked size={20} />
          <span>Library</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/student-settings" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button
          className="nav-item"
          onClick={() => { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user'); navigate('/login'); }}
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '6px' }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
