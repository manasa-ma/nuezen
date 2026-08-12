import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { Clock, Calendar, Download, CheckCircle } from 'lucide-react';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [attendanceStatus, setAttendanceStatus] = useState("Not Marked");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('profile'));

  // 1. Check if already checked in today when page loads
  useEffect(() => {
    const checkTodayAttendance = async () => {
      try {
        const res = await API.get(`/attendance/${user._id}`);
        const today = new Date().toLocaleDateString();
        const found = res.data.find(log => log.date === today);
        if (found) setAttendanceStatus("Checked In");
      } catch (err) {
        console.error("Error fetching attendance");
      }
    };
    if (user) checkTodayAttendance();
  }, [user]);

  // 2. The Check In Action
  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await API.post('/attendance', {
        userId: user._id,
        userName: user.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });
      setAttendanceStatus("Checked In");
      alert("✅ Attendance marked successfully!");
    } catch (err) {
      alert("Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Employee Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Attendance Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Daily Attendance</p>
              <h2 className={`text-3xl font-black mb-6 ${attendanceStatus === 'Checked In' ? 'text-emerald-500' : 'text-slate-800'}`}>
                {attendanceStatus}
              </h2>
            </div>
            
            {attendanceStatus === "Not Marked" ? (
              <button 
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition shadow-lg shadow-blue-100"
              >
                {loading ? "Processing..." : "Check In"}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold bg-emerald-50 py-4 rounded-2xl">
                <CheckCircle size={20} /> Success
              </div>
            )}
          </div>

          {/* Leave Balance Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Leave Balance</p>
              <h2 className="text-3xl font-black text-slate-800 mb-6">12 Days</h2>
            </div>
            <button 
              onClick={() => navigate('/employee/leaves')}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold transition border border-slate-200"
            >
              Request Leave
            </button>
          </div>

          {/* Pay Slip Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Latest Pay Slip</p>
              <h2 className="text-3xl font-black text-slate-800 mb-6">July 2025</h2>
            </div>
            <button 
              onClick={() => navigate('/employee/payroll')}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold transition border border-slate-200"
            >
              Go to Payroll
            </button>
          </div>

        </div>

        {/* RECENT ACTIVITY PREVIEW */}
        <div className="mt-10 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
           <Clock className="absolute right-[-20px] bottom-[-20px] text-white/5" size={200} />
           <div className="relative z-10">
             <h3 className="text-xl font-bold mb-2">Welcome Back, {user?.name}!</h3>
             <p className="text-slate-400 max-w-md">Your work session is active. Don't forget to review your tasks and upcoming team meetings in the calendar.</p>
             <button 
              onClick={() => navigate('/employee/attendance')}
              className="mt-6 flex items-center text-blue-400 font-bold hover:underline"
             >
               View full history <Clock size={16} className="ml-2" />
             </button>
           </div>
        </div>
      </div>
    </Layout>
  );
}