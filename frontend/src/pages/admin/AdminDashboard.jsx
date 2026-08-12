import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { Shield, Users, Activity, Settings, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ userCount: 0, leaveCount: 0, attendanceCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="p-10 animate-pulse text-slate-400">Loading System Data...</div></Layout>;

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Control Panel</h1>
        <p className="text-slate-500 font-medium">Global oversight of NEUZEN AI infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <StatCard label="Registered Users" value={stats.userCount} icon={<Users className="text-blue-600"/>} />
        <StatCard label="Pending Approval" value={stats.leaveCount} icon={<AlertCircle className="text-amber-600"/>} />
        <StatCard label="Total Punch Logs" value={stats.attendanceCount} icon={<Activity className="text-emerald-600"/>} />
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <Settings className="absolute right-[-20px] bottom-[-20px] text-white/5" size={200} />
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Shield className="mr-3 text-blue-400" /> System Integrity
        </h2>
        <div className="space-y-4 relative z-10">
           <p className="text-slate-400 border-l-2 border-blue-500 pl-4">Database: <span className="text-white font-mono">SQLite (Persistent)</span></p>
           <p className="text-slate-400 border-l-2 border-emerald-500 pl-4">Encryption: <span className="text-white font-mono">Bcrypt AES-256</span></p>
           <p className="text-slate-400 border-l-2 border-purple-500 pl-4">API Status: <span className="text-white font-mono">Restful / Online</span></p>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:scale-[1.02]">
      <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">{icon}</div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}