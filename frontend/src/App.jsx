import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Auth & Layout
import Login from './pages/auth/Login';
import ProtectedRoute from './components/layout/ProtectedRoute';

// 2. HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import Onboarding from './pages/hr/Onboarding';
import LeaveApprovals from './pages/hr/LeaveApprovals';
import HRAttendance from './pages/hr/Attendance';
import Payroll from './pages/hr/Payroll';

// 3. Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyAttendance from './pages/employee/MyAttendance';
import MyLeaves from './pages/employee/MyLeaves';
import MyPayroll from './pages/employee/MyPayroll';
import TeamCalendarPage from './pages/employee/Calendar'; // ONLY ONE IMPORT FOR CALENDAR

// 4. Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* ADMIN ROUTES */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><UserManagement /></ProtectedRoute>} />

      {/* HR ROUTES */}
      <Route path="/hr/dashboard" element={<ProtectedRoute allowedRoles={['HR']}><HRDashboard /></ProtectedRoute>} />
      <Route path="/hr/onboarding" element={<ProtectedRoute allowedRoles={['HR']}><Onboarding /></ProtectedRoute>} />
      <Route path="/hr/leaves" element={<ProtectedRoute allowedRoles={['HR']}><LeaveApprovals /></ProtectedRoute>} />
      <Route path="/hr/attendance" element={<ProtectedRoute allowedRoles={['HR']}><HRAttendance /></ProtectedRoute>} />
      <Route path="/hr/payroll" element={<ProtectedRoute allowedRoles={['HR']}><Payroll /></ProtectedRoute>} />

      {/* EMPLOYEE ROUTES */}
      <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={['Employee', 'HR']}><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/attendance" element={<ProtectedRoute allowedRoles={['Employee', 'HR']}><MyAttendance /></ProtectedRoute>} />
      <Route path="/employee/leaves" element={<ProtectedRoute allowedRoles={['Employee', 'HR']}><MyLeaves /></ProtectedRoute>} />
      <Route path="/employee/payroll" element={<ProtectedRoute allowedRoles={['Employee', 'HR']}><MyPayroll /></ProtectedRoute>} />
      <Route path="/employee/calendar" element={<ProtectedRoute allowedRoles={['Employee', 'HR', 'Admin']}><TeamCalendarPage /></ProtectedRoute>} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}