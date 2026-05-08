import React from 'react';

const ClassroomSidebar = ({ activePage, setActivePage, onBack }) => {
  return (
    <aside className="sidebar cr-aside-menu">
      <div className="cr-sb-profile">
        <div className="cr-sb-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div className="cr-sb-name">User</div>
      </div>
      
      <div className="nav-section cr-sb-nav">
        <button className={`cr-sb-item ${activePage === 'live' ? 'active' : ''}`} onClick={() => setActivePage('live')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          Live video
        </button>
        <button className={`cr-sb-item ${activePage === 'quiz' ? 'active' : ''}`} onClick={() => setActivePage('quiz')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Quizzes
        </button>
        <button className={`cr-sb-item ${activePage === 'messages' ? 'active' : ''}`} onClick={() => setActivePage('messages')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/></svg>
          messages
        </button>
        <button className={`cr-sb-item ${activePage === 'grades' ? 'active' : ''}`} onClick={() => setActivePage('grades')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          grades
        </button>
        <button className={`cr-sb-item ${activePage === 'lessons' ? 'active' : ''}`} onClick={() => setActivePage('lessons')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Lessons
        </button>
      </div>

      <div className="cr-sb-bottom">
        <button className="cr-sb-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
      </div>
    </aside>
  );
};

export default ClassroomSidebar;
