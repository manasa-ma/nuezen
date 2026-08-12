import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { Search, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function HRAttendance() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllLogs = async () => {
    const res = await API.get('/hr/attendance');
    setLogs(res.data);
  };

  useEffect(() => { fetchAllLogs(); }, []);

  const filteredLogs = logs.filter(l => l.userName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Attendance Records</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time daily clock-in logs for all personnel.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-3 text-slate-400" size={18} />
           <input className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500" 
             placeholder="Search Employee..." onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Employee</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Punch Time</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Location</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLogs.length === 0 && (
              <tr><td colSpan="5" className="p-20 text-center text-slate-400 italic">No attendance records found for today.</td></tr>
            )}
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition">
                <td className="p-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                      {log.userName.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">{log.userName}</span>
                  </div>
                </td>
                <td className="p-6 text-slate-500 font-medium">{log.date}</td>
                <td className="p-6">
                  <div className="flex items-center text-blue-600 font-black">
                    <Clock size={14} className="mr-2" /> {log.time}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center text-slate-400 text-xs font-bold">
                    <MapPin size={12} className="mr-1" /> Remote / Office
                  </div>
                </td>
                <td className="p-6 text-right">
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center w-fit">
                    <CheckCircle size={10} className="mr-1" /> Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}