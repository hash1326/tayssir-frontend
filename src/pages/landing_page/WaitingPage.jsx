import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Edit, FileSearch, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/landing_page/waiting_page.css";

const WaitingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleRefresh = () => {
    // In a real app, this would fetch the user status from an API.
    // For our mock, we can just reload the page to pick up changes in localStorage.
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="waiting-page">
      <div className="waiting-card">
        <div className="waiting-icon-wrapper">
          <Clock className="clock-icon" size={32} />
        </div>
        <h2>Application Under Review</h2>
        <p>
          Your application to become a teacher is currently being reviewed by the administration. 
          We will notify you via email once a decision has been made.
        </p>

        <div className="waiting-status-box">
          <div className={`status-indicator ${user?.status}`}></div>
          <span className="status-text">Status: <strong>{user?.status === 'pending' ? 'Pending Approval' : user?.status}</strong></span>
        </div>

        <div className="waiting-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate("/teacher-application")}
          >
            <Edit size={16} className="btn-icon" />
            Edit Information
          </button>
          
          <button 
            className="btn-primary"
            onClick={handleRefresh}
          >
            <FileSearch size={16} className="btn-icon" />
            Check My Status
          </button>
        </div>

        <div className="waiting-footer">
          <span onClick={() => navigate("/")} className="link">Return to Home</span>
          <span onClick={handleLogout} className="link logout-link" style={{ marginLeft: '15px' }}><LogOut size={14} style={{ display: 'inline', marginRight: '4px' }}/> Logout</span>
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
