import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';

export default function MyAttendance() {
  const [logs, setLogs] = useState([]);
  const user = JSON.parse(localStorage.getItem('profile'));

  const fetchLogs = async () => {
    const res = await API.get('/attendance');
    setLogs(res.data.filter(l => l.userId === user.id));
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleClockIn = async () => {
    await API.post('/attendance', { 
        userId: user.id, 
        name: user.name, 
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    });
    alert("Clocked In!");
    fetchLogs(); // Updates UI automatically
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Attendance Log</h1>
      <button onClick={handleClockIn} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold mb-8">CLOCK IN NOW</button>
      <div className="bg-white p-4 rounded-xl shadow">
        {logs.map(log => (
          <div key={log.id} className="border-b p-2 flex justify-between">
            <span>{log.date}</span>
            <span className="font-bold">{log.time}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}