import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, BookOpen, FileQuestion, Video, Award,
  MessageSquare, Users, Settings, Sun, Moon, Bell
} from "lucide-react";
import ClassLessons from "../../components/class_detail/ClassLessons.jsx";
import ClassQuiz from "../../components/class_detail/ClassQuiz.jsx";
import ClassLive from "../../components/class_detail/ClassLive.jsx";
import ClassGrades from "../../components/class_detail/ClassGrades.jsx";
import ClassMessage from "../../components/class_detail/ClassMessage.jsx";
import ClassSettings from "../../components/class_detail/ClassSettings.jsx";
import ClassStudents from "../../components/class_detail/ClassStudents.jsx";
import { getCourse } from "../../api/courses";
import "../../styles/teacher_pages/teacher_shared.css";
import "../../styles/teacher_classes/teacher_class_detail.css";
import "../../styles/teacher_pages/teacher_dashboard.css";

const TeacherClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('platform-dark-mode') === 'true');
  const [activeTab, setActiveTab] = useState("lessons");

  useEffect(() => {
    getCourse(classId)
      .then(res => setCourseData(res.data))
      .catch(() => {});
  }, [classId]);

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

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem('platform-dark-mode', newVal);
    window.dispatchEvent(new Event('theme-changed'));
  };

  const title    = courseData?.title || '…';
  const subject  = courseData?.category_name || courseData?.level || '';
  const students = courseData?.enrollment_count ?? 0;
  const code     = courseData?.slug || classId;

  const classData = { id: classId, title, subject, students, code };

  const renderContent = () => {
    switch (activeTab) {
      case "lessons":  return <ClassLessons courseId={classId} />;
      case "quiz":     return <ClassQuiz />;
      case "live":     return <ClassLive courseId={classId} />;
      case "grade":    return <ClassGrades courseId={classId} />;
      case "message":  return <ClassMessage courseId={classId} />;
      case "students": return <ClassStudents courseId={classId} />;
      case "settings": return <ClassSettings classData={classData} />;
      default:         return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand cursor-pointer" onClick={() => navigate('/teacher-classes')}>
          <ArrowLeft size={20} className="back-icon" />
          <div className="brand-text">
            <h3>Back to Classes</h3>
          </div>
        </div>

        <div className="class-sidebar-header">
          <div className="class-sidebar-icon">
            <BookOpen size={24} color="white"/>
          </div>
          <h4>{title}</h4>
          <p>{code}</p>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'lessons' ? 'active' : ''}`} onClick={() => setActiveTab('lessons')}>
            <BookOpen size={20}/>
            <span>Lessons</span>
          </button>
          <button className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
            <FileQuestion size={20}/>
            <span>Quiz</span>
          </button>
          <button className={`nav-item ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>
            <Video size={20}/>
            <span>Live Video</span>
          </button>
          <button className={`nav-item ${activeTab === 'grade' ? 'active' : ''}`} onClick={() => setActiveTab('grade')}>
            <Award size={20}/>
            <span>Grades</span>
          </button>
          <button className={`nav-item ${activeTab === 'message' ? 'active' : ''}`} onClick={() => setActiveTab('message')}>
            <MessageSquare size={20}/>
            <span>Message</span>
          </button>
        </nav>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
            <Users size={20}/>
            <span>Students ({students})</span>
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20}/>
            <span>Class Settings</span>
          </button>
        </nav>
      </aside>

      <main className="main-content dashboard-bg">
        <header className="dash-header">
          <div className="header-greeting">
            <h1>{title}</h1>
            <p>{subject}{subject && ' • '}{students} Student{students !== 1 ? 's' : ''}</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={20}/><span className="badge-dot red"></span></button>
            <button className="icon-btn" onClick={toggleDarkMode} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
               {isDarkMode ? <Sun size={20}/> : <Moon size={20} />}
            </button>
            <div className="user-avatar-wrapper" onClick={() => navigate('/teacher-profile')}>
              <div className="user-avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
              </div>
              <div className="online-indicator"></div>
            </div>
          </div>
        </header>

        <div className="class-detail-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TeacherClassDetail;
