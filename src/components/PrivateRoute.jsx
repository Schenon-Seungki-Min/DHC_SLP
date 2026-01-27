import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children, adminOnly = false, masterOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (masterOnly && user.role !== 'master') {
    return <Navigate to="/dashboard" replace />;
  }

  if (adminOnly && user.role !== 'admin' && user.role !== 'master') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
