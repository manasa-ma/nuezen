import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const storedUser = JSON.parse(localStorage.getItem('profile'));

  if (!storedUser) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(storedUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;