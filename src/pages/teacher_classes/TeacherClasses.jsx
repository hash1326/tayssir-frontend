import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, LayoutDashboard, Calendar, FileText, Settings,
  BookOpen, Users as UsersIcon, BookMarked, Search, Plus,
  MoreVertical, Copy, Settings2, Trash2, ArrowLeft, Filter,
  ExternalLink, LogOut, Sun, Moon, Bell
} from "lucide-react";
import * as coursesApi from "../../api/courses";
import "../../styles/teacher_pages/teacher_shared.css";
import "../../styles/teacher_classes/teacher_classes.css";

const TeacherClasses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');

  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teacher's courses from backend
  useEffect(() => {
    let mounted = true;
    coursesApi.getMyCourses().then((res) => {
      if (!mounted) return;
      const list = (res.data.results || res.data || []).map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        subject: c.short_description || c.category_name || c.level || "",
        students: c.active_enrollment_count || 0,
        status: c.status === "published" ? "active" : c.status,
        nextSession: "No session scheduled",
        image: c.thumbnail || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
        color: "blue",
        code: c.slug,
      }));
      setMyClasses(list);
    }).catch(() => {
      setMyClasses([]);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (slug, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await coursesApi.deleteCourse(slug);
      setMyClasses((prev) => prev.filter((c) => c.slug !== slug));
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.detail || "unknown error"));
    }
  };

  const [teacherName] = useState(() => {
    const userEmail = localStorage.getItem("currentUserEmail");
    if (userEmail) {
      const savedProfile = localStorage.getItem(userEmail + "_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.fullName) return parsed.fullName;
        } catch (e) {}
      }
    }
    return "Professor";
  });

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
    
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, [isDarkMode]);

  const filteredClasses = myClasses.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || cls.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Class code ${code} copied to clipboard!`);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrap" style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
            <img src="/src/assets/logo2.png" alt="Tayssir" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </div>
          <div className="brand-text">
            <h3>Tayssir Panel</h3>
            <p>Teacher Portal</p>
          </div>
        </div>

        <p className="nav-section-title">Main Menu</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-dashboard'); }}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-profile'); }}>
            <User size={20} />
            <span>My Profile</span>
          </a>
        </nav>

        <p className="nav-section-title">Class Management</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active" onClick={(e) => e.preventDefault()}>
            <BookOpen size={20} />
            <span>Classes</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-students'); }}>
            <UsersIcon size={20} />
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

        <div className="sidebar-bottom">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-settings'); }}>
            <Settings size={20} />
            <span>Settings</span>
          </a>
          <button 
            className="nav-item" 
            onClick={(e) => { e.preventDefault(); localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user'); navigate('/login'); }}
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '10px' }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="dash-header">
          <div className="header-greeting">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <button onClick={() => navigate('/teacher-dashboard')} className="icon-btn-round">
                <ArrowLeft size={18} />
              </button>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>My Classes</h1>
            </div>
            <p>Manage your virtual classrooms and students</p>
          </div>
          
          <div className="header-actions">
            <button 
              className="icon-btn" 
              onClick={() => { 
                const newVal = !isDarkMode; 
                setIsDarkMode(newVal); 
                localStorage.setItem('platform-dark-mode', newVal); 
                window.dispatchEvent(new Event('theme-changed')); 
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="user-avatar-wrapper" onClick={() => navigate('/teacher-profile')}>
              <div className="user-avatar">
                <img src={`https://ui-avatars.com/api/?name=${teacherName.replace(' ', '+')}&background=2563eb&color=fff`} alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        <div className="classes-container">
          {/* Toolbar */}
          <div className="classes-toolbar">
            <div className="search-box classes-search">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by class name or subject..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="toolbar-actions">
              <select 
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Classes</option>
                <option value="active">Active Only</option>
                <option value="archived">Archived</option>
              </select>
              
              <button className="btn-create-class" onClick={() => navigate('/create-class')}>
                <Plus size={18} />
                <span>Create New Class</span>
              </button>
            </div>
          </div>

          <div className="classroom-grid">
            {/* Create Card (Ghost) */}
            <div className="classroom-card ghost-card" onClick={() => navigate('/create-class')}>
              <div className="ghost-content">
                <div className="ghost-icon-wrap">
                  <Plus size={28} color="#3b82f6" />
                </div>
                <h3>Start New Classroom</h3>
                <p>Setup a new virtual environment</p>
              </div>
            </div>

            {/* Class Cards */}
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="classroom-card">
                <div className="classroom-cover">
                  <img src={cls.image || "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80"} alt={cls.title} />
                  <div className="classroom-cover-overlay">
                    <span className={`status-badge`}>
                      {cls.status || 'Active'}
                    </span>
                    <button className="cc-menu-btn">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="classroom-body">
                  <div className="cc-header">
                    <h3>{cls.title}</h3>
                    {cls.status === 'archived' && <span className="archived-tag">Archived</span>}
                  </div>
                  
                  <p className="cc-subtext">{cls.description || "No description provided for this classroom yet."}</p>
                  
                  <div className="cc-info-grid">
                    <div className="cc-info-item">
                      <UsersIcon size={16} className="text-blue" />
                      <span>{cls.students || 0} Students enrolled</span>
                    </div>
                    <div className="cc-info-item">
                      <BookOpen size={16} className="text-orange" />
                      <span>{cls.subject}</span>
                    </div>
                    <div className="cc-info-item" onClick={() => copyCode(cls.code || "XYZ123")}>
                      <Copy size={16} className="text-purple" />
                      <span>Code: <code className="block-code" title="Click to copy">{cls.code || "XYZ123"}</code></span>
                    </div>
                  </div>
                  
                  <div className="cc-actions">
                    <button 
                      className="btn-cc-primary" 
                      onClick={() => navigate(`/teacher-class/${cls.slug}`)}
                    >
                      <ExternalLink size={16} />
                      Enter Class
                    </button>
                    <button className="btn-cc-secondary" title="Class Settings">
                      <Settings2 size={18} />
                    </button>
                    <button
                      className="btn-cc-secondary"
                      title="Delete Class"
                      style={{ color: '#ef4444' }}
                      onClick={() => handleDelete(cls.slug, cls.title)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredClasses.length === 0 && searchQuery && (
              <div className="empty-state">
                <div className="empty-icon shadow-lg">
                  <Search size={48} color="#94a3b8" />
                </div>
                <h3>No classes found</h3>
                <p>We couldn't find any classes matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherClasses;
