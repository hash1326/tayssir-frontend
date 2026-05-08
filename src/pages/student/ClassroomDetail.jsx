import React, { useState } from 'react';
import '../../styles/teacher_classes/teacher_class_detail.css';

const LessonsView = () => {
  return (
    <div className="crd-lessons-view">
      <div className="crd-topbar">
        <div className="crd-promo-pill">Watch recorded lectures anytime and learn at your own pace</div>
        <div className="crd-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="" />
        </div>
      </div>

      <div className="crd-lessons-list">
        <div className="crd-video-card featured">
          <div className="crd-vc-top">
            <div className="crd-play-icon">▶</div>
            <div className="crd-vc-info">
              <h3>Introduction to Computer Science</h3>
              <p><strong>Duration:</strong> 15 min <br/> <strong>Level:</strong> Beginner</p>
            </div>
            <div className="crd-vc-actions">
              <span className="crd-badge progress">⏳ 78%</span>
              <button className="crd-btn btn-blue">continue</button>
              <div className="btn-dots">...</div>
              <div className="btn-share">🔗</div>
            </div>
          </div>
          
          <div className="crd-vc-tabs">
            <button className="active">Exercises</button>
            <button>Summary</button>
          </div>
          <div className="crd-vc-tab-content">
             <div className="crd-exercise-item">
               <span className="icon">📋</span>
               <div>
                 <h4>Computer Science Quiz</h4>
                 <p>Test · 8 Questions</p>
               </div>
               <div className="crd-ex-actions">
                 <span className="crd-badge badge-test">🔵 Test</span>
                 <button className="crd-btn btn-blue">▶ Start</button>
               </div>
             </div>
             <div className="crd-exercise-item">
               <span className="icon text-blue">📄</span>
               <div>
                 <h4>Assignment 1</h4>
               </div>
               <div className="crd-ex-actions">
                 <button className="icon-btn download">☁️</button>
                 <div className="btn-dots">...</div>
               </div>
             </div>
          </div>
        </div>

        {[
          { title: 'Introduction to Databases and SQL', dur: '28 min', lvl: 'Beginner', p: '36%', status: 'continue', done: false },
          { title: 'Firewalls and Network Security Fundamentals', dur: '31 min', lvl: 'Intermediate', p: '50%', status: 'continue', done: false },
          { title: 'Introduction to Linear Algebra', dur: '90 min', lvl: 'Beginner', p: 'completed', status: 'Review', done: true },
          { title: 'Searching Algorithms Explained', dur: '45 min', lvl: 'Beginner', p: '10%', status: 'continue', done: false },
        ].map((v, i) => (
          <div key={i} className="crd-video-card">
            <div className="crd-vc-top">
              <div className="crd-play-icon lite">▶</div>
              <div className="crd-vc-info">
                <h3>{v.title}</h3>
                <p><strong>Duration:</strong> {v.dur} <br/> <strong>Level:</strong> {v.lvl}</p>
              </div>
              <div className="crd-vc-actions">
                <span className={`crd-badge ${v.done ? 'completed' : 'progress'}`}>{v.done ? '✓ completed' : `⏳ ${v.p}`}</span>
                <button className={`crd-btn ${v.done ? 'btn-blue' : 'btn-blue'}`}>{v.status}</button>
                <div className="btn-share">🔗</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GradesView = () => {
  return (
    <div className="crd-grades-view">
      <div className="crd-grades-header">
        <h2>Test & Grades</h2>
        <p>Track your performance and test result</p>
      </div>

      <div className="crd-stats-row">
        <div className="crd-stat-card">
          <h4>Average Score</h4>
          <div className="stat-value text-green">80.3%</div>
          <p>above class average</p>
        </div>
        <div className="crd-stat-card">
          <h4>Test completed</h4>
          <div className="stat-value text-dark">15</div>
          <div className="stat-bar"><div style={{width:'75%'}}></div><span>75%</span></div>
          <p>5 test remaining</p>
        </div>
        <div className="crd-stat-card">
          <h4>Success Rate</h4>
          <div className="stat-value text-blue">95%</div>
          <p className="text-green">✓ most test passed</p>
        </div>
      </div>

      <div className="crd-recent-tests">
        <div className="crd-rt-header">
          <h3>Recent Test results</h3>
          <p>Your latest assignment and test result</p>
        </div>
        
        <div className="crd-test-list">
          {[
            { title: 'Basic Electronics Components Identification', course: 'Introduction to Electronics', score: '16 of 20', pct: '82%', date: 'Dec,5' },
            { title: 'Introduction to Algorithms', course: 'Searching Algorithms Explained', score: '9 of 25', pct: '35%', date: 'Dec,12', bad: true },
            { title: 'Network Attacks & Defense Basics Quiz', course: 'Cybersecurity Fundamentals', score: '15 of 20', pct: '75%', date: 'Dec,1' },
          ].map((t, i) => (
             <div key={i} className="crd-test-card">
               <div className="crd-tc-left">
                 <h4>{t.title}</h4>
                 <p className="text-light">Course: <span className="text-dark">{t.course}</span></p>
               </div>
               <div className="crd-tc-right">
                 <div className="tc-col">
                   <span className="tc-lbl">Score</span>
                   <span className="tc-val">{t.score}</span>
                 </div>
                 <div className="tc-col">
                   <span className="tc-lbl">Percentage</span>
                   <span className={`tc-val ${t.bad ? 'text-red' : 'text-green'}`}>{t.pct}</span>
                 </div>
                 <div className="tc-col">
                   <span className="tc-lbl">Date</span>
                   <span className="tc-val">{t.date}</span>
                 </div>
                 <button className="crd-btn-small">view details</button>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClassroomDetail = ({ course, onBack }) => {
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <div className="crd-wrapper">
      <div className="crd-sidebar">
        <div className="crd-top-menu-pill">≡</div>
        
        <div className="crd-user-profile">
          <div className="crd-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p>User</p>
        </div>

        <nav className="crd-nav">
          <button className={`crd-nav-item ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>
             <span className="icon">📹</span> Live video
          </button>
          <button className={`crd-nav-item ${activeTab === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveTab('quizzes')}>
             <span className="icon">📝</span> Quizzes
          </button>
          <button className={`crd-nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
             <span className="icon">💬</span> messages
          </button>
          <button className={`crd-nav-item ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => setActiveTab('grades')}>
             <span className="icon">📄</span> grades
          </button>
          <button className={`crd-nav-item ${activeTab === 'lessons' ? 'active' : ''}`} onClick={() => setActiveTab('lessons')}>
             <span className="icon">📖</span> Lessons
          </button>
        </nav>

        <div className="crd-sidebar-bottom">
          <button className="crd-back-btn" onClick={onBack}>
             ←
          </button>
        </div>
      </div>

      <div className="crd-main-content">
         <div className="crd-main-inner">
           {activeTab === 'grades' && <GradesView />}
           {activeTab === 'lessons' && <LessonsView />}
           {activeTab === 'live' && (
              <div className="crd-placeholder">
                <span style={{fontSize:'48px'}}>📹</span>
                <h2>Live Video</h2>
                <p>No active live sessions for {course.subject}.</p>
              </div>
           )}
           {activeTab === 'quizzes' && (
              <div className="crd-placeholder">
                <span style={{fontSize:'48px'}}>📝</span>
                <h2>Quizzes</h2>
                <p>No pending quizzes for {course.subject}.</p>
              </div>
           )}
           {activeTab === 'messages' && (
              <div className="crd-placeholder">
                <span style={{fontSize:'48px'}}>💬</span>
                <h2>Messages</h2>
                <p>Your inbox is empty.</p>
              </div>
           )}
         </div>
      </div>
    </div>
  );
};

export default ClassroomDetail;
