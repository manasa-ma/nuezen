import React from 'react';
import Layout from '../../components/layout/Navbar';
import { Users, UserPlus, Clock, CheckCircle } from 'lucide-react';

const HRDashboard = () => {
  const stats = [
    { label: 'Total Employees', value: '24', icon: <Users size={20}/>, color: 'bg-blue-500' },
    { label: 'New Candidates', value: '12', icon: <UserPlus size={20}/>, color: 'bg-purple-500' },
    { label: 'Leave Requests', value: '3', icon: <Clock size={20}/>, color: 'bg-orange-500' },
    { label: 'Onboarding Done', value: '8', icon: <CheckCircle size={20}/>, color: 'bg-emerald-500' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">HR Overview</h1>
        <p className="text-slate-500">Track company metrics and manage workflows.</p>
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
        <h3 className="font-bold text-slate-800 mb-4">Pending Approvals</h3>
        <p className="text-sm text-slate-500 italic">No new requests today.</p>
      </div>
    </Layout>
  );
};

export default HRDashboard;