import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/StudentDashboard/Sidebar';
import Topbar from '../../components/StudentDashboard/Topbar';
import { getMyEnrollments } from '../../api/courses';
import { getCourseLiveSessions } from '../../api/live';
import '../../styles/student_pages.css';
import '../../styles/teacher_pages/teacher_shared.css';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }
function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const adaptSession = (s, courseTitle, idx) => {
  const dt = new Date(s.scheduled_at);
  const start = dt.toTimeString().slice(0, 5);
  return {
    id: s.id,
    date: formatDate(dt),
    title: s.title,
    subject: courseTitle,
    teacher: s.teacher_name || '',
    location: 'online',
    start,
    end: start,
    duration: 60,
    type: 'live',
    color: COLORS[idx % COLORS.length],
  };
};

const SessionCard = ({ session }) => (
  <div className="sch-session-card">
    <div className="sch-session-time-col">
      <div className="sch-clock-icon" style={{ borderColor: session.color }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={session.color} strokeWidth="2.5" width="18" height="18">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <div className="sch-time">{session.start}</div>
      <div className="sch-duration">{session.duration} min</div>
    </div>
    <div className="sch-session-info">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="sch-session-title">{session.title}</div>
        <span className="sch-badge badge-live">{session.type}</span>
      </div>
      <div className="sch-session-subject">{session.subject}</div>
      <div className="sch-session-meta">
        <span>{session.teacher}</span>
        <span>{session.location}</span>
        <span>{session.start}</span>
      </div>
    </div>
  </div>
);

const Schedule = () => {
  const today = new Date();
  const [view, setView]               = useState('all');
  const [calYear, setCalYear]         = useState(today.getFullYear());
  const [calMonth, setCalMonth]       = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [sessions, setSessions]       = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const enrollRes = await getMyEnrollments();
        const enrollments = enrollRes.data.results || enrollRes.data || [];
        const allSessions = [];
        await Promise.all(
          enrollments.map(async (enrollment, idx) => {
            const courseId = enrollment.course?.id || enrollment.course_id || enrollment.id;
            const courseTitle = enrollment.course?.title || enrollment.course_title || '';
            try {
              const liveRes = await getCourseLiveSessions(courseId);
              const liveSessions = liveRes.data.results || liveRes.data || [];
              liveSessions.forEach(s => allSessions.push(adaptSession(s, courseTitle, idx)));
            } catch (_) {}
          })
        );
        if (mounted) setSessions(allSessions);
      } catch (_) {
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const totalDays = daysInMonth(calYear, calMonth);
  const firstDay  = firstDayOfMonth(calYear, calMonth);

  const filteredSessions = sessions.filter(s => {
    if (view === 'today') return s.date === formatDate(today);
    return true;
  });

  const grouped = filteredSessions.reduce((acc, s) => {
    acc[s.date] = acc[s.date] || [];
    acc[s.date].push(s);
    return acc;
  }, {});

  const sessionsOnSelected = sessions.filter(s => s.date === selectedDate);
  const liveCount = sessions.filter(s => s.type === 'live').length;

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content dashboard-bg">
        <Topbar />
        <div className="content">
          <div className="sch-page-header">
            <div>
              <h2 className="sch-page-title">My Schedule</h2>
              <p className="sch-page-sub">View your upcoming sessions</p>
            </div>
            <div className="sch-filter-tabs">
              {['all','today'].map(v => (
                <button
                  key={v}
                  className={`sch-tab ${view === v ? 'active' : ''}`}
                  onClick={() => setView(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="sch-body-grid">
            <div className="sch-calendar-card">
              <div className="sch-cal-label">Calendar</div>
              <div className="sch-cal-sub">Select a date to view sessions</div>
              <div className="sch-cal-nav">
                <button className="sch-cal-arrow" onClick={prevMonth}>‹</button>
                <span className="sch-cal-month">{MONTHS[calMonth]} {calYear}</span>
                <button className="sch-cal-arrow" onClick={nextMonth}>›</button>
              </div>
              <div className="sch-cal-grid">
                {DAYS.map(d => <div key={d} className="sch-cal-dayname">{d}</div>)}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                  const isSelected = dateStr === selectedDate;
                  const isToday    = dateStr === formatDate(today);
                  const hasSessions = sessions.some(s => s.date === dateStr);
                  return (
                    <div
                      key={day}
                      className={`sch-cal-day ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''} ${hasSessions ? 'has-session' : ''}`}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="sch-selected-info">
                <div className="sch-selected-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  {formatDateLabel(selectedDate)}
                </div>
                <div className="sch-selected-count">
                  {sessionsOnSelected.length === 0 ? '0 sessions scheduled' : `${sessionsOnSelected.length} session(s)`}
                </div>
              </div>
              <div className="sch-summary-pill" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <span>Total sessions</span>
                <span className="sch-pill-val">{sessions.length}</span>
              </div>
              <div className="sch-summary-pill" style={{ background: '#f0fdf4', color: '#10b981' }}>
                <span>Live sessions</span>
                <span className="sch-pill-val">{liveCount}</span>
              </div>
            </div>

            <div className="sch-sessions-panel">
              <div className="sch-sessions-title">Upcoming sessions</div>
              {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>Loading...</div>
              ) : Object.keys(grouped).length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>No sessions found.</div>
              ) : (
                Object.keys(grouped).sort().map(date => (
                  <div key={date}>
                    <div className="sch-date-divider"><span>{formatDateLabel(date)}</span></div>
                    {grouped[date].map(s => <SessionCard key={s.id} session={s} />)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
