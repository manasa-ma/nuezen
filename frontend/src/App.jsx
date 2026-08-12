import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HRDashboard from './pages/hr/HRDashboard';
import Onboarding from './pages/hr/Onboarding';
import LeaveApprovals from './pages/hr/LeaveApprovals';
import Payroll from './pages/hr/Payroll';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyLeaves from './pages/employee/MyLeaves';
import MyAttendance from './pages/employee/MyAttendance';
import MyPayroll from './pages/employee/MyPayroll';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Admin */}
      <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['Admin']}>
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
          </Routes>
      </ProtectedRoute>} />

      {/* HR */}
      <Route path="/hr/*" element={<ProtectedRoute allowedRoles={['HR']}>
          <Routes>
            <Route path="dashboard" element={<HRDashboard />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="leaves" element={<LeaveApprovals />} />
            <Route path="payroll" element={<Payroll />} />
          </Routes>
      </ProtectedRoute>} />

      {/* Employee */}
      <Route path="/employee/*" element={<ProtectedRoute allowedRoles={['Employee']}>
          <Routes>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="leaves" element={<MyLeaves />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="payroll" element={<MyPayroll />} />
          </Routes>
      </ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}