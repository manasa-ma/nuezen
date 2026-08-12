import React from 'react';
import Layout from '../../components/layout/Navbar';
import { Shield, Users, Settings, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total System Users', value: '150', icon: <Users />, color: 'bg-indigo-600' },
    { label: 'Active Sessions', value: '12', icon: <Activity />, color: 'bg-emerald-500' },
    { label: 'System Health', value: '99.9%', icon: <Shield />, color: 'bg-amber-500' },
    { label: 'Pending Configs', value: '2', icon: <Settings />, color: 'bg-slate-700' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">System Administration</h1>
        <p className="text-slate-500">Global control panel for NEUZEN AI HRMS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">System Event Log</h3>
        <div className="space-y-3">
          <p className="text-sm text-slate-600 border-l-4 border-blue-500 pl-3 py-1 bg-slate-50">Admin updated payroll settings for August 2025.</p>
          <p className="text-sm text-slate-600 border-l-4 border-emerald-500 pl-3 py-1 bg-slate-50">New HR user 'Sarah Miller' assigned to system.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;