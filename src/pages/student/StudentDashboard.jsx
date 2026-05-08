import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/StudentDashboard/Sidebar';
import Topbar from '../../components/StudentDashboard/Topbar';
import WelcomeBanner from '../../components/StudentDashboard/WelcomeBanner';
import StatsRow from '../../components/StudentDashboard/StatsRow';
import BottomGrid from '../../components/StudentDashboard/BottomGrid';
import { getStudentDashboard } from '../../api/courses';

// Import unified teacher styles instead of the conflicting dashboard wrapper
import '../../styles/teacher_pages/teacher_shared.css';
import '../../styles/teacher_pages/dashboard.css';

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState('Student');
  const [dashStats, setDashStats] = useState(null);

  useEffect(() => {
    const userEmail = localStorage.getItem("currentUserEmail");
    if (userEmail) {
      const savedProfile = localStorage.getItem(userEmail + "_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.fullName) setStudentName(parsed.fullName);
        } catch (e) {}
      }
    }
    getStudentDashboard()
      .then((res) => setDashStats(res.data.stats))
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content dashboard-bg">
        <Topbar />
        <div className="content" style={{ padding: '0 40px 40px' }}>
          <div className="welcome-banner" style={{ marginTop: '28px' }}>
            <h2>Welcome back, {studentName}</h2>
            <p>Ready to continue your learning journey?</p>
          </div>
          <StatsRow stats={dashStats} />
          <BottomGrid />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
