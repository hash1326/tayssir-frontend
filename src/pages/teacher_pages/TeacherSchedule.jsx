import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, LayoutDashboard, Calendar as CalendarIcon, FileText, MessageSquare,
  Settings, BookOpen, Users as UsersIcon, Award, Bell,
  ChevronLeft, ChevronRight, Plus, MapPin, Clock, Video, X, CheckCircle, Moon, Sun
} from "lucide-react";
import { getMyCourses } from "../../api/courses";
import { getCourseLiveSessions } from "../../api/live";
import "../../styles/teacher_pages/teacher_schedule.css";
import "../../styles/teacher_pages/teacher_dashboard.css";

const formatTime12 = (date) => {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${ampm}`;
};

const formatDateLabel = (dateStr) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'long' });
  if (dateStr === todayStr) return `Today, ${day} ${month}`;
  if (dateStr === tomorrowStr) return `Tomorrow, ${day} ${month}`;
  return `${d.toLocaleString('en-US', { weekday: 'long' })}, ${day} ${month}`;
};

const TeacherSchedule = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "Live Class",
    date: "",
    startTime: "",
    endTime: "",
    link: "",
    color: "blue"
  });

  const typeColorMap = {
    "Live Class": "blue",
    "Meeting": "purple",
    "Assignment": "orange",
    "Planning": "gray"
  };

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

  const handleTypeChange = (type) => {
    setNewEvent({ ...newEvent, type, color: typeColorMap[type] || "blue" });
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowModal(false);
      setNewEvent({ title: "", type: "Live Class", date: "", startTime: "", endTime: "", link: "", color: "blue" });
    }, 1500);
  };

  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    getMyCourses()
      .then(res => {
        const courses = res.data.results || res.data || [];
        return Promise.all(
          courses.map(c =>
            getCourseLiveSessions(c.slug || c.id)
              .then(r => (r.data.results || r.data || []).map(s => ({ ...s, courseName: c.title })))
              .catch(() => [])
          )
        );
      })
      .then(allSessions => {
        const flat = allSessions.flat();
        const groups = {};
        flat.forEach(s => {
          if (!s.started_at) return;
          const start = new Date(s.started_at);
          const end = s.ended_at ? new Date(s.ended_at) : null;
          const dateStr = start.toISOString().slice(0, 10);
          if (!groups[dateStr]) groups[dateStr] = [];
          const durationMs = end ? end - start : 0;
          const dh = Math.floor(durationMs / 3600000);
          const dm = Math.floor((durationMs % 3600000) / 60000);
          const durationStr = dh > 0 ? `${dh}h${dm > 0 ? ` ${dm}m` : ''}` : `${dm}m`;
          groups[dateStr].push({
            id: s.id,
            time: `${formatTime12(start)}${end ? ' - ' + formatTime12(end) : ''}`,
            title: s.courseName || 'Live Class',
            type: 'Live Class',
            duration: durationStr,
            link: 'Tayssir Live',
            color: 'blue',
          });
        });
        const sorted = Object.entries(groups)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([dateStr, events]) => ({
            date: formatDateLabel(dateStr),
            isToday: dateStr === new Date().toISOString().slice(0, 10),
            events,
          }));
        setScheduleData(sorted);
      })
      .catch(() => {});
  }, []);

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const dates = Array.from({length: 31}, (_, i) => i + 1);

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
            <LayoutDashboard size={20} /><span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-profile'); }}>
            <User size={20} /><span>My Profile</span>
          </a>
        </nav>

        <p className="nav-section-title">Class Management</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-classes'); }}>
            <BookOpen size={20} /><span>Classes</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-students'); }}>
            <UsersIcon size={20} /><span>Students</span>
          </a>
        </nav>

        <p className="nav-section-title">Resources</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-library'); }}>
            <CalendarIcon size={20} />
            <span>Library</span>
          </a>
        </nav>

        <p className="nav-section-title">Teaching</p>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active" onClick={(e) => e.preventDefault()}>
            <CalendarIcon size={20} /><span>Schedule</span>
          </a>
        </nav>

        <div className="sidebar-bottom"><a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/teacher-settings'); }}><Settings size={20} /><span>Settings</span></a><button className="nav-item" onClick={(e) => { e.preventDefault(); localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('user'); navigate('/login'); }} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '10px', color: 'inherit' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>Sign Out</span></button></div>
      </aside>

      {/* Main Content */}
      <main className="main-content dashboard-bg">
        <header className="dash-header">
          <div className="header-greeting">
            <h1>My Schedule</h1>
            <p>Plan and manage your upcoming classes and meetings</p>
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

        <div className="schedule-container">
          {/* Left: Agenda */}
          <div className="schedule-agenda">
            <div className="agenda-toolbar">
              <h2>Upcoming Events</h2>
              <div className="agenda-filters">
                <button className="btn-filter active">Agenda</button>
                <button className="btn-filter">Day</button>
                <button className="btn-filter">Week</button>
              </div>
            </div>

            <div className="agenda-list">
              {scheduleData.length === 0 && (
                <p style={{ color: '#94a3b8', padding: '32px', textAlign: 'center', fontSize: '14px' }}>No upcoming live sessions scheduled.</p>
              )}
              {scheduleData.map((dayGroup, i) => (
                <div key={i} className="agenda-day-group">
                  <div className="day-header">
                    <h3 className={dayGroup.isToday ? "text-blue" : ""}>
                      {dayGroup.date} {dayGroup.isToday && <span className="today-badge">TODAY</span>}
                    </h3>
                  </div>
                  <div className="day-events">
                    {dayGroup.events.map((evt) => (
                      <div key={evt.id} className={`event-card border-${evt.color}`}>
                        <div className="event-time">
                          <p>{evt.time.split(" - ")[0]}</p>
                          <span>{evt.duration}</span>
                        </div>
                        <div className="event-details">
                          <div className={`event-type-tag bg-${evt.color}-light text-${evt.color}`}>{evt.type}</div>
                          <h4>{evt.title}</h4>
                          <div className="event-meta">
                            <span>
                              {evt.link.includes("Zoom") || evt.link.includes("Meet") ? <Video size={14}/> : <MapPin size={14}/>}
                              {evt.link}
                            </span>
                            <span><UsersIcon size={14}/> Class roster</span>
                          </div>
                        </div>
                        <div className="event-actions">
                          <button className="btn-start-event">Start <ChevronRight size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="schedule-sidebar">
            <button className="btn-new-event" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Add New Event
            </button>

            <div className="mini-calendar">
              <div className="mc-header">
                <h3>March 2026</h3>
                <div className="mc-nav">
                  <button><ChevronLeft size={18}/></button>
                  <button><ChevronRight size={18}/></button>
                </div>
              </div>
              <div className="mc-grid">
                {days.map(d => <div key={d} className="mc-day-name">{d}</div>)}
                <div className="mc-empty"></div>
                <div className="mc-empty"></div>
                {dates.map(d => (
                  <div key={d} className={`mc-date ${d === 24 ? "active" : ""} ${[25, 26, 28].includes(d) ? "has-event" : ""}`}>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="schedule-stats">
              <h3>This Week's Overview</h3>
              <div className="s-stat-row">
                <div className="s-stat-icon bg-blue-light text-blue"><Clock size={18}/></div>
                <div className="s-stat-info">
                  <p>Total Teaching Hours</p>
                  <h4>14h 30m</h4>
                </div>
              </div>
              <div className="s-stat-row mt-3">
                <div className="s-stat-icon bg-green-light text-green"><BookOpen size={18}/></div>
                <div className="s-stat-info">
                  <p>Scheduled Classes</p>
                  <h4>8 Sessions</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Add Event Modal ─── */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div>
                <h2>Add New Event</h2>
                <p>Schedule a new class, meeting, or session</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20}/>
              </button>
            </div>

            {saved ? (
              <div className="modal-success">
                <CheckCircle size={48} color="#10b981" />
                <h3>Event Saved!</h3>
                <p>Your new event has been added to the schedule.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEvent} className="modal-form">

                <div className="modal-input-group">
                  <label>Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Algebra Live Session"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label>Event Type</label>
                  <div className="type-selector">
                    {Object.keys(typeColorMap).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`type-btn ${newEvent.type === type ? "active-type" : ""}`}
                        onClick={() => handleTypeChange(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-row">
                  <div className="modal-input-group">
                    <label>Date</label>
                    <input
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="modal-input-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      required
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    />
                  </div>
                  <div className="modal-input-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      required
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-input-group">
                  <label>Meeting Link or Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Zoom link or Classroom 4A"
                    value={newEvent.link}
                    onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="modal-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="modal-btn-save">Save Event</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSchedule;



