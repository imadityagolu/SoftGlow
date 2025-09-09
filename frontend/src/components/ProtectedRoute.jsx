import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { isAuthenticated, userType, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to appropriate login page
  if (!isAuthenticated()) {
    const loginPath = requiredUserType === 'admin' ? '/admin/login' : '/customer/login';
    return <Navigate to={loginPath} replace />;
  }

  // If authenticated but wrong user type, redirect to appropriate login page
  if (userType !== requiredUserType) {
    const loginPath = requiredUserType === 'admin' ? '/admin/login' : '/customer/login';
    return <Navigate to={loginPath} replace />;
  }

  // If authenticated and correct user type, render the protected component
  return children;
};

export default ProtectedRoute;