import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // If user is already logged in, redirect to their respective home
    const userRole = user.role?.toUpperCase();
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (userRole === 'USER') return <Navigate to="/dashboard" replace />;
    
    // If role is undefined/invalid, something is wrong, allow them to stay or redirect to login
    // This part is tricky if they are already on /login. 
    // Usually, we should treat them as logged-out if no role.
  }

  return children;
};

export default PublicRoute;
