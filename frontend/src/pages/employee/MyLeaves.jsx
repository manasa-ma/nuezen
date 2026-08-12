import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [reason, setReason] = useState('');
  const user = JSON.parse(localStorage.getItem('profile'));

  const fetchLeaves = async () => {
    const res = await API.get('/leaves');
    setLeaves(res.data.filter(l => l.userId === user.id));
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleSubmit = async () => {
    await API.post('/leaves', { userId: user.id, name: user.name, reason, type: 'Annual' });
    alert("Submitted!");
    setReason('');
    fetchLeaves(); // Updates UI automatically
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Request Leave</h1>
      <input value={reason} onChange={e => setReason(e.target.value)} className="border p-2 w-full mb-2" placeholder="Reason..." />
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded mb-6">Submit</button>
      <div className="bg-white p-4 rounded shadow">
        {leaves.map(l => (
          <div key={l.id} className="border-b p-2 flex justify-between">
            <span>{l.reason}</span>
            <span className="font-bold text-orange-600">{l.status}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}