import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import studentImg from "../../assets/images/student_photo.png";
import teacherImg from "../../assets/images/teacher_photo.png";
import "../../styles/landing_page/role_selection.css";

const RoleSelection = () => {
    const navigate = useNavigate();
    const { selectRole } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null);

    const handleContinue = () => {
        if (selectedRole) {
            selectRole(selectedRole);
            
            if (selectedRole === 'teacher') {
                navigate("/teacher-application");
            } else {
                navigate("/student-dashboard");
            }
        }
    };

    return (
        <div className="role-selection-page">
            <div className="role-container">
                <div className="role-header">
                    <h2>Choose Your Role</h2>
                    <p>Tell us how you'll be using Tayssir to personalize your experience.</p>
                </div>

                <div className="role-cards">
                    {/* Student Card */}
                    <div 
                        className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
                        onClick={() => setSelectedRole('student')}
                    >
                        <div className="role-photo-wrapper">
                            <img src={studentImg} alt="Student" className="role-photo" />
                        </div>
                        <h3>I am a Student</h3>
                        <p>I want to join classes, access learning materials, and practice my skills.</p>
                    </div>

                    {/* Teacher Card */}
                    <div 
                        className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
                        onClick={() => setSelectedRole('teacher')}
                    >
                        <div className="role-photo-wrapper">
                            <img src={teacherImg} alt="Teacher" className="role-photo" />
                        </div>
                        <h3>I am a Teacher</h3>
                        <p>I want to create classrooms, share resources, and guide my students.</p>
                    </div>
                </div>

                <button 
                    className={`btn-continue ${selectedRole ? 'active' : 'disabled'}`}
                    onClick={handleContinue}
                    disabled={!selectedRole}
                >
                    Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                </button>
            </div>
        </div>
    );
};

export default RoleSelection;
