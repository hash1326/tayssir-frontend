import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/landing_page/landing_page.jsx";
import Login from "./pages/landing_page/Login.jsx";
import SignUp from "./pages/landing_page/SignUp.jsx";
import SignUpRoleSelect from "./pages/landing_page/SignUpRoleSelect.jsx";
import EmailVerification from "./pages/landing_page/EmailVerification.jsx";
import RoleSelection from "./pages/landing_page/RoleSelection.jsx";
import TeacherApplication from "./pages/teacher_pages/TeacherApplication.jsx";
import WaitingPage from "./pages/landing_page/WaitingPage.jsx";
import TeacherProfile from "./pages/teacher_pages/TeacherProfile.jsx";
import TeacherDashboard from "./pages/teacher_pages/TeacherDashboard.jsx";
import TeacherClasses from "./pages/teacher_classes/TeacherClasses.jsx";
import CreateClassroom from "./pages/teacher_classes/CreateClassroom.jsx";
import TeacherStudents from "./pages/teacher_pages/TeacherStudents.jsx";
import TeacherSchedule from "./pages/teacher_pages/TeacherSchedule.jsx";
import TeacherSettings from "./pages/teacher_pages/TeacherSettings.jsx";
import TeacherLibrary from "./pages/teacher_pages/TeacherLibrary.jsx";
import TeacherClassDetail from "./pages/teacher_classes/TeacherClassDetail.jsx";
import CreateQuiz from "./pages/teacher_classes/CreateQuiz.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminTeachers from "./pages/admin/AdminTeachers.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminCourses from "./pages/admin/AdminCourses.jsx";
import AdminLibrary from "./pages/admin/AdminLibrary.jsx";
import AdminSecurity from "./pages/admin/AdminSecurity.jsx";
import AdminModeration from "./pages/admin/AdminModeration.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import CoursesPage from "./pages/student/CoursesPage.jsx";
import CourseDetailPage from "./pages/student/CourseDetailPage.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentClassrooms from "./pages/student/Classrooms.jsx";
import StudentLibrary from "./pages/student/Library.jsx";
import StudentSchedule from "./pages/student/Schedule.jsx";
import StudentSettings from "./pages/student/Settings.jsx";
import StudentClassroomDetail from "./pages/student/ClassroomDetail.jsx";

import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* ── Public Auth Routes ──────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/*
              Sign Up Flow (all public, no auth needed):
              Step 1: /signup          → Choose role (Student or Teacher)
              Step 2a: /signup/student → Student registration form
              Step 2b: /signup/teacher → Teacher application form
            */}
            <Route path="/signup" element={<SignUpRoleSelect />} />
            <Route path="/signup/student" element={<SignUp />} />
            <Route path="/signup/teacher" element={<TeacherApplication />} />
            <Route path="/verify-email" element={<EmailVerification />} />

            {/* Post-login role assignment (edge case: user logged in with no role) */}
            <Route path="/role-selection" element={
              <ProtectedRoute requireApproval={false}>
                <RoleSelection />
              </ProtectedRoute>
            } />

            {/* Teacher Pending Flow */}
            <Route path="/teacher-application" element={
              <ProtectedRoute allowedRoles={['teacher']} requireApproval={false}>
                <TeacherApplication />
              </ProtectedRoute>
            } />
            <Route path="/waiting-page" element={<WaitingPage />} />

            {/* Teacher Protected Routes */}
            <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher-profile" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherProfile /></ProtectedRoute>} />
            <Route path="/teacher-classes" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherClasses /></ProtectedRoute>} />
            <Route path="/teacher-class/:classId" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherClassDetail /></ProtectedRoute>} />
            <Route path="/create-class" element={<ProtectedRoute allowedRoles={['teacher']}><CreateClassroom /></ProtectedRoute>} />
            <Route path="/teacher-students" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherStudents /></ProtectedRoute>} />
            <Route path="/teacher-schedule" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSchedule /></ProtectedRoute>} />
            <Route path="/teacher-settings" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSettings /></ProtectedRoute>} />
            <Route path="/teacher-library" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherLibrary /></ProtectedRoute>} />
            <Route path="/create-quiz" element={<ProtectedRoute allowedRoles={['teacher']}><CreateQuiz /></ProtectedRoute>} />
            <Route path="/create-quiz/:classId" element={<ProtectedRoute allowedRoles={['teacher']}><CreateQuiz /></ProtectedRoute>} />

            {/* Student Protected Routes */}
            <Route path="/courses" element={<ProtectedRoute allowedRoles={['student']}><CoursesPage /></ProtectedRoute>} />
            <Route path="/courses/course/:courseId" element={<ProtectedRoute allowedRoles={['student']}><CourseDetailPage /></ProtectedRoute>} />
            <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student-classrooms" element={<ProtectedRoute allowedRoles={['student']}><StudentClassrooms /></ProtectedRoute>} />
            <Route path="/student-classroom/:id" element={<ProtectedRoute allowedRoles={['student']}><StudentClassroomDetail /></ProtectedRoute>} />
            <Route path="/student-library" element={<ProtectedRoute allowedRoles={['student']}><StudentLibrary /></ProtectedRoute>} />
            <Route path="/student-schedule" element={<ProtectedRoute allowedRoles={['student']}><StudentSchedule /></ProtectedRoute>} />
            <Route path="/student-settings" element={<ProtectedRoute allowedRoles={['student']}><StudentSettings /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={['admin']}><AdminTeachers /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['admin']}><AdminCourses /></ProtectedRoute>} />
            <Route path="/admin/library" element={<ProtectedRoute allowedRoles={['admin']}><AdminLibrary /></ProtectedRoute>} />
            <Route path="/admin/security" element={<ProtectedRoute allowedRoles={['admin']}><AdminSecurity /></ProtectedRoute>} />
            <Route path="/admin/moderation" element={<ProtectedRoute allowedRoles={['admin']}><AdminModeration /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
