import React from 'react';
import Layout from '../../components/layout/Navbar';
import { Check, X, Calendar } from 'lucide-react';

const LeaveApprovals = () => {
  const requests = [
    { id: 1, name: 'Amit Sharma', type: 'Sick Leave', duration: '2 Days', dates: '14-15 Aug', reason: 'Flu symptoms' },
    { id: 2, name: 'Priya Verma', type: 'Annual Leave', duration: '5 Days', dates: '20-25 Aug', reason: 'Family vacation' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Leave Approvals</h1>
        <p className="text-slate-500">Review and respond to employee time-off requests.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Employee</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Leave Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Duration</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Reason</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-700">{req.name}</p>
                  <p className="text-[10px] text-blue-600 font-bold flex items-center">
                    <Calendar size={10} className="mr-1" /> {req.dates}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{req.type}</td>
                <td className="px-6 py-4 text-sm text-slate-500 font-bold">{req.duration}</td>
                <td className="px-6 py-4 text-xs text-slate-400 italic">"{req.reason}"</td>
                <td className="px-6 py-4 text-right flex justify-end space-x-2">
                  <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition shadow-sm border border-emerald-100">
                    <Check size={18} />
                  </button>
                  <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm border border-red-100">
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default LeaveApprovals;