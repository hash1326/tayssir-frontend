import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, LayoutDashboard, Calendar, FileText, MessageSquare,
  Settings, BookOpen, Users as UsersIcon, Award, Bell, BookMarked, Moon, Search,
  Clock, TrendingUp, Plus, Wand2, PlayCircle, Eye, AlertCircle, ChevronRight, BarChart3, Star, Inbox, Sun, MoreVertical, CheckCircle
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Area, AreaChart
} from 'recharts';
import { getTeacherDashboard } from "../../api/courses";
import { getCourseLiveSessions } from "../../api/live";
import "../../styles/teacher_pages/teacher_shared.css";
import "../../styles/teacher_pages/teacher_dash_pro.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const [myClasses, setMyClasses] = useState([]);
  const [dashStats, setDashStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    getTeacherDashboard().then((res) => {
      const d = res.data;
      setDashStats(d.stats);
      const mapped = (d.courses || []).map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        subject: c.short_description || c.category?.name || c.level || "",
        students: c.enrollment_count || 0,
        lessonCount: c.lesson_count || 0,
        status: c.status,
        image: c.thumbnail || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
      }));
      setMyClasses(mapped);

      // Fetch live sessions for all courses
      const slugs = mapped.map(c => c.slug).filter(Boolean);
      if (slugs.length > 0) {
        Promise.all(slugs.map(slug => getCourseLiveSessions(slug).then(r => r.data.results || r.data || []).catch(() => [])))
          .then(results => {
            const now = new Date();
            const all = results.flat()
              .filter(s => s.status !== 'ended' && new Date(s.scheduled_at) >= now)
              .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
              .slice(0, 3);
            setUpcomingSessions(all);
          });
      }
    }).catch(() => {});
  }, []);

  const [teacherName] = useState(() => {
    const userEmail = localStorage.getItem("currentUserEmail");
    if (userEmail) {
      const savedProfile = localStorage.getItem(userEmail + "_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.fullName) return parsed.fullName;
          if (parsed.lastName) return `Prof. ${parsed.lastName}`;
        } catch (e) {}
      }
    }
    return "Professor";
  });

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');

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
    
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, [isDarkMode]);


  /* ── Animation Variants ── */
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
  };

  /* ── Derived Metrics ── */
  const totalStudents = dashStats?.total_students ?? myClasses.reduce((sum, cls) => sum + (cls.students || 0), 0);
  const totalLessons = myClasses.reduce((sum, cls) => sum + (cls.lessonCount || 0), 0);
  const avgRating = dashStats?.avg_rating ?? '—';
  const enrollmentChartData = myClasses.slice(0, 7).map(c => ({
    name: c.title.length > 12 ? c.title.slice(0, 12) + '…' : c.title,
    students: c.students,
  }));

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
          <a href="#" className="nav-item active" onClick={(e) => e.preventDefault()}>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="td-main-content">
        
        {/* Top Header Row */}
        <header className="td-header">
          <div className="td-greeting">
            <h1>Welcome back, {teacherName}</h1>
            <p>Ready to inspire your students today?</p>
          </div>
          <div className="td-actions">
            <div className="td-search">
              <Search size={16} color="#64748b" />
              <input type="text" placeholder="Search classes, students..." />
            </div>
            
            <button className="td-icon-btn" onClick={() => { const newVal = !isDarkMode; setIsDarkMode(newVal); localStorage.setItem('platform-dark-mode', newVal); window.dispatchEvent(new Event('theme-changed')); }} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button className="td-icon-btn">
              <Bell size={18} />
              <span className="td-badge-dot"></span>
            </button>
            
            <div onClick={() => navigate('/teacher-profile')} style={{ position: 'relative' }}>
              <img className="td-user-avatar" src={`https://ui-avatars.com/api/?name=${teacherName.replace(' ', '+')}&background=4f46e5&color=fff`} alt="Profile" />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, background: '#10b981', border: '2px solid white', borderRadius: '50%' }} />
            </div>
          </div>
        </header>

        <div className="td-container">
          
          <motion.div variants={containerVars} initial="hidden" animate="show">
            
            {/* KPI Metrics */}
            <div className="td-metrics-row">
              <motion.div variants={itemVars} className="td-metric-card" onClick={() => navigate('/teacher-classes')}>
                <div className="td-metric-header">
                  <span className="td-metric-title">Published Classes</span>
                  <div className="td-metric-icon blue"><BookOpen size={20} /></div>
                </div>
                <div className="td-metric-value">{dashStats?.published_courses ?? myClasses.length}</div>
                <div className="td-metric-trend up"><TrendingUp size={14} /> {dashStats?.draft_courses ?? 0} draft <span>courses</span></div>
              </motion.div>

              <motion.div variants={itemVars} className="td-metric-card" onClick={() => navigate('/teacher-students')}>
                <div className="td-metric-header">
                  <span className="td-metric-title">Total Students</span>
                  <div className="td-metric-icon purple"><UsersIcon size={20} /></div>
                </div>
                <div className="td-metric-value">{totalStudents.toLocaleString()}</div>
                <div className="td-metric-trend up"><TrendingUp size={14} /> {dashStats?.total_enrollments ?? 0} <span>enrollments</span></div>
              </motion.div>

              <motion.div variants={itemVars} className="td-metric-card">
                <div className="td-metric-header">
                  <span className="td-metric-title">Total Lessons</span>
                  <div className="td-metric-icon orange"><FileText size={20} /></div>
                </div>
                <div className="td-metric-value">{totalLessons}</div>
                <div className="td-metric-trend up"><TrendingUp size={14} /> <span>across all courses</span></div>
              </motion.div>

              <motion.div variants={itemVars} className="td-metric-card">
                <div className="td-metric-header">
                  <span className="td-metric-title">Avg. Rating</span>
                  <div className="td-metric-icon green"><Star size={20} /></div>
                </div>
                <div className="td-metric-value">{avgRating}</div>
                <div className="td-metric-trend up"><TrendingUp size={14} /> <span>across all reviews</span></div>
              </motion.div>
            </div>

            {/* Main Grids */}
            <div className="td-content-grid">
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Classes Panel */}
                <motion.div variants={itemVars} className="td-panel">
                  <div className="td-panel-header">
                    <h3 className="td-panel-title">My Classes</h3>
                    {myClasses.length > 0 && <span onClick={() => navigate('/teacher-classes')} className="td-panel-action">View All</span>}
                  </div>

                  {myClasses.length > 0 ? (
                    <div className="td-classes-grid">
                      {myClasses.slice(0, 4).map((cls) => (
                        <div key={cls.id} className="td-class-card" onClick={() => navigate(`/teacher-class/${cls.slug}`)}>
                          <div className="td-class-cover">
                            <img src={cls.image} alt={cls.subject} />
                            <div className="td-class-overlay">
                              <span className="td-class-badge">{cls.subject}</span>
                            </div>
                          </div>
                          <div className="td-class-body">
                            <h4 className="td-class-title">{cls.title}</h4>
                            <div className="td-class-meta">
                              <span><UsersIcon size={14} /> {cls.students || 0}</span>
                              <span><Clock size={14} /> 12 Weeks</span>
                            </div>
                            <div className="td-progress-bg">
                              <div className="td-progress-fill" style={{ width: `${cls.lessonCount > 0 ? Math.min(100, cls.lessonCount * 5) : 0}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="td-empty-state">
                       <div className="td-empty-icon"><BookOpen size={32} /></div>
                       <h3 className="td-empty-title">No Classes Yet</h3>
                       <p className="td-empty-desc">Create your first class to start teaching and engaging with your students.</p>
                       <button onClick={() => navigate('/create-class')} className="td-panel-action" style={{ display: 'inline-flex', padding: '10px 24px', fontSize: '0.9rem', gap: '8px', alignItems: 'center' }}><Plus size={16}/> Create Class</button>
                    </div>
                  )}
                </motion.div>

                {/* Enrollment Chart */}
                <motion.div variants={itemVars} className="td-panel">
                  <div className="td-panel-header">
                    <h3 className="td-panel-title">Enrollments per Course</h3>
                  </div>
                  <div className="td-chart-container">
                    {enrollmentChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={enrollmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: isDarkMode ? '#1e293b' : 'white', color: isDarkMode ? '#f8fafc' : '#1e293b' }}
                          />
                          <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', flexDirection: 'column', gap: 8 }}>
                        <BarChart3 size={32} opacity={0.4} />
                        <p style={{ margin: 0, fontSize: 14 }}>No course data yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>

              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Upcoming Schedule */}
                <motion.div variants={itemVars} className="td-panel">
                  <div className="td-panel-header">
                    <h3 className="td-panel-title">Upcoming Sessions</h3>
                  </div>
                  
                  {upcomingSessions.length > 0 ? (
                    <div className="td-schedule-list">
                      {upcomingSessions.map(session => {
                        const dt = new Date(session.scheduled_at);
                        const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                        const [clock, ampm] = timeStr.split(' ');
                        return (
                          <div key={session.id} className="td-schedule-card">
                            <div className="td-schedule-time">
                              <div className="time">{clock}</div>
                              <div className="ampm">{ampm || ''}</div>
                            </div>
                            <div className="td-schedule-info">
                              <h4>{session.title}</h4>
                              <p><Clock size={12} /> {dt.toLocaleDateString()}</p>
                            </div>
                            <button className="td-schedule-action" style={session.status === 'live' ? {} : { background: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5' }}>
                              {session.status === 'live' ? 'Start' : 'Details'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="td-empty-state" style={{ padding: '20px' }}>
                       <Calendar size={28} style={{ marginBottom: 12, opacity: 0.5 }} />
                       <p className="td-empty-desc" style={{ marginBottom: 0 }}>No upcoming sessions scheduled.</p>
                    </div>
                  )}
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVars} className="td-panel" style={{ flex: 1 }}>
                  <div className="td-panel-header">
                    <h3 className="td-panel-title">Recent Activity</h3>
                  </div>
                  
                  {myClasses.length > 0 ? (
                    <div className="td-activity-list">
                      {myClasses.slice(0, 3).map(cls => (
                        <div key={cls.id} className="td-activity-item">
                          <div className="td-activity-icon green"><BookOpen size={18} /></div>
                          <div className="td-activity-content">
                            <p><strong>{cls.title}</strong> — {cls.students} student{cls.students !== 1 ? 's' : ''} enrolled</p>
                            <span className="td-activity-time">{cls.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="td-empty-state" style={{ padding: '20px' }}>
                      <Inbox size={28} style={{ marginBottom: 12, opacity: 0.5 }} />
                      <p className="td-empty-desc" style={{ marginBottom: 0 }}>No recent activity yet.</p>
                    </div>
                  )}
                </motion.div>

              </div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
