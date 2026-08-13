import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

export default function MyAttendance() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    if (!user || !user._id) return;
    try {
      // 🌟 FIX: Updated route string path to match your live backend endpoint
      const res = await API.get(`/api/attendance/${user._id}`);
      setLogs(res.data);
    } catch (err) {
      console.error("Error loading attendance history:", err);
    }
  };

  useEffect(() => { fetchLogs(); }, [user]);

  const handlePunch = async () => {
    if (!user) return alert("Session expired. Please log in again.");
    try {
      // 🌟 FIX: Changed path to /api/attendance and aligned name property to userName
      await API.post('/api/attendance', {
        userId: user._id, 
        userName: user.name, // Matches your backend database schema requirement
        date: new Date().toLocaleDateString(), 
        time: new Date().toLocaleTimeString()
      });
      alert("Punched In successfully!");
      fetchLogs(); // Automatically reloads your login list below
    } catch (err) {
      alert("Failed to register attendance punch.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Daily Attendance</h1>
        <p className="text-slate-500 font-medium mb-6">Clock your daily work session hours directly into the ledger.</p>
        
        <button 
          onClick={handlePunch} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black mb-8 shadow-xl shadow-blue-100 active:scale-95 transition"
        >
          PUNCH IN NOW
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-50 pb-3">History Logs</h2>
          
          {logs.length === 0 ? (
            <p className="text-slate-400 italic py-4">No punch cards recorded for this profile yet.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {logs.map((l, i) => (
                // 🌟 FIX: Checked for MongoDB _id key availability, falls back to map index safely
                <div key={l._id || i} className="flex justify-between py-3.5 text-slate-600 font-medium">
                  <span>{l.date}</span> 
                  <span className="font-black text-blue-600">{l.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
