import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/StudentDashboard/Sidebar';
import Topbar from '../../components/StudentDashboard/Topbar';
import { getMyEnrollments, getCourses, getCourseStudents } from '../../api/courses';
import { getCourseLessons } from '../../api/lessons';
import { getCourseLiveSessions, joinLiveSession, leaveLiveSession } from '../../api/live';
import { getCourseQuizzes, getQuiz, submitQuizAttempt, getMyAttempt } from '../../api/quizzes';
import { Room, RoomEvent, ParticipantEvent, Track } from 'livekit-client';
import { getCourseAssignments, getMySubmissions } from '../../api/assignments';
import { getForumThreads, getReplies, createReply, createThread } from '../../api/forum';
import '../../styles/teacher_pages/dashboard.css';

/* ─── Adapters ──────────────────────────────────────────────────── */

const COURSE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
const COURSE_EMOJIS = ['📐', '⚛️', '💻', '🧪', '🔬', '🌐'];

const adaptEnrollment = (e, idx) => ({
  id: e.course?.id || e.id,
  slug: e.course?.slug || '',
  subject: e.course?.title || e.course_title || 'Course',
  teacher: e.course?.teacher_name || 'Instructor',
  color: COURSE_COLORS[idx % COURSE_COLORS.length],
  emoji: COURSE_EMOJIS[idx % COURSE_EMOJIS.length],
  image: e.course?.thumbnail || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
  students: e.course?.enrollment_count || 0,
  progress: Math.round(e.progress_percent || 0),
  nextClass: '',
  status: 'active',
});

const adaptCourse = (c, idx) => ({
  id: c.id,
  slug: c.slug || '',
  subject: c.title,
  teacher: c.teacher_name || 'Instructor',
  color: COURSE_COLORS[idx % COURSE_COLORS.length],
  emoji: COURSE_EMOJIS[idx % COURSE_EMOJIS.length],
  image: c.thumbnail || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
  students: c.enrollment_count || 0,
  rating: '—',
});

/* ─── CLASSROOM SIDEBAR ──────────────────────────────────────── */

