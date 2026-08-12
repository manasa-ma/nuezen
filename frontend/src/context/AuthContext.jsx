import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('profile');
    if (stored) setUser(JSON.parse(stored));
  }, []);

// --- Update the login function in AuthContext.jsx ---
const login = (userData) => {
  localStorage.setItem('profile', JSON.stringify(userData));
  setUser(userData);

  // Use console log to see what role the backend is sending
  console.log("User logged in with role:", userData.role);

  // EXACT MATCH REDIRECTION
  if (userData.role === 'Admin') {
    navigate('/admin/dashboard');
  } else if (userData.role === 'HR') {
    navigate('/hr/dashboard');
  } else {
    navigate('/employee/dashboard');
  }
};

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};