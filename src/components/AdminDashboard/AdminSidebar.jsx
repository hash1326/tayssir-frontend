import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users as UsersIcon, BookOpen, GraduationCap,
  BookMarked, Shield, Flag, Settings, LogOut
} from "lucide-react";
import logo from '../../assets/logo2.png';
import '../../styles/teacher_pages/teacher_shared.css';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-wrap" style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
          <img src={logo} alt="Tayssir Logo" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
        </div>
        <div className="brand-text">
          <h3>Tayssir Panel</h3>
          <p>Admin Portal</p>
        </div>
      </div>

      <p className="nav-section-title">Main Menu</p>
      <nav className="sidebar-nav">
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
      </nav>

      <p className="nav-section-title">Management</p>
      <nav className="sidebar-nav">
        <NavLink to="/admin/teachers" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <GraduationCap size={20} />
          <span>Teachers</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <UsersIcon size={20} />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/courses" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <BookOpen size={20} />
          <span>Courses</span>
        </NavLink>
        <NavLink to="/admin/library" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <BookMarked size={20} />
          <span>Library</span>
        </NavLink>
      </nav>

      <p className="nav-section-title">System Info</p>
      <nav className="sidebar-nav">
        <NavLink to="/admin/security" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Shield size={20} />
          <span>Security</span>
        </NavLink>
        <NavLink to="/admin/moderation" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Flag size={20} />
          <span>Moderation</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button
          className="nav-item"
          onClick={handleSignOut}
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '6px' }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

