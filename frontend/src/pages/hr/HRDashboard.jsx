import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import { 
  UserPlus, 
  ClipboardCheck, 
  CalendarClock, 
  Banknote, 
  Users, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function HRDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    attendanceToday: 0
  });

  // Fetch real data from live production collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🌟 FIX: Shift endpoints to query your live MongoDB collection endpoints
        const empRes = await API.get('/api/admin/users');
        const leaveRes = await API.get('/api/leaves');
        const attendRes = await API.get('/api/attendance');
        
        setStats({
          totalEmployees: empRes.data.length + 1, // +1 for the HR themselves
          pendingLeaves: leaveRes.data.filter(l => l.status === 'Pending').length,
          attendanceToday: attendRes.data.length
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">HR Management</h1>
            <p className="text-slate-500 font-medium mt-1">Manage personnel, payroll, and organization workflows.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
             <button 
              onClick={() => navigate('/hr/onboarding')}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-200"
             >
               <UserPlus size={18} className="mr-2" /> New Hire
             </button>
          </div>
        </div>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Headcount" value={stats.totalEmployees} icon={<Users className="text-blue-600" />} />
          <StatCard label="Pending Leaves" value={stats.pendingLeaves} icon={<CalendarClock className="text-amber-600" />} color="border-amber-100" />
          <StatCard label="Punched In Today" value={stats.attendanceToday} icon={<ClipboardCheck className="text-emerald-600" />} color="border-emerald-100" />
          <StatCard label="Payroll Status" value="Active" icon={<Banknote className="text-purple-600" />} color="border-purple-100" />
        </div>

        {/* MAIN WORKFLOWS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEAVE MANAGEMENT SECTION */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Leave Approval Workflow</h2>
                <button 
                  onClick={() => navigate('/hr/leaves')}
                  className="text-blue-600 font-bold text-sm flex items-center hover:underline"
                >
                  View All <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 text-center">
                <p className="text-slate-500 text-sm">
                  {stats.pendingLeaves > 0 
                    ? `You have ${stats.pendingLeaves} requests waiting for your decision.` 
                    : "All leave requests have been processed. Great job!"}
                </p>
                <button 
                  onClick={() => navigate('/hr/leaves')}
                  className="mt-4 bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 transition"
                >
                  Go to Approvals
                </button>
              </div>
            </div>
          </div>

          {/* PAYROLL & ATTENDANCE QUICK LINKS */}
          <div className="space-y-6">
            <div 
              onClick={() => navigate('/hr/payroll')}
              className="group cursor-pointer bg-slate-900 p-8 rounded-3xl shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition">
                <Banknote className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">Process Payroll</h3>
              <p className="text-slate-400 text-sm mt-2">Manage salaries, taxes, and monthly payouts for the team.</p>
            </div>

            <div 
              onClick={() => navigate('/hr/attendance')}
              className="group cursor-pointer bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:scale-[1.02]"
            >
              <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition">
                <ClipboardCheck className="text-emerald-600" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">Attendance Logs</h3>
              <p className="text-slate-500 text-sm mt-2">Review daily clock-in/out records for all employees.</p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon, color = "border-blue-50" }) {
  return (
    <div className={`bg-white p-6 rounded-3xl border-2 ${color} shadow-sm transition-transform hover:translate-y-[-4px]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      </div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}