const ClassroomSidebar = ({ course, activePage, setActivePage, onBack }) => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-text">
          <div className="name" style={{ fontSize: '18px', color: course.color }}>{course.subject}</div>
          <div className="sub">Classroom</div>
        </div>
      </div>

      <div className="nav-section">
        <a href="#" className={`nav-item ${activePage === 'lessons' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('lessons'); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          Lessons
        </a>
        <a href="#" className={`nav-item ${activePage === 'live' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('live'); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          Live Video
        </a>
        <a href="#" className={`nav-item ${activePage === 'quiz' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('quiz'); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Quizzes
        </a>
        <a href="#" className={`nav-item ${activePage === 'grades' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('grades'); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          Grades
        </a>
        <a href="#" className={`nav-item ${activePage === 'messages' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('messages'); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Messages
        </a>
      </div>

      <div className="sidebar-bottom">
        <a 
          href="#"
          className="nav-item" 
          onClick={(e) => { e.preventDefault(); onBack(); }} 
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', justifyContent: 'center', marginTop: 'auto', display: 'flex' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Classrooms
        </a>
      </div>
    </aside>
  );
};

/* ─── SUB‑PAGE COMPONENTS ──────────────────────────────────────── */

const LessonsPage = ({ course }) => {
  const [courseLessons, setCourseLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('exercises');
  const [search, setSearch] = useState('');
  const [expandedLessonId, setExpandedLessonId] = useState(null);

  useEffect(() => {
    getCourseLessons(course.slug)
      .then(res => setCourseLessons((res.data.results || res.data || []).map(l => ({
        id: l.id,
        title: l.title,
        subject: course.subject,
        teacher: course.teacher,
        duration: l.duration_minutes ? `${l.duration_minutes} min` : '—',
        status: 'not-started',
        date: l.created_at?.slice(0, 10) || '',
        thumbnail: course.emoji,
        progress: 0,
      }))))
      .catch(() => {});
  }, [course.slug]);

  const filteredLessons = courseLessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

  const toggleExpand = (id) => {
    if (expandedLessonId === id) setExpandedLessonId(null);
    else {
      setExpandedLessonId(id);
      setActiveTab('exercises');
    }
  };

  return (
    <div className="cr-subpage cr-lessons-view">
      <style>{`
        .cr-lessons-view { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.3s ease; }
        .cr-lv-header {
          display: flex; justify-content: space-between; align-items: center;
          background: var(--bg-card, #ffffff); border-radius: 12px; padding: 20px 24px;
          border: 1px solid var(--border-color, #e2e8f0);
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .cr-lv-promo h2 { font-size: 20px; color: var(--text-main, #0f172a); margin: 0 0 4px 0; }
        .cr-lv-promo p { font-size: 14px; color: var(--text-light, #64748b); margin: 0; }
        
        .cr-lv-search {
          display: flex; align-items: center; background: var(--bg-main, #f1f5f9);
          padding: 8px 16px; border-radius: 24px;
        }
        .cr-lv-search input {
          border: none; background: transparent; outline: none; margin-left: 8px;
          font-size: 14px; color: var(--text-main, #0f172a); width: 200px;
        }
        
        .cr-featured-lesson {
          background: var(--bg-card, #ffffff); border-radius: 12px; padding: 32px;
          border: 1px solid var(--border-color, #e2e8f0);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .cr-fl-top { display: flex; align-items: flex-start; gap: 24px; }
        .cr-fl-icon {
          width: 80px; height: 80px; border-radius: 16px; background: #e0e7ff; color: #4f46e5;
          display: flex; align-items: center; justify-content: center; font-size: 32px; flex-shrink: 0;
        }
        .cr-fl-info { flex: 1; }
        .cr-fl-info h3 { font-size: 22px; font-weight: 700; color: var(--text-main, #0f172a); margin: 0 0 8px 0; }
        .cr-fl-meta { display: flex; gap: 16px; color: var(--text-light, #64748b); font-size: 14px; margin-bottom: 16px; }
        
        .cr-fl-actions { display: flex; align-items: center; gap: 16px; }
        .cr-fl-btn {
          padding: 10px 24px; border-radius: 24px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
        }
        .cr-fl-btn.primary { background: #3b82f6; color: white; }
        .cr-fl-btn.primary:hover { background: #2563eb; transform: translateY(-1px); }
        .cr-fl-progress-pill {
          background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700;
        }
        
        .cr-fl-tabs {
          display: flex; gap: 32px; border-bottom: 2px solid var(--border-color, #e2e8f0); margin-top: 32px;
        }
        .cr-fl-tab {
          background: none; border: none; padding: 12px 0; font-size: 15px; font-weight: 600; color: var(--text-light, #94a3b8);
          cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: color 0.2s;
        }
        .cr-fl-tab.active { color: var(--text-main, #0f172a); border-bottom: 2px solid #3b82f6; }
        .cr-fl-tab:hover:not(.active) { color: var(--text-main, #0f172a); }
        
        .cr-fl-content { padding-top: 24px; display: flex; flex-direction: column; gap: 16px; }
        .cr-ex-row {
          display: flex; align-items: center; gap: 16px; padding: 16px 20px;
          background: var(--bg-main, #f8fafc); border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0);
        }
        .cr-ex-icon {
          width: 40px; height: 40px; border-radius: 8px; background: white; border: 1px solid var(--border-color, #e2e8f0);
          display: flex; align-items: center; justify-content: center; font-size: 18px; color: #64748b;
        }
        .cr-ex-info h4 { font-size: 15px; font-weight: 600; color: var(--text-main, #0f172a); margin: 0 0 4px 0; }
        .cr-ex-info p { font-size: 13px; color: var(--text-light, #64748b); margin: 0; }
        .cr-ex-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
        .cr-ex-pill { background: #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        
        .cr-other-list { display: flex; flex-direction: column; gap: 12px; }
        .cr-other-row {
          display: flex; align-items: center; justify-content: space-between; padding: 16px 24px;
          background: var(--bg-card, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0);
          transition: all 0.2s; cursor: pointer;
        }
        .cr-other-row:hover { background: var(--bg-main, #f8fafc); border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .cr-or-left { display: flex; align-items: center; gap: 16px; }
        .cr-or-play {
          width: 40px; height: 40px; border-radius: 50%; background: #eff6ff; color: #3b82f6; display: flex; align-items: center; justify-content: center;
        }
        .cr-or-info h4 { font-size: 15px; font-weight: 600; color: var(--text-main, #0f172a); margin: 0 0 4px 0; }
        .cr-or-info p { font-size: 13px; color: var(--text-light, #64748b); margin: 0; }
        .cr-or-right { display: flex; align-items: center; gap: 24px; }
        
        @media (max-width: 900px) {
          .cr-lv-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .cr-fl-top { flex-direction: column; }
          .cr-other-row { flex-direction: column; align-items: flex-start; gap: 16px; }
          .cr-or-right { width: 100%; justify-content: space-between; }
        }
        
        html.dark-mode .cr-lv-search { background: rgba(0,0,0,0.2); }
        html.dark-mode .cr-ex-row { background: rgba(0,0,0,0.2); }
        html.dark-mode .cr-ex-icon { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
        html.dark-mode .cr-or-play { background: rgba(59,130,246,0.1); }
      `}</style>
      
      <div className="cr-lv-header">
        <div className="cr-lv-promo">
          <h2>Lessons Library</h2>
          <p>Watch recorded lectures anytime and learn at your own pace.</p>
        </div>
        <div className="cr-lv-search">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filteredLessons.length > 0 ? (
        <div className="cr-other-list">
          {filteredLessons.map(lesson => {
            const isExpanded = expandedLessonId === lesson.id;
            return (
              <div key={lesson.id} className="cr-lesson-wrapper" style={{ background: 'var(--bg-card, #ffffff)', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)', overflow: 'hidden', transition: 'all 0.2s', boxShadow: isExpanded ? '0 4px 12px rgba(0,0,0,0.04)' : 'none' }}>
                <div className="cr-other-row" onClick={() => toggleExpand(lesson.id)} style={{ border: 'none', background: isExpanded ? 'var(--bg-main, #f8fafc)' : 'transparent', borderRadius: 0, padding: isExpanded ? '20px 24px' : '16px 24px' }}>
                  <div className="cr-or-left">
                    <div className="cr-or-play" onClick={(e) => { e.stopPropagation(); }}>▶</div>
                    <div className="cr-or-info">
                      <h4 style={{ fontSize: isExpanded ? '16px' : '15px' }}>{lesson.title}</h4>
                      <p>⏱ {lesson.duration} &nbsp;·&nbsp; 📅 {lesson.date}</p>
                    </div>
                  </div>
                  <div className="cr-or-right">
                    {lesson.progress > 0 ? (
                       <span className="cr-ex-pill" style={{ background: lesson.progress === 100 ? 'rgba(22,101,52,0.1)' : 'rgba(55,48,163,0.1)', color: lesson.progress === 100 ? '#166534' : '#3730a3' }}>
                         {lesson.progress === 100 ? 'Completed' : `${lesson.progress}%`}
                       </span>
                    ) : (
                       <span className="cr-ex-pill" style={{ background: 'rgba(100,116,139,0.1)' }}>Not Started</span>
                    )}
                    <button className="cr-fl-btn" style={{ background: 'var(--bg-card, white)', border: '1px solid #cbd5e1', color: 'var(--text-main, #0f172a)' }} onClick={(e) => { e.stopPropagation(); }}>
                       {lesson.progress === 100 ? 'Review' : 'Watch'}
                    </button>
                    <div style={{ color: '#cbd5e1', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'all 0.3s ease', cursor: 'pointer', padding: '4px' }}>▼</div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="cr-fl-expanded" style={{ padding: '0 24px 24px 24px', borderTop: '1px solid var(--border-color, #e2e8f0)', animation: 'fadeIn 0.2s ease' }}>
                    <div className="cr-fl-tabs" style={{ marginTop: '16px', marginBottom: '20px' }}>
                      <button className={`cr-fl-tab ${activeTab === 'exercises' ? 'active' : ''}`} onClick={() => setActiveTab('exercises')}>Exercises</button>
                      <button className={`cr-fl-tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary & Notes</button>
                    </div>
                    
                    <div className="cr-fl-content" style={{ paddingTop: 0 }}>
                      {activeTab === 'exercises' ? (
                        <>
                          <div className="cr-ex-row">
                            <div className="cr-ex-icon">📄</div>
                            <div className="cr-ex-info">
                              <h4>{course.subject} Practice Quiz</h4>
                              <p>Test · 10 Questions</p>
                            </div>
                            <div className="cr-ex-right">
                              <span className="cr-ex-pill">12 mins</span>
                              <button className="cr-fl-btn" style={{ background: 'var(--bg-card, white)', border: '1px solid #cbd5e1', color: 'var(--text-main, #0f172a)' }}>Start</button>
                            </div>
                          </div>
                          <div className="cr-ex-row">
                            <div className="cr-ex-icon">📁</div>
                            <div className="cr-ex-info">
                              <h4>Homework Assignment 1</h4>
                              <p>PDF · 1.2 MB</p>
                            </div>
                            <div className="cr-ex-right">
                              <button className="cr-fl-btn" style={{ background: 'transparent', color: '#3b82f6', padding: '10px' }}>⬇ Download</button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="cr-ex-row">
                          <div className="cr-ex-icon" style={{ background: '#fef2f2', color: '#ef4444', borderColor: '#fee2e2' }}>📄</div>
                          <div className="cr-ex-info">
                            <h4>{lesson.title} - Detailed Summary</h4>
                            <p>PDF Document · 1.5 MB</p>
                          </div>
                          <div className="cr-ex-right">
                            <button className="cr-fl-btn" style={{ background: 'var(--bg-card, white)', border: '1px solid #cbd5e1', color: 'var(--text-main, #0f172a)' }}>View File</button>
                            <button className="cr-fl-btn" style={{ background: 'transparent', color: '#3b82f6', padding: '10px' }}>⬇ Download</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: 'var(--text-light, #64748b)', padding: '20px 0' }}>No lessons found matching your search.</p>
      )}
    </div>
  );
};

/* ── Remote video tile (student side) ───────────────────── */
const RemoteVideoTile = ({ participant }) => {
  const videoRef = React.useRef(null);
  const [track, setTrack] = React.useState(null);

  React.useEffect(() => {
    const update = () => {
      const pub = participant.getTrackPublication(Track.Source.Camera);
      setTrack(pub?.isSubscribed ? pub.track : null);
    };
    update();
    participant.on(ParticipantEvent.TrackSubscribed, update);
    participant.on(ParticipantEvent.TrackUnsubscribed, update);
    return () => {
      participant.off(ParticipantEvent.TrackSubscribed, update);
      participant.off(ParticipantEvent.TrackUnsubscribed, update);
    };
  }, [participant]);

  React.useEffect(() => {
    if (!videoRef.current || !track) return;
    track.attach(videoRef.current);
    return () => { try { track.detach(videoRef.current); } catch (_) {} };
  }, [track]);

  return (
    <div style={{ position: 'relative', background: '#0f172a', borderRadius: 8, overflow: 'hidden', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {track
        ? <video ref={videoRef} autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ color: '#fff', opacity: 0.5, fontSize: 14 }}>📡 {participant.identity}</div>
      }
      <span style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 12, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 4 }}>{participant.identity}</span>
    </div>
  );
};

const LiveVideoPage = ({ course }) => {
  const [courseSessions, setCourseSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [tab, setTab] = useState('upcoming');

  // LiveKit
  const [lkRoom, setLkRoom] = useState(null);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const wsRef = React.useRef(null);
  const chatEndRef = React.useRef(null);

  const currentUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);

  useEffect(() => {
    getCourseLiveSessions(course.slug)
      .then(res => setCourseSessions((res.data.results || res.data || []).map(s => ({
        id: s.id,
        title: s.title,
        teacher: s.teacher_name || course.teacher,
        color: course.color,
        time: new Date(s.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(s.scheduled_at).toLocaleDateString(),
        isLive: s.status === 'live',
      }))))
      .catch(() => {});
  }, [course.slug]);

  const handleJoin = async (session) => {
    setJoining(true);
    setJoinError('');
    try {
      const { data } = await joinLiveSession(session.id);
      const { server_url, token } = data;

      const room = new Room({ adaptiveStream: true, dynacast: true });
      room.on(RoomEvent.ParticipantConnected,    () => setRemoteParticipants([...room.remoteParticipants.values()]));
      room.on(RoomEvent.ParticipantDisconnected, () => setRemoteParticipants([...room.remoteParticipants.values()]));
      room.on(RoomEvent.TrackSubscribed,         () => setRemoteParticipants([...room.remoteParticipants.values()]));
      room.on(RoomEvent.TrackUnsubscribed,       () => setRemoteParticipants([...room.remoteParticipants.values()]));
      room.on(RoomEvent.Disconnected, () => {
        setLkRoom(null); setActiveSession(null); setRemoteParticipants([]);
      });

      await room.connect(server_url, token);
      await room.localParticipant.enableCameraAndMicrophone();
      setLkRoom(room);
      setRemoteParticipants([...room.remoteParticipants.values()]);
      setActiveSession(session);
      setChatMessages([]);

      // Open WebSocket chat
      const accessToken = localStorage.getItem('access_token');
      const wsBase = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws';
      const ws = new WebSocket(`${wsBase}/chat/${course.id}/?token=${accessToken}`);
      ws.onmessage = (e) => {
        const d = JSON.parse(e.data);
        setChatMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          username: d.username,
          message: d.message,
          isMe: d.user_id === String(currentUser.id),
        }]);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      };
      wsRef.current = ws;
    } catch (err) {
      setJoinError(err.response?.data?.detail || err.message || 'Failed to join. Is the session live?');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (lkRoom) lkRoom.disconnect();
    if (activeSession) { try { await leaveLiveSession(activeSession.id); } catch (_) {} }
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    setLkRoom(null); setActiveSession(null); setRemoteParticipants([]); setChatMessages([]);
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ message: chatInput.trim() }));
    setChatInput('');
  };

  // ── Active call view ──────────────────────────────────────
  if (activeSession && lkRoom) {
    const teacherParticipant = remoteParticipants[0] || null;
    return (
      <div className="cr-subpage" style={{ padding: 0, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#0f172a', borderRadius: 12 }}>
          {/* Video area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ color: '#fff', fontWeight: 700 }}>{activeSession.title}</span>
              <span style={{ color: '#64748b', fontSize: 13 }}>({remoteParticipants.length + 1} participants)</span>
            </div>

            <div style={{ flex: 1, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {teacherParticipant
                ? <RemoteVideoTile participant={teacherParticipant} />
                : (
                  <div style={{ color: '#64748b', textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📡</div>
                    <p>Waiting for teacher to enable video…</p>
                  </div>
                )
              }
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '14px 20px', borderTop: '1px solid #1e293b' }}>
              <button onClick={async () => { await lkRoom.localParticipant.setMicrophoneEnabled(!micOn); setMicOn(v => !v); }}
                style={{ background: micOn ? '#1e293b' : '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>
                {micOn ? '🎤 Mute' : '🔇 Unmute'}
              </button>
              <button onClick={async () => { await lkRoom.localParticipant.setCameraEnabled(!camOn); setCamOn(v => !v); }}
                style={{ background: camOn ? '#1e293b' : '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>
                {camOn ? '📷 Camera' : '🚫 Camera'}
              </button>
              <button onClick={handleLeave}
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700 }}>
                ✕ Leave
              </button>
            </div>
          </div>

          {/* Chat panel */}
          <div style={{ width: 300, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e293b' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', color: '#fff', fontWeight: 700 }}>💬 Live Chat</div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chatMessages.length === 0
                ? <p style={{ color: '#475569', fontSize: 13, textAlign: 'center', marginTop: 20 }}>No messages yet</p>
                : chatMessages.map(m => (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.isMe ? 'flex-end' : 'flex-start' }}>
                    {!m.isMe && <span style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{m.username}</span>}
                    <div style={{ background: m.isMe ? '#3b82f6' : '#1e293b', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: 13, maxWidth: '90%', wordBreak: 'break-word' }}>{m.message}</div>
                  </div>
                ))
              }
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', display: 'flex', gap: 8 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                placeholder="Type a message…"
                style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, outline: 'none' }}
              />
              <button onClick={sendMessage} style={{ background: '#3b82f6', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>→</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Session list view ─────────────────────────────────────
  return (
    <div className="cr-subpage">
      <div className="cr-subpage-header">
        <div>
          <h2 className="cr-sub-title">Live Sessions - {course.subject}</h2>
          <p className="cr-sub-desc">Join live classes and interactive workshops</p>
        </div>
        <div className="cr-live-indicator">
          <span className="cr-live-pulse" />
          <span>{courseSessions.filter(s => s.isLive).length} Live Now</span>
        </div>
      </div>

      {joinError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 8, padding: '10px 16px', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
          {joinError}
        </div>
      )}

      <div className="cr-live-list">
        {courseSessions.map(session => (
          <div key={session.id} className="cr-live-card" style={{ borderLeft: `4px solid ${session.color}` }}>
            <div className="cr-live-card-left">
              <div className="cr-live-icon" style={{ background: session.color + '22', color: session.color }}>
                {session.isLive ? '📡' : '🎬'}
              </div>
              <div className="cr-live-info">
                <div className="cr-live-subject" style={{ color: session.color }}>{course.subject}</div>
                <h3 className="cr-live-title">{session.title}</h3>
                <div className="cr-live-meta">
                  <span>👤 {session.teacher}</span>
                  <span>📅 {session.date} at {session.time}</span>
                </div>
              </div>
            </div>
            <button
              className={`cr-join-btn ${session.isLive ? 'cr-join-live' : 'cr-join-upcoming'}`}
              disabled={joining || !session.isLive}
              onClick={() => session.isLive && handleJoin(session)}
            >
              {joining ? '⏳ Joining…' : session.isLive ? '🔴 Join Live' : '🔔 Remind Me'}
            </button>
          </div>
        ))}
        {courseSessions.length === 0 && (
          <p style={{ color: '#64748b', fontSize: '14px', paddingTop: '20px' }}>No upcoming sessions for this course.</p>
        )}
      </div>
    </div>
  );
};

const QuizPage = ({ course }) => {
  const [courseQuizzes, setCourseQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);   // full quiz with questions
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState({});            // { questionId: { selected_index, text_answer } }
  const [result, setResult] = useState(null);            // attempt result after submit
  const [submitting, setSubmitting] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    getCourseQuizzes(course.slug)
      .then(res => setCourseQuizzes(res.data.results || res.data || []))
      .catch(() => {});
  }, [course.slug]);

  const startQuiz = async (quiz) => {
    setLoadingQuiz(true);
    try {
      // Check for existing attempt
      let attempt = null;
      try { attempt = (await getMyAttempt(quiz.id)).data; } catch (_) {}
      if (attempt) {
        setResult(attempt);
        setActiveQuiz(quiz);
        return;
      }
      const full = (await getQuiz(quiz.id)).data;
      setActiveQuiz(full);
      setQuizStep(0);
      setAnswers({});
      setResult(null);
    } catch (_) {} finally {
      setLoadingQuiz(false);
    }
  };

  const answerQuestion = (qId, value, type) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: type === 'short' ? { text_answer: value } : { selected_index: value },
    }));
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    try {
      const payload = activeQuiz.questions.map(q => ({
        question_id: q.id,
        selected_index: answers[q.id]?.selected_index ?? null,
        text_answer: answers[q.id]?.text_answer || '',
      }));
      const res = await submitQuizAttempt(activeQuiz.id, payload);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Result screen
  if (activeQuiz && result) {
    const pct = result.score_pct ?? result.score ?? 0;
    return (
      <div className="cr-subpage">
        <div className="qz-result-card">
          <div className="qz-result-icon">{result.passed ? '🏆' : '📚'}</div>
          <h2 className="qz-result-title">Quiz Complete!</h2>
          <p className="qz-result-sub">{activeQuiz.title}</p>
          <div className="qz-result-score" style={{ color: result.passed ? '#10b981' : '#ef4444' }}>{pct}%</div>
          <p style={{ color: '#64748b', marginBottom: '28px' }}>
            {result.passed ? 'Great job! You passed.' : `You need ${activeQuiz.passing_score}% to pass. Keep studying!`}
          </p>
          <button className="cr-btn-continue qz-back-btn" onClick={() => { setActiveQuiz(null); setResult(null); }}>
            ← Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Active quiz screen
  if (activeQuiz && activeQuiz.questions) {
    const questions = activeQuiz.questions;
    const q = questions[quizStep];
    const isLast = quizStep === questions.length - 1;
    return (
      <div className="cr-subpage">
        <div className="qz-quiz-wrapper">
          <div className="qz-quiz-header">
            <button className="qz-back-link" onClick={() => { setActiveQuiz(null); setAnswers({}); }}>← Exit Quiz</button>
            <span>{activeQuiz.title}</span>
            <span className="qz-progress-text">{quizStep + 1} / {questions.length}</span>
          </div>
          <div className="qz-progress-bar">
            <div className="qz-progress-fill" style={{ width: `${((quizStep + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="qz-question-card">
            <p className="qz-question-num">Question {quizStep + 1} · {q.marks} pt{q.marks !== 1 ? 's' : ''}</p>
            <h3 className="qz-question-text">{q.text}</h3>

            {/* MCQ */}
            {q.type === 'mcq' && (
              <div className="qz-options">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`qz-option ${answers[q.id]?.selected_index === i ? 'qz-option-selected' : ''}`}
                    onClick={() => answerQuestion(q.id, i, 'mcq')}
                  >
                    <span className="qz-opt-letter">{String.fromCharCode(65 + i)}</span>
                    {opt.text || opt}
                  </button>
                ))}
              </div>
            )}

            {/* True / False */}
            {q.type === 'tf' && (
              <div className="qz-options">
                {['True', 'False'].map((label, i) => (
                  <button
                    key={i}
                    className={`qz-option ${answers[q.id]?.selected_index === i ? 'qz-option-selected' : ''}`}
                    onClick={() => answerQuestion(q.id, i, 'tf')}
                  >
                    <span className="qz-opt-letter">{label === 'True' ? '✓' : '✗'}</span>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Short Answer */}
            {q.type === 'short' && (
              <textarea
                className="cq-textarea"
                placeholder="Type your answer here…"
                rows={4}
                value={answers[q.id]?.text_answer || ''}
                onChange={e => answerQuestion(q.id, e.target.value, 'short')}
                style={{ width: '100%', marginTop: 12, padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }}
              />
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {quizStep > 0 && (
                <button className="cr-btn-continue" onClick={() => setQuizStep(s => s - 1)}>← Previous</button>
              )}
              {!isLast && (
                <button className="cr-btn-start" onClick={() => setQuizStep(s => s + 1)}>Next →</button>
              )}
              {isLast && (
                <button className="cr-btn-start" onClick={submitQuiz} disabled={submitting}>
                  {submitting ? 'Submitting…' : '✓ Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz list
  return (
    <div className="cr-subpage">
      <div className="cr-subpage-header">
        <div>
          <h2 className="cr-sub-title">Quizzes - {course.subject}</h2>
          <p className="cr-sub-desc">Test your knowledge and track your scores</p>
        </div>
      </div>

      <div className="qz-grid">
        {courseQuizzes.map(quiz => {
          const isPast = quiz.due_date && new Date(quiz.due_date) < new Date();
          return (
            <div key={quiz.id} className="qz-card" style={{ borderTop: `4px solid ${course.color}` }}>
              <div className="qz-card-top">
                <span className="qz-subject" style={{ color: course.color }}>{quiz.subject || course.subject}</span>
                <span className={`cr-badge ${isPast ? 'qz-badge-overdue' : 'qz-badge-pending'}`}>
                  {isPast ? 'Overdue' : 'Active'}
                </span>
              </div>
              <h3 className="qz-title">{quiz.title}</h3>
              <div className="qz-meta">
                <span>❓ {quiz.question_count} questions</span>
                {quiz.time_limit_minutes && <span>⏱ {quiz.time_limit_minutes} min</span>}
                {quiz.due_date && <span>📅 Due {quiz.due_date.slice(0, 10)}</span>}
              </div>
              <button
                className="cr-btn-start cr-lesson-btn"
                disabled={loadingQuiz}
                onClick={() => startQuiz(quiz)}
              >
                {loadingQuiz ? '⏳ Loading…' : '▶ Start Quiz'}
              </button>
            </div>
          );
        })}
        {courseQuizzes.length === 0 && <p style={{ color: '#64748b' }}>No quizzes for this course yet.</p>}
      </div>
    </div>
  );
};

const GradesPage = ({ course }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    getMySubmissions()
      .then(res => setSubmissions(res.data.results || res.data || []))
      .catch(() => {});
  }, [course.id]);

  const courseSubmissions = submissions.filter(s => s.course_id === course.id || s.assignment?.course === course.id);
  const scored = courseSubmissions.filter(s => s.score != null);
  const avgScore = scored.length > 0 ? Math.round(scored.reduce((sum, s) => sum + s.score, 0) / scored.length) : 0;
  const g = {
    subject: course.subject,
    teacher: course.teacher,
    color: course.color,
    emoji: course.emoji,
    grade: avgScore >= 90 ? 'A' : avgScore >= 80 ? 'B' : avgScore >= 70 ? 'C' : 'D',
    percentage: avgScore,
    assignments: courseSubmissions.map(s => ({
      name: s.assignment_title || 'Assignment',
      score: s.score || 0,
      max: s.max_score || 100,
    })),
  };
  if (courseSubmissions.length === 0) return <div className="cr-subpage"><p style={{ color: '#94a3b8', padding: '20px 0' }}>No grades available yet.</p></div>;

  const gradeColor = (pct) => pct >= 90 ? '#10b981' : pct >= 80 ? '#3b82f6' : pct >= 70 ? '#f59e0b' : '#ef4444';

  const totalCompleted = g.assignments.length;
  const passed = g.assignments.filter(a => (a.score/a.max) >= 0.5).length;
  const successRate = totalCompleted > 0 ? Math.round((passed / totalCompleted) * 100) : 0;

  return (
    <div className="cr-subpage cr-grades-view">
      <style>{`
        .cr-grades-view { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.3s ease; }
        .cr-grades-header {
          background: var(--bg-card, #ffffff);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          border: 1px solid var(--border-color, #e2e8f0);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .cr-grades-header h2 { font-size: 24px; margin: 0 0 8px 0; color: var(--text-main, #0f172a); }
        .cr-grades-header p { font-size: 14px; margin: 0; color: var(--text-light, #64748b); }
        
        .cr-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .cr-stat-card {
           background: var(--bg-card, #ffffff);
           border-radius: 12px; padding: 24px; text-align: center;
           box-shadow: 0 2px 8px rgba(0,0,0,0.04);
           border: 1px solid var(--border-color, #e2e8f0);
           transition: transform 0.2s;
        }
        .cr-stat-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
        .cr-stat-card h4 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-light, #64748b); margin: 0 0 16px 0; }
        .cr-stat-val { font-size: 38px; font-weight: 700; margin-bottom: 8px; color: var(--text-main, #0f172a); }
        .cr-stat-card p { font-size: 13px; color: var(--text-light, #64748b); margin: 0; }
        
        .cr-recent-tests {
           background: var(--bg-card, #ffffff);
           border-radius: 12px; padding: 32px;
           box-shadow: 0 2px 8px rgba(0,0,0,0.04);
           border: 1px solid var(--border-color, #e2e8f0);
        }
        .cr-rt-header { margin-bottom: 24px; text-align: left; }
        .cr-rt-header h3 { font-size: 18px; font-weight: 700; color: var(--text-main, #0f172a); margin: 0 0 6px 0; }
        .cr-rt-header p { font-size: 14px; color: var(--text-light, #64748b); margin: 0; }
        
        .cr-test-list { display: flex; flex-direction: column; gap: 16px; }
        .cr-test-card {
           display: flex; justify-content: space-between; align-items: center;
           padding: 24px; border-radius: 12px;
           border: 1px solid var(--border-color, #e2e8f0);
           background: var(--bg-main, #f8fafc);
           transition: all 0.2s;
        }
        .cr-test-card:hover { background: var(--bg-card, #ffffff); border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        
        .cr-tc-left h4 { font-size: 15px; font-weight: 600; color: var(--text-main, #0f172a); margin: 0 0 6px 0; }
        .cr-tc-left p { font-size: 13px; color: var(--text-light, #64748b); margin: 0; }
        
        .cr-tc-right { display: flex; gap: 36px; align-items: center; }
        .cr-tc-col { display: flex; flex-direction: column; text-align: right; }
        .cr-tc-lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-light, #94a3b8); margin-bottom: 4px; }
        .cr-tc-val { font-size: 15px; font-weight: 700; color: var(--text-main, #0f172a); }
        
        .cr-tc-btn {
           background: var(--bg-card, #ffffff); border: 1px solid #cbd5e1;
           padding: 8px 16px; border-radius: 20px;
           font-size: 12px; font-weight: 600; color: #475569;
           cursor: pointer; transition: all 0.2s; margin-left: 12px;
        }
        .cr-tc-btn:hover { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; transform: translateY(-1px); }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        
        html.dark-mode .cr-test-card { background: rgba(255,255,255,0.02); }
        html.dark-mode .cr-tc-btn { background: transparent; border-color: rgba(255,255,255,0.1); color: #cbd5e1; }
        html.dark-mode .cr-tc-btn:hover { background: rgba(255,255,255,0.05); color: white; border-color: rgba(255,255,255,0.2); }

        @media (max-width: 900px) {
          .cr-stats-row { grid-template-columns: 1fr; }
          .cr-test-card { flex-direction: column; align-items: flex-start; gap: 20px; }
          .cr-tc-right { width: 100%; justify-content: space-between; gap: 15px; }
          .cr-tc-col { text-align: left; }
        }
      `}</style>

      <div className="cr-grades-header">
        <h2>Test & Grades</h2>
        <p>Track your performance and test result for {course.subject}</p>
      </div>

      <div className="cr-stats-row">
        <div className="cr-stat-card">
          <h4>Average Score</h4>
          <div className="cr-stat-val" style={{ color: gradeColor(g.percentage) }}>{g.percentage}%</div>
          <p>overall course grade</p>
        </div>
        <div className="cr-stat-card">
          <h4>Test Completed</h4>
          <div className="cr-stat-val">{totalCompleted}</div>
          <p>assignments graded</p>
        </div>
        <div className="cr-stat-card">
          <h4>Success Rate</h4>
          <div className="cr-stat-val" style={{ color: successRate >= 80 ? '#10b981' : '#f59e0b' }}>{successRate}%</div>
          <p>most tests passed</p>
        </div>
      </div>

      <div className="cr-recent-tests">
        <div className="cr-rt-header">
          <h3>Recent Test results</h3>
          <p>Your latest assignment and test result</p>
        </div>
        <div className="cr-test-list">
          {g.assignments.map((a, i) => {
            const pct = Math.round((a.score / a.max) * 100);
            return (
              <div key={i} className="cr-test-card">
                <div className="cr-tc-left">
                  <h4>{a.name}</h4>
                  <p>Course: {course.subject}</p>
                </div>
                <div className="cr-tc-right">
                  <div className="cr-tc-col">
                    <span className="cr-tc-lbl">Score</span>
                    <span className="cr-tc-val">{a.score} of {a.max}</span>
                  </div>
                  <div className="cr-tc-col">
                    <span className="cr-tc-lbl">Percentage</span>
                    <span className="cr-tc-val" style={{ color: gradeColor(pct) }}>{pct}%</span>
                  </div>
                  <div className="cr-tc-col">
                    <span className="cr-tc-lbl">Date</span>
                    <span className="cr-tc-val">Recent</span>
                  </div>
                  <button className="cr-tc-btn">view details</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MessagesPage = ({ course }) => {
  const [tab, setTab] = useState('chats');
  const [threads, setThreads] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [showNewThread, setShowNewThread] = useState(false);

  const currentUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, []);

  // Fetch threads and students
  useEffect(() => {
    if (!course.id) return;
    setLoadingThreads(true);
    getForumThreads({ course: course.id })
      .then(res => {
        const list = res.data.results || res.data || [];
        setThreads(list);
        if (list.length > 0) setSelectedThread(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoadingThreads(false));

    if (course.slug) {
      getCourseStudents(course.slug)
        .then(res => setStudents(res.data.results || res.data || []))
        .catch(() => {});
    }
  }, [course.id, course.slug]);

  // Fetch replies when thread changes
  useEffect(() => {
    if (!selectedThread) { setReplies([]); return; }
    setLoadingReplies(true);
    getReplies(selectedThread.id)
      .then(res => setReplies(res.data.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoadingReplies(false));
  }, [selectedThread?.id]);

  const handleSend = async () => {
    if (!reply.trim() || !selectedThread || sending) return;
    setSending(true);
    try {
      const { data } = await createReply(selectedThread.id, reply.trim());
      setReplies(prev => [...prev, data]);
      setReply('');
    } catch (_) {}
    setSending(false);
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !course.id) return;
    try {
      const { data } = await createThread({ course: course.id, title: newThreadTitle.trim(), body: '' });
      setThreads(prev => [data, ...prev]);
      setSelectedThread(data);
      setNewThreadTitle('');
      setShowNewThread(false);
      setTab('chats');
    } catch (_) {}
  };

  const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#6366f1'];
  const colorFor = (str) => COLORS[(str || '').length % COLORS.length];
  const initials = (name) => (name || '?').split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  const authorName = (a) => a ? (`${a.first_name || ''} ${a.last_name || ''}`.trim() || a.email || 'Student') : 'Student';

  return (
    <div className="cr-subpage" style={{ padding: 0, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .msg-layout { display: flex; height: 100%; background: var(--bg-card, #ffffff); border-radius: 12px; border: 1px solid var(--border-color, #e2e8f0); overflow: hidden; }
        .msg-sidebar { width: 320px; border-right: 1px solid var(--border-color, #e2e8f0); display: flex; flex-direction: column; background: var(--bg-main, #f8fafc); }
        .msg-sb-header { padding: 20px 24px 0 24px; }
        .msg-tabs { display: flex; gap: 20px; border-bottom: 2px solid var(--border-color, #e2e8f0); margin-top: 16px; }
        .msg-tab { background: none; border: none; padding: 0 0 10px 0; font-size: 14px; font-weight: 600; color: var(--text-light, #94a3b8); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: 0.2s; }
        .msg-tab.active { color: var(--text-main, #0f172a); border-color: #3b82f6; }
        .msg-list { flex: 1; overflow-y: auto; }
        .msg-item { display: flex; align-items: center; gap: 14px; padding: 16px 24px; cursor: pointer; border-bottom: 1px solid var(--border-color, #e2e8f0); transition: 0.2s; }
        .msg-item:hover { background: rgba(0,0,0,0.02); }
        .msg-item.active { background: #ffffff; border-left: 3px solid #3b82f6; }
        .msg-avatar-wrap { position: relative; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; flex-shrink: 0; }
        .msg-info { flex: 1; min-width: 0; }
        .msg-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .msg-name { font-size: 14px; font-weight: 700; color: var(--text-main, #0f172a); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .msg-time { font-size: 11px; color: var(--text-light, #94a3b8); }
        .msg-preview { font-size: 13px; color: var(--text-light, #64748b); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .msg-role { font-size: 11px; color: #3b82f6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .msg-main { flex: 1; display: flex; flex-direction: column; background: var(--bg-card, #ffffff); }
        .msg-main-header { padding: 20px 24px; border-bottom: 1px solid var(--border-color, #e2e8f0); display: flex; align-items: center; gap: 16px; }
        .msg-main-name { font-size: 18px; font-weight: 700; color: var(--text-main, #0f172a); }
        .msg-main-role { font-size: 13px; color: var(--text-light, #64748b); }
        .msg-chat-area { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: var(--bg-main, #f8fafc); }
        .msg-bubble-wrap { display: flex; flex-direction: column; max-width: 70%; }
        .msg-bubble-wrap.them { align-self: flex-start; }
        .msg-bubble-wrap.me { align-self: flex-end; align-items: flex-end; }
        .msg-sender-lbl { font-size: 12px; color: var(--text-light, #94a3b8); margin-bottom: 4px; padding: 0 4px; }
        .msg-bubble { padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.5; }
        .msg-bubble.them { background: #ffffff; border: 1px solid var(--border-color, #e2e8f0); color: var(--text-main, #0f172a); border-bottom-left-radius: 4px; }
        .msg-bubble.me { background: #3b82f6; color: white; border-bottom-right-radius: 4px; box-shadow: 0 2px 8px rgba(59,130,246,0.3); }
        .msg-input-area { padding: 20px 24px; border-top: 1px solid var(--border-color, #e2e8f0); background: #ffffff; display: flex; gap: 12px; align-items: center; }
        .msg-input { flex: 1; background: var(--bg-main, #f1f5f9); border: 1px solid var(--border-color, #e2e8f0); border-radius: 24px; padding: 12px 20px; font-size: 14px; outline: none; color: var(--text-main, #0f172a); }
        .msg-input:focus { border-color: #3b82f6; background: #ffffff; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
        .msg-send-btn { background: #3b82f6; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.2s; flex-shrink: 0; }
        .msg-send-btn:hover { background: #2563eb; }
        .msg-new-thread { padding: 12px 24px; border-bottom: 1px solid var(--border-color, #e2e8f0); display: flex; gap: 8px; }
        .msg-new-thread input { flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; }
        html.dark-mode .msg-bubble.them { background: rgba(0,0,0,0.2); }
      `}</style>

      <div className="msg-layout">
        {/* Sidebar */}
        <div className="msg-sidebar">
          <div className="msg-sb-header">
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-main, #0f172a)' }}>Messages</h2>
            <div className="msg-tabs">
              <button className={`msg-tab ${tab === 'chats' ? 'active' : ''}`} onClick={() => setTab('chats')}>Threads</button>
              <button className={`msg-tab ${tab === 'directory' ? 'active' : ''}`} onClick={() => setTab('directory')}>Classmates</button>
            </div>
          </div>

          {tab === 'chats' && (
            <div className="msg-new-thread">
              {showNewThread ? (
                <>
                  <input
                    autoFocus
                    value={newThreadTitle}
                    onChange={e => setNewThreadTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreateThread(); if (e.key === 'Escape') setShowNewThread(false); }}
                    placeholder="Thread title…"
                  />
                  <button onClick={handleCreateThread} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '0 12px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Post</button>
                  <button onClick={() => setShowNewThread(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}>×</button>
                </>
              ) : (
                <button onClick={() => setShowNewThread(true)} style={{ width: '100%', background: 'none', border: '1px dashed #cbd5e1', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: '#64748b', fontSize: 13, textAlign: 'left' }}>
                  + New thread
                </button>
              )}
            </div>
          )}

          <div className="msg-list">
            {tab === 'chats' ? (
              loadingThreads ? (
                <p style={{ color: '#94a3b8', padding: '20px 24px', fontSize: 14 }}>Loading…</p>
              ) : threads.length === 0 ? (
                <p style={{ color: '#94a3b8', padding: '20px 24px', fontSize: 14 }}>No threads yet. Start one above.</p>
              ) : threads.map(t => (
                <div key={t.id} className={`msg-item ${selectedThread?.id === t.id ? 'active' : ''}`} onClick={() => setSelectedThread(t)}>
                  <div className="msg-avatar-wrap" style={{ background: colorFor(t.title) + '22', color: colorFor(t.title) }}>
                    {initials(authorName(t.author))}
                  </div>
                  <div className="msg-info">
                    <div className="msg-top-row">
                      <span className="msg-name">{t.title}</span>
                      <span className="msg-time">{t.created_at?.slice(0, 10)}</span>
                    </div>
                    <span className="msg-preview">{authorName(t.author)}</span>
                  </div>
                </div>
              ))
            ) : (
              students.length === 0 ? (
                <p style={{ color: '#94a3b8', padding: '20px 24px', fontSize: 14 }}>No classmates found.</p>
              ) : students.map((s, i) => {
                const name = s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.email;
                const color = COLORS[i % COLORS.length];
                return (
                  <div key={s.id} className="msg-item">
                    <div className="msg-avatar-wrap" style={{ background: color + '22', color }}>
                      {initials(name)}
                    </div>
                    <div className="msg-info">
                      <div className="msg-top-row">
                        <span className="msg-name">{name}</span>
                      </div>
                      <span className="msg-role">Student</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main panel */}
        {tab === 'chats' && selectedThread ? (
          <div className="msg-main">
            <div className="msg-main-header">
              <div className="msg-avatar-wrap" style={{ background: colorFor(selectedThread.title) + '22', color: colorFor(selectedThread.title) }}>
                {initials(authorName(selectedThread.author) || selectedThread.title)}
              </div>
              <div>
                <div className="msg-main-name">{selectedThread.title}</div>
                <div className="msg-main-role">by {authorName(selectedThread.author)}</div>
              </div>
            </div>
            <div className="msg-chat-area">
              {/* Thread body as first bubble */}
              {selectedThread.body && (
                <div className="msg-bubble-wrap them">
                  <span className="msg-sender-lbl">{authorName(selectedThread.author)}</span>
                  <div className="msg-bubble them">{selectedThread.body}</div>
                </div>
              )}
              {loadingReplies ? (
                <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>Loading replies…</p>
              ) : replies.length === 0 && !selectedThread.body ? (
                <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 40 }}>No replies yet. Be the first!</p>
              ) : (
                replies.map(r => {
                  const isMe = r.author?.id === currentUser.id || r.author?.email === currentUser.email;
                  return (
                    <div key={r.id} className={`msg-bubble-wrap ${isMe ? 'me' : 'them'}`}>
                      {!isMe && <span className="msg-sender-lbl">{authorName(r.author)}</span>}
                      <div className={`msg-bubble ${isMe ? 'me' : 'them'}`}>{r.body}</div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="msg-input-area">
              <input
                className="msg-input"
                placeholder="Write a reply…"
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              />
              <button className="msg-send-btn" onClick={handleSend} disabled={sending}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="msg-main" style={{ alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main, #f8fafc)' }}>
            <div style={{ fontSize: '48px', opacity: 0.5, marginBottom: '16px' }}>💬</div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main, #0f172a)' }}>
              {tab === 'chats' ? 'Select a thread' : 'Classmates'}
            </h3>
            <p style={{ color: 'var(--text-light, #64748b)', margin: 0 }}>
              {tab === 'chats' ? 'Pick a thread from the left or create a new one.' : 'These are the students enrolled in this course.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── COURSE PREVIEW PAGE ─────────────────────────────────────── */

const CoursePreviewPage = ({ course, onBack, onEnroll }) => {
  const desc = course.description || "In this comprehensive course, you will learn the core concepts and advanced topics required to master this subject. Perfect for students looking to excel in their studies, featuring step-by-step guidance and interactive materials.";
  
  return (
    <div className="cr-subpage cr-preview-view">
      <style>{`
        .cr-preview-inner { max-width: 1250px; margin: 0 auto; }
        .cr-pv-header {
           background: var(--bg-card, #ffffff);
           border-radius: 12px;
           overflow: hidden;
           border: 1px solid var(--border-color, #e2e8f0);
           margin-bottom: 24px;
        }
        .cr-pv-banner {
           height: 250px;
           background-size: cover;
           background-position: center;
           position: relative;
        }
        .cr-pv-info {
           padding: 30px;
           display: flex;
           justify-content: space-between;
           align-items: flex-start;
        }
        .cr-pv-title { font-size: 28px; font-weight: 700; color: var(--text-main, #0f172a); margin: 0 0 12px 0; }
        .cr-pv-meta { display: flex; gap: 16px; align-items: center; color: var(--text-light, #64748b); font-size: 14px; margin-bottom: 20px; }
        .cr-pv-badge { background: var(--bg-main, #f1f5f9); padding: 4px 10px; border-radius: 16px; font-size: 12px; font-weight: 600; color: var(--text-light, #475569); }
        .cr-pv-price { font-size: 24px; font-weight: 700; color: #10b981; margin-bottom: 16px; }
        .cr-pv-enroll-btn {
           background: ${course.color}; color: white; padding: 12px 32px; border-radius: 24px; 
           font-size: 16px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
        }
        
        .cr-pv-body { display: flex; flex-direction: column; gap: 24px; }
        .cr-pv-section { background: var(--bg-card, #ffffff); border-radius: 12px; padding: 24px; border: 1px solid var(--border-color, #e2e8f0); }
        .cr-pv-section h3 { font-size: 18px; font-weight: 700; margin: 0 0 16px 0; color: var(--text-main, #0f172a); }
        .cr-pv-desc { font-size: 15px; color: var(--text-light, #64748b); line-height: 1.6; }
        
        .cr-pv-teacher { display: flex; align-items: center; gap: 16px; margin-top: 20px; }
        .cr-pv-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
        .cr-pv-tinfo h4 { font-size: 16px; font-weight: 600; color: var(--text-main, #0f172a); margin: 0 0 4px 0; }
        .cr-pv-tinfo p { font-size: 13px; color: var(--text-light, #64748b); margin: 0; }
        
        .cr-rev-carousel {
           display: flex; gap: 20px; overflow-x: auto; padding-bottom: 12px;
           scroll-snap-type: x mandatory;
        }
        .cr-rev-carousel::-webkit-scrollbar { height: 8px; }
        .cr-rev-carousel::-webkit-scrollbar-track { background: var(--bg-main, #f1f5f9); border-radius: 4px; }
        .cr-rev-carousel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        
        .cr-rev-item {
           min-width: 320px; flex-shrink: 0; scroll-snap-align: start;
           background: var(--bg-main, #f8fafc); border-radius: 12px; padding: 20px;
           border: 1px solid var(--border-color, #e2e8f0);
        }
        .cr-rev-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .cr-rev-user { display: flex; align-items: center; gap: 12px; }
        .cr-rev-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .cr-rev-name { font-size: 15px; font-weight: 600; color: var(--text-main, #0f172a); }
        .cr-rev-stars { color: #f59e0b; font-size: 12px; }
        .cr-rev-text { font-size: 14px; color: var(--text-light, #64748b); line-height: 1.6; margin: 0; }

        @media (max-width: 900px) {
          .cr-pv-info { flex-direction: column; gap: 20px; }
          .cr-pv-info > div:last-child { text-align: left; width: 100%; display: flex; align-items: center; justify-content: space-between; }
        }
      `}</style>
      
      <div className="cr-preview-inner">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-light, #64748b)', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
           ← Back to Classrooms
        </button>

        <div className="cr-pv-header">
           <div className="cr-pv-banner" style={{ backgroundImage: `url(${course.image})` }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
         </div>
         <div className="cr-pv-info">
            <div>
               <h1 className="cr-pv-title">{course.subject}</h1>
               <div className="cr-pv-meta">
                  <span className="cr-pv-badge">🎓 {course.subject}</span>
                  <span>⭐ {course.rating || '4.8'} ({course.students || 122} enrolled)</span>
                  <span>🌍 English</span>
               </div>
               <div className="cr-pv-teacher">
                  <img className="cr-pv-avatar" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.teacher)}&background=random`} alt={course.teacher} />
                  <div className="cr-pv-tinfo">
                     <h4>{course.teacher}</h4>
                     <p>Senior Instructor</p>
                  </div>
               </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: 'var(--bg-main, #f8fafc)', borderRadius: '12px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-light, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Price</span>
                  <div style={{ height: '24px', width: '1px', background: 'var(--border-color, #e2e8f0)' }}></div>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981', letterSpacing: '0.02em' }}>FREE</span>
               </div>
               <button className="cr-pv-enroll-btn" onClick={onEnroll}>Enroll Now</button>
            </div>
         </div>
      </div>

      <div className="cr-pv-body">
         <div className="cr-pv-section">
            <h3>About This Course</h3>
            <p className="cr-pv-desc">{desc}</p>
            <br/>
            <h4>What you'll learn:</h4>
            <ul style={{ color: 'var(--text-light, #64748b)', paddingLeft: '20px', marginTop: '12px', lineHeight: '1.6' }}>
               <li>Understand the fundamental principles of {course.subject}</li>
               <li>Solve complex problems using industry-standard techniques</li>
               <li>Prepare effectively for advanced examinations</li>
            </ul>
         </div>
         <div className="cr-pv-section">
            <h3 style={{ marginBottom: '20px' }}>Student Reviews</h3>
            <div className="cr-rev-carousel">
               <div className="cr-rev-item">
                  <div className="cr-rev-top">
                     <div className="cr-rev-user">
                        <img className="cr-rev-avatar" src="https://ui-avatars.com/api/?name=Sarah+M&background=random" alt="Sarah M" />
                        <span className="cr-rev-name">Sarah M.</span>
                     </div>
                     <span className="cr-rev-stars">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="cr-rev-text">"Amazing course! The teacher explains everything so clearly. Highly recommend to everyone."</p>
               </div>
               <div className="cr-rev-item">
                  <div className="cr-rev-top">
                     <div className="cr-rev-user">
                        <img className="cr-rev-avatar" src="https://ui-avatars.com/api/?name=Omar+K&background=random" alt="Omar K" />
                        <span className="cr-rev-name">Omar K.</span>
                     </div>
                     <span className="cr-rev-stars">⭐⭐⭐⭐★</span>
                  </div>
                  <p className="cr-rev-text">"Really solid introduction, I feel much more confident in this class now."</p>
               </div>
               <div className="cr-rev-item">
                  <div className="cr-rev-top">
                     <div className="cr-rev-user">
                        <img className="cr-rev-avatar" src="https://ui-avatars.com/api/?name=Leila+B&background=random" alt="Leila B" />
                        <span className="cr-rev-name">Leila B.</span>
                     </div>
                     <span className="cr-rev-stars">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="cr-rev-text">"The best materials on the platform. Totally free and very well structured."</p>
               </div>
               <div className="cr-rev-item">
                  <div className="cr-rev-top">
                     <div className="cr-rev-user">
                        <img className="cr-rev-avatar" src="https://ui-avatars.com/api/?name=Youssef+A&background=random" alt="Youssef A" />
                        <span className="cr-rev-name">Youssef A.</span>
                     </div>
                     <span className="cr-rev-stars">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="cr-rev-text">"Great pacing, I was able to follow along perfectly. Looking forward to the next part."</p>
               </div>
               <div className="cr-rev-item">
                  <div className="cr-rev-top">
                     <div className="cr-rev-user">
                        <img className="cr-rev-avatar" src="https://ui-avatars.com/api/?name=Amal+T&background=random" alt="Amal T" />
                        <span className="cr-rev-name">Amal T.</span>
                     </div>
                     <span className="cr-rev-stars">⭐⭐⭐⭐★</span>
                  </div>
                  <p className="cr-rev-text">"Helpful practice quizzes built right in! Makes studying extremely engaging."</p>
               </div>
            </div>
         </div>
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN CLASSROOMS PAGE ─────────────────────────────────────── */

const Classrooms = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [activePage, setActivePage] = useState('lessons');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    getMyEnrollments()
      .then(res => setEnrolledCourses((res.data.results || res.data || []).map(adaptEnrollment)))
      .catch(() => {});
    getCourses()
      .then(res => setAllCourses((res.data.results || res.data || []).map(adaptCourse)))
      .catch(() => {});
  }, []);

  const categories = ['All'];
  const filteredCourses = categoryFilter === 'All' ? enrolledCourses : enrolledCourses;
  const filteredAllCourses = categoryFilter === 'All' ? allCourses : allCourses;

  if (selectedCourse) {
    return (
      <div className="dashboard-layout">
        <ClassroomSidebar 
          course={selectedCourse} 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onBack={() => { setSelectedCourse(null); setActivePage('lessons'); }}
        />
        <main className="main-content dashboard-bg">
          <Topbar />
          <div className="content">
            {activePage === 'lessons'  && <LessonsPage course={selectedCourse} />}
            {activePage === 'live'     && <LiveVideoPage course={selectedCourse} />}
            {activePage === 'quiz'     && <QuizPage course={selectedCourse} />}
            {activePage === 'grades'   && <GradesPage course={selectedCourse} />}
            {activePage === 'messages' && <MessagesPage course={selectedCourse} />}
          </div>
        </main>
      </div>
    );
  }

  if (previewCourse) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content dashboard-bg">
          <Topbar />
          <div className="content">
            <CoursePreviewPage 
              course={previewCourse} 
              onBack={() => setPreviewCourse(null)} 
              onEnroll={() => { alert('Enrolled successfully!'); setPreviewCourse(null); }} 
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content dashboard-bg">
        <Topbar />
        <div className="content">
          <div className="cr-subpage">
            <div className="cr-subpage-header" style={{ alignItems: 'flex-start' }}>
              <div>
                <h2 className="cr-sub-title">My Classrooms</h2>
                <p className="cr-sub-desc">Continue learning from where you left off</p>
              </div>
              <div className="cr-category-filters" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '24px',
                      border: '1px solid ' + (categoryFilter === cat ? 'transparent' : 'var(--border-color, #e2e8f0)'),
                      background: categoryFilter === cat ? '#3b82f6' : 'var(--bg-card, #ffffff)',
                      color: categoryFilter === cat ? '#ffffff' : 'var(--text-light, #64748b)',
                      fontWeight: categoryFilter === cat ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px',
                      boxShadow: categoryFilter === cat ? '0 2px 8px rgba(59,130,246,0.3)' : 'none'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredCourses.length === 0 && (
              <p style={{ color: 'var(--text-light, #64748b)', padding: '20px 0' }}>No enrolled classes in this category yet.</p>
            )}
            <div className="cr-courses-grid">
              {filteredCourses.map(course => (
                <div key={course.id} className="cr-course-card" style={{ '--accent': course.color }}>
                  <div className="cr-course-header" style={{
                    backgroundImage: `url(${course.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: course.color,
                    height: '140px',
                    position: 'relative',
                    borderBottom: 'none',
                    padding: 0
                  }}>
                    <div style={{
                       position: 'absolute', inset: 0,
                       background: `linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.2) 100%)`, 
                       display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' 
                    }}>
                      {course.status === 'live' && <span className="cr-live-badge" style={{ position: 'absolute', top: '16px', right: '16px', margin: 0 }}><span className="cr-live-dot" />&nbsp;LIVE</span>}
                      <div className="cr-course-subject" style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>{course.subject}</div>
                      <div className="cr-course-teacher" style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '4px', margin: '4px 0 0 0' }}>{course.teacher}</div>
                    </div>
                  </div>
                  <div className="cr-course-body">
                    <div className="cr-course-stats">
                      <div className="cr-cs-item"><span className="cr-cs-val">{course.students}</span><span className="cr-cs-lbl">Students</span></div>
                      <div className="cr-cs-divider" />
                      <div className="cr-cs-item"><span className="cr-cs-val">{course.progress}%</span><span className="cr-cs-lbl">Progress</span></div>
                    </div>
                    <div className="cr-course-progress-track">
                      <div className="cr-course-progress-fill" style={{ width: `${course.progress}%`, background: course.color }} />
                    </div>
                    <div className="cr-next-class">📅 Next: {course.nextClass}</div>
                    <div className="cr-course-actions">
                      <button className="cr-btn-solid" style={{ background: course.color }} onClick={() => setSelectedCourse(course)}>
                        Enter Classroom
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cr-subpage-header" style={{ marginTop: '50px' }}>
              <div>
                <h2 className="cr-sub-title">Explore All Classrooms</h2>
                <p className="cr-sub-desc">Discover new courses on the platform</p>
              </div>
            </div>
            
            {filteredAllCourses.length === 0 && (
              <p style={{ color: 'var(--text-light, #64748b)', padding: '20px 0' }}>No additional classes found in this category.</p>
            )}
            <div className="cr-courses-grid">
              {filteredAllCourses.map(course => (
                <div key={course.id} className="cr-course-card" style={{ '--accent': course.color }}>
                  <div className="cr-course-header" style={{
                    backgroundImage: `url(${course.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: course.color,
                    height: '140px',
                    position: 'relative',
                    borderBottom: 'none',
                    padding: 0
                  }}>
                    <div style={{
                       position: 'absolute', inset: 0,
                       background: `linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.2) 100%)`, 
                       display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' 
                    }}>
                      <div className="cr-course-subject" style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>{course.subject}</div>
                      <div className="cr-course-teacher" style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '4px', margin: '4px 0 0 0' }}>{course.teacher}</div>
                    </div>
                  </div>
                  <div className="cr-course-body">
                    <div className="cr-course-stats" style={{ justifyContent: 'flex-start', gap: '20px' }}>
                      <div className="cr-cs-item"><span className="cr-cs-val">⭐ {course.rating}</span><span className="cr-cs-lbl">Rating</span></div>
                      <div className="cr-cs-item"><span className="cr-cs-val">{course.students}+</span><span className="cr-cs-lbl">Enrolled</span></div>
                    </div>
                    <div className="cr-course-actions" style={{ marginTop: '20px' }}>
                      <button 
                        className="cr-btn-outline" 
                        style={{ borderColor: course.color, color: course.color, width: '100%' }}
                        onClick={() => setPreviewCourse(course)}
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Classrooms;
