import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Calendar } from 'lucide-react';
import { getStudentDashboard } from '../../api/courses';
import { getCourseLiveSessions } from '../../api/live';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const BottomGrid = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getStudentDashboard()
      .then(res => {
        const list = res.data.recent_enrollments || res.data.in_progress || [];
        setEnrollments(list);

        // Fetch live sessions for enrolled courses
        const slugs = list.map(e => e.course?.slug).filter(Boolean);
        if (slugs.length === 0) return;
        Promise.all(
          slugs.map(slug =>
            getCourseLiveSessions(slug)
              .then(r => (r.data.results || r.data || []).map(s => ({ ...s, courseSlug: slug })))
              .catch(() => [])
          )
        ).then(results => {
          const now = new Date();
          const today = results.flat().filter(s => {
            const d = new Date(s.scheduled_at);
            return d.toDateString() === now.toDateString() || s.status === 'live';
          });
          setSessions(today.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)));
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bottom-grid">
      {/* RECENT ENROLLMENTS */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Courses</h3>
        </div>
        <div className="card-body">
          {enrollments.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14, padding: '8px 0' }}>No enrolled courses yet.</p>
          ) : enrollments.map((enr, i) => {
            const c = enr.course || {};
            const color = COLORS[i % COLORS.length];
            const pct = Math.round(enr.progress_percent || 0);
            return (
              <div className="lesson-item" key={enr.id}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '10px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${color}33, ${color}22)`,
                  border: `1.5px solid ${color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 20 }}>📚</span>
                </div>
                <div className="lesson-info">
                  <div className="title">{c.title || 'Course'}</div>
                  <div className="sub">{c.teacher_name || 'Instructor'} · {pct}% done</div>
                </div>
                {pct === 100 ? (
                  <button className="lesson-btn btn-done" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Completed <CheckCircle size={14} />
                  </button>
                ) : (
                  <button className="lesson-btn btn-continue" onClick={() => navigate('/student/classrooms')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Continue <ArrowRight size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TODAY'S SCHEDULE */}
      <div className="card">
        <div className="card-header">
          <h3>Today's Schedule</h3>
        </div>
        <div className="card-body">
          {sessions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', color: '#94a3b8', gap: 8 }}>
              <Calendar size={28} opacity={0.4} />
              <p style={{ margin: 0, fontSize: 14 }}>No sessions scheduled for today.</p>
            </div>
          ) : sessions.map((session, i) => {
            const color = COLORS[i % COLORS.length];
            const isLive = session.status === 'live';
            const timeStr = new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            return (
              <div className="schedule-item" key={session.id}>
                <div className="sch-dot" style={{ background: color, marginTop: '5px' }} />
                <div className="sch-info">
                  <div className="title">{isLive ? '🔴 LIVE NOW — ' : 'Upcoming: '}{session.title}</div>
                  <div className="meta">{session.teacher_name || ''}</div>
                  <div className="time">{timeStr}</div>
                </div>
                <button
                  className="join-btn"
                  onClick={() => navigate('/student/classrooms')}
                  style={isLive ? { background: '#ef4444', color: 'white', border: 'none' } : {}}
                >
                  {isLive ? 'Join Live' : 'Join'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomGrid;
