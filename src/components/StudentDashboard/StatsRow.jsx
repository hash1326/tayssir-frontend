import React from 'react';

const StatsRow = ({ stats }) => {
  const enrolled = stats?.active_enrollments ?? '…';
  const completed = stats?.completed_courses ?? '…';
  const lessonsCompleted = stats?.lessons_completed ?? '…';

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-info">
          <div className="val">{enrolled}</div>
          <div className="lbl">Active Enrollments</div>
          <div className="sub">Courses in progress</div>
        </div>
        <div className="stat-icon" style={{background: 'rgba(59,130,246,.12)'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-info">
          <div className="val">{completed}</div>
          <div className="lbl">Completed Courses</div>
          <div className="sub">
            {typeof enrolled === 'number' && typeof completed === 'number' && enrolled + completed > 0
              ? `${Math.round((completed / (enrolled + completed)) * 100)}% completion rate`
              : 'Great progress!'}
          </div>
        </div>
        <div className="stat-icon" style={{background: 'rgba(0,201,167,.12)'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#00c9a7" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-info">
          <div className="val">{lessonsCompleted}</div>
          <div className="lbl">Lessons Completed</div>
          <div className="sub">Keep it up!</div>
        </div>
        <div className="stat-icon" style={{background: 'rgba(245,158,11,.12)'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      </div>
    </div>
  );
};

export default StatsRow;
