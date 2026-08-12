import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { Check, X, Clock, User, Search, AlertCircle } from 'lucide-react';

export default function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await API.get('/hr/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleAction = async (id, status) => {
    try {
      await API.patch(`/hr/leaves/${id}`, { status });
      alert(`Request has been ${status}`);
      fetchLeaves(); // Refresh the list automatically
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredLeaves = filter === 'All' 
    ? leaves 
    : leaves.filter(l => l.status === filter);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Leave Approvals</h1>
            <p className="text-slate-500 font-medium">Review and manage employee time-off requests.</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* DATA STATE HANDLING */}
        {loading ? (
          <div className="p-20 text-center text-slate-400 animate-pulse font-bold">Loading requests...</div>
        ) : filteredLeaves.length === 0 ? (
          <div className="bg-white p-20 rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
            <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest">No {filter !== 'All' ? filter : ''} requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredLeaves.map((leave) => (
              <div key={leave.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{leave.userName}</h3>
                    <p className="text-slate-400 text-sm font-medium">Type: {leave.type || 'General Leave'}</p>
                  </div>
                </div>

                <div className="my-4 md:my-0 flex-1 md:px-10">
                  <p className="text-slate-600 italic text-sm">"{leave.reason}"</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                    leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                    leave.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {leave.status === 'Pending' && <Clock size={10} />}
                    {leave.status}
                  </span>

                  {/* Actions (Only show if Pending) */}
                  {leave.status === 'Pending' && (
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => handleAction(leave.id, 'Approved')}
                        className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => handleAction(leave.id, 'Rejected')}
                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}