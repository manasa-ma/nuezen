import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { Send, Clock, Calendar } from 'lucide-react';

export default function MyLeaves() {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [reason, setReason] = useState('');

  const fetchLeaves = async () => {
    if (!user || !user._id) return;
    try {
      // 🌟 FIX: Shift route endpoint to pull directly from your production backend API path
      const res = await API.get(`/api/leaves/${user._id}`);
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching user leaves:", err);
    }
  };

  useEffect(() => { fetchLeaves(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Session expired. Please log in again.");
    try {
      // 🌟 FIX: Aligned path prefix routing to /api paths match structure
      await API.post('/api/leaves', { 
        userId: user._id, 
        userName: user.name, 
        reason, 
        type: 'Annual' 
      });
      alert("Leave Application Sent!");
      setReason('');
      fetchLeaves();
    } catch (err) {
      alert("Failed to submit leave request.");
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Leave Management</h1>
        <p className="text-slate-500 font-medium">Apply for time off and track approval status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
          <h2 className="font-bold text-slate-800 mb-6 flex items-center">
            <Send size={18} className="mr-2 text-blue-600" /> Apply Now
          </h2>
          <textarea 
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6 outline-none focus:ring-2 ring-blue-500 border-none text-sm font-medium"
            placeholder="Reason for leave request..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={4}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">
            SUBMIT REQUEST
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center bg-slate-50/30">
             <Calendar size={18} className="mr-2 text-slate-400" /> <span className="font-bold text-slate-700">My Requests</span>
          </div>
          <div className="divide-y divide-slate-50">
            {leaves.length === 0 && <p className="p-10 text-center text-slate-400 italic">No leave requests found.</p>}
            {leaves.map((l, i) => (
              // 🌟 FIX: Updated unique row identity mapping key targeting l._id for MongoDB collection logs
              <div key={l._id || i} className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition">
                <div>
                  <p className="font-bold text-slate-700">{l.reason}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Annual Leave</p>
                </div>
                {/* 🌟 FIX: Improved status dynamic rendering styles badge tracking rules */}
                <div className={`flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                  l.status === 'Rejected' ? 'bg-red-50 text-red-600' : 
                  'bg-amber-50 text-amber-600'
                }`}>
                  <Clock size={12} className="mr-1" /> {l.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
