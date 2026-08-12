import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

export default function MyAttendance() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    if (!user) return;
    const res = await API.get(`/attendance/${user._id}`);
    setLogs(res.data);
  };

  useEffect(() => { fetchLogs(); }, [user]);

  const handlePunch = async () => {
    await API.post('/attendance', {
      userId: user._id, name: user.name,
      date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString()
    });
    alert("Punched In!");
    fetchLogs();
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Daily Attendance</h1>
      <button onClick={handlePunch} className="bg-blue-600 text-white p-4 rounded-xl font-bold mb-8 shadow-lg">PUNCH IN NOW</button>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold mb-4 border-b pb-2">History</h2>
        {logs.map((l, i) => (
          <div key={i} className="flex justify-between py-2 border-b last:border-0 text-slate-600">
            <span>{l.date}</span> <span className="font-bold">{l.time}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}