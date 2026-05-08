import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route and redirects based on authentication, role, and status.
 */
const ProtectedRoute = ({ children, allowedRoles = [], requireApproval = true }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>; // Or a proper spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle role selection phase
  if (!user.role && location.pathname !== '/role-selection') {
    return <Navigate to="/role-selection" replace />;
  }

  // Handle pending status for teachers
  if (requireApproval && user.role === 'teacher' && user.status === 'pending' && location.pathname !== '/waiting-page') {
    return <Navigate to="/waiting-page" replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective home if they try to access unauthorized routes
    if (user.role === 'student') return <Navigate to="/student-dashboard" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher-dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
