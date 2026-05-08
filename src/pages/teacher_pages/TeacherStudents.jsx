import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, LayoutDashboard, Calendar, FileText, MessageSquare, 
  Settings, BookOpen, Users as UsersIcon, Award, Bell, BookMarked, Moon, Search,
  Mail, Trash2, ShieldAlert, Sun
} from "lucide-react";
import "../../styles/teacher_pages/teacher_shared.css";
import "../../styles/teacher_pages/teacher_students.css";
import "../../styles/teacher_pages/teacher_dashboard.css";
import { getTeacherDashboard, getCourseStudents } from "../../api/courses";

const TeacherStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("All");

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');

  React.useEffect(() => {
    // Load all students across all teacher's courses
    getTeacherDashboard()
      .then(res => {
        const courses = res.data.courses || [];
        return Promise.all(
          courses.map(c =>
            getCourseStudents(c.slug)
              .then(r => (r.data.results || r.data || []).map(enr => {
                const u = enr.student || enr;
                const name = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || '—';
                const progress = Math.round(enr.progress_percent || 0);
                const performance = progress >= 80 ? 'Excellent' : progress >= 50 ? 'Good' : progress > 0 ? 'Needs Work' : 'Just Started';
                return {
                  id: `${c.id}-${enr.id}`,
                  name,
                  email: u.email || '—',
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`,
                  enrolledIn: [c.title],
                  progress,
                  performance,
                  status: enr.status || 'active',
                  joinDate: (enr.enrolled_at || '').slice(0, 10),
                };
              }))
              .catch(() => [])
          )
        );
      })
      .then(results => {
        // Deduplicate by email across courses
        const seen = new Set();
        const merged = [];
        results.flat().forEach(s => {
          if (seen.has(s.email)) {
            const existing = merged.find(m => m.email === s.email);
            if (existing) existing.enrolledIn = [...new Set([...existing.enrolledIn, ...s.enrolledIn])];
          } else {
            seen.add(s.email);
            merged.push(s);
          }
        });
        setStudents(merged);
      })
      .catch(() => {});
  }, []);

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

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to completely remove ${name} from your classes?`)) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterClass === "All" || student.enrolledIn.includes(filterClass);
    return matchesSearch && matchesFilter;
  });

  // Extract unique classes for the filter dropdown
  const allClasses = ["All", ...new Set(students.flatMap(s => s.enrolledIn))];

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation (Reused from Dashboard) */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrap" style={{ background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}><img src="/src/assets/logo2.png" alt="Tayssir" style={{ width: '38px', height: '38px', objectFit: 'contain' }} /></div>
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
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-classes'); }}>
            <BookOpen size={20} />
            <span>Classes</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => e.preventDefault()}>
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
          <a href="#" className="nav-item">
            <Calendar size={20} />
            <span>Schedule</span>
          </a>
        </nav>

        <div className="sidebar-bottom"><a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-settings'); }}><Settings size={20} /><span>Settings</span></a><button className="nav-item" onClick={(e) => { e.preventDefault(); localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user'); navigate('/login'); }} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '10px', color: 'inherit' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>Sign Out</span></button></div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content dashboard-bg">
        {/* Top Header Row */}
        <header className="dash-header">
          <div className="header-greeting">
            <h1>Student Roster</h1>
            <p>Search, manage, and monitor all enrolled students</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={20} /><span className="badge-dot red"></span></button>
            <button className="icon-btn" onClick={() => { const newVal = !isDarkMode; setIsDarkMode(newVal); localStorage.setItem('platform-dark-mode', newVal); window.dispatchEvent(new Event('theme-changed')); }} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="user-avatar-wrapper" onClick={() => navigate('/teacher-profile')}>
              <div className="user-avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
              </div>
              <div className="online-indicator"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="students-container">
          
          {/* Action Toolbar */}
          <div className="students-toolbar">
            <div className="search-box students-search">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Find a student by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="toolbar-actions">
              <select 
                className="filter-select"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                {allClasses.map((cls, idx) => (
                  <option key={idx} value={cls}>{cls === "All" ? "All Classrooms" : cls}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Students Grid */}
          <div className="student-grid" style={students.length === 0 ? { display: 'block' } : {}}>
            {students.length === 0 ? (
              <div className="text-center py-[80px] bg-slate-50 dark:bg-[#1e293b] rounded-xl border border-dashed border-slate-300 dark:border-white/10 mt-4">
                 <UsersIcon size={48} className="mx-auto mb-4 opacity-80 text-blue-500" />
                 <p className="mb-3 text-[1.1rem] font-semibold text-slate-900 dark:text-white">You have no enrolled students</p>
                 <p className="text-[0.95rem] text-slate-500 dark:text-zinc-400 max-w-[400px] mx-auto">Share your class codes or invite links to enroll students into your classrooms.</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student.id} className="student-card">
                  
                  <div className="sc-header">
                    <img src={student.avatar} alt={student.name} className="sc-avatar" />
                    <div className="sc-info">
                      <h3>{student.name}</h3>
                      <p className="sc-email"><Mail size={12}/> {student.email}</p>
                    </div>
                  </div>

                  <div className="sc-body">
                    <div className="sc-detail-row">
                      <span className="sc-label">Enrolled:</span>
                      <div className="sc-badges">
                        {student.enrolledIn.map((cls, idx) => (
                          <span key={idx} className="sc-class-badge">{cls}</span>
                        ))}
                      </div>
                    </div>

                    <div className="sc-detail-row space-between">
                      <span className="sc-label">Performance:</span>
                      <span className={`perf-badge ${student.performance.replace(" ", "-").toLowerCase()}`}>
                        {student.performance}
                      </span>
                    </div>

                    <div className="sc-detail-row space-between">
                      <span className="sc-label">Joined:</span>
                      <span className="sc-value">{student.joinDate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="sc-actions">
                    <button className="btn-sc-message">
                      <MessageSquare size={16}/> Message
                    </button>
                    <button 
                      className="btn-sc-delete" 
                      onClick={() => handleDelete(student.id, student.name)}
                      title="Remove Student"
                    >
                      <Trash2 size={16}/> Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <ShieldAlert size={48} className="empty-icon text-gray-400" />
                <h3>No students found</h3>
                <p>We couldn't find any students matching your search criteria.</p>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherStudents;



