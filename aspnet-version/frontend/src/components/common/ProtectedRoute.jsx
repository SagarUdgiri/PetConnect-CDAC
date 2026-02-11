import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toUpperCase()).includes(user.role?.toUpperCase())) {
    const userRole = user.role?.toUpperCase();
    
    // Determine safe landing page based on role
    let redirectPath = '/dashboard';
    if (userRole === 'ADMIN') redirectPath = '/admin';
    else if (userRole === 'USER') redirectPath = '/dashboard';
    else return <Navigate to="/login" replace />; // No valid role

    // Prevent redirecting to the same restricted page
    if (location.pathname === redirectPath) {
        return <Navigate to="/login" replace />;
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
