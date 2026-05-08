import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/StudentDashboard/Sidebar';
import Topbar from '../../components/StudentDashboard/Topbar';
import { getTeachers } from '../../api/users';
import '../../styles/student_pages.css';
import '../../styles/teacher_pages/teacher_shared.css';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeachers()
      .then(res => setTeachers(res.data.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content dashboard-bg">
        <Topbar />
        <div className="content">
          <div className="tc-page-header">
            <h2 className="tc-page-title">Instructors</h2>
            <p className="tc-page-sub">Learn from the best experts in their fields</p>
          </div>

          {loading ? (
            <div className="tc-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="tc-card" style={{ opacity: 0.4, minHeight: 200 }} />
              ))}
            </div>
          ) : teachers.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>
              No instructors found.
            </p>
          ) : (
            <div className="tc-grid">
              {teachers.map(teacher => (
                <div className="tc-card" key={teacher.id}>
                  <div className="tc-avatar-wrap">
                    <img
                      src={
                        teacher.teacher_profile?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          (teacher.first_name || '') + ' ' + (teacher.last_name || '')
                        )}&background=2563eb&color=fff`
                      }
                      alt={teacher.first_name}
                      className="tc-avatar"
                    />
                  </div>
                  <h3 className="tc-name">{teacher.first_name} {teacher.last_name}</h3>
                  <p className="tc-role">{teacher.teacher_profile?.specialization || 'Instructor'}</p>
                  <p className="tc-bio">{teacher.teacher_profile?.bio || ''}</p>
                  <div className="tc-stats">
                    <div>
                      <span className="tc-stat-val">{teacher.course_count ?? '—'}</span>
                      <span className="tc-stat-lbl">Courses</span>
                    </div>
                  </div>
                  <button className="tc-btn-msg">Send Message</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeachersList;
