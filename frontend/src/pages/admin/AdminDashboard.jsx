import React from 'react';
import Layout from '../../components/layout/Navbar';
import { Shield, Activity, Settings, Database, Server } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-center md:text-left">System Intelligence</h1>
          <p className="text-slate-500 font-medium mt-1 text-center md:text-left">Full system access and global configuration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SYSTEM STATUS */}
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <Activity className="absolute right-[-20px] bottom-[-20px] text-white/5" size={200} />
            <div className="relative z-10">
              <div className="bg-emerald-500 w-3 h-3 rounded-full animate-pulse mb-6"></div>
              <h2 className="text-2xl font-bold mb-4">Infrastructure Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400 text-sm">Backend API</span>
                  <span className="text-emerald-400 font-mono text-sm">ONLINE</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400 text-sm">Auth Module</span>
                  <span className="text-emerald-400 font-mono text-sm">SECURE</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400 text-sm">Database</span>
                  <span className="text-blue-400 font-mono text-sm">SQLITE_PERSISTENT</span>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM SETTINGS PREVIEW */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-8 text-slate-800">
                <Settings size={28} />
                <h2 className="text-2xl font-bold">Global Settings</h2>
             </div>
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization Name</label>
                   <input disabled value="NEUZEN AI" className="w-full bg-slate-50 p-3 rounded-xl mt-1 border-none text-slate-600 font-bold" />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Language</label>
                   <input disabled value="English (Global)" className="w-full bg-slate-50 p-3 rounded-xl mt-1 border-none text-slate-600 font-bold" />
                </div>
                <button className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-tighter cursor-not-allowed">
                   Update Global Config (Read Only)
                </button>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}