import React from 'react';
import Layout from '../../components/layout/Navbar';

const EmployeeDashboard = () => {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Employee Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Daily Attendance</h3>
          <p className="text-2xl font-bold mt-2">Not Marked</p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium">Check In</button>
        </div>
        
        {/* Leave Balance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Leave Balance</h3>
          <p className="text-2xl font-bold mt-2">12 Days</p>
          <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium">Request Leave</button>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Latest Pay Slip</h3>
          <p className="text-2xl font-bold mt-2">July 2025</p>
          <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium">Download</button>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;