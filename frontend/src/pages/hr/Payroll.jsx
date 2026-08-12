import React from 'react';
import Layout from '../../components/layout/Navbar';
import { DollarSign, Download, CheckCircle, Search, UserCheck } from 'lucide-react';

const HRPayroll = () => {
  const payrollData = [
    { id: 1, name: 'John Doe', role: 'Software Engineer', salary: '₹85,000', status: 'Processed' },
    { id: 2, name: 'Jane Smith', role: 'UI/UX Designer', salary: '₹70,000', status: 'Pending' },
    { id: 3, name: 'Robert Fox', role: 'Project Manager', salary: '₹95,000', status: 'Processed' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Payroll Management</h1>
        <p className="text-slate-500">Calculate salaries and process monthly payments for the team.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <DollarSign size={24} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Monthly Payout</p>
          <p className="text-2xl font-black text-slate-800">₹2,50,000</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <UserCheck size={24} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Processed Employees</p>
          <p className="text-2xl font-black text-slate-800">22 / 24</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
            Process All Payroll
          </button>
        </div>
      </div>

      {/* Employee Payroll Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center bg-slate-50/50">
          <Search size={18} className="text-slate-400 mr-2" />
          <input type="text" placeholder="Search employee..." className="bg-transparent outline-none text-sm w-full font-medium" />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Employee</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Net Salary</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payrollData.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-700">{emp.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{emp.role}</p>
                </td>
                <td className="px-6 py-4 font-black text-slate-700 text-sm">{emp.salary}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    emp.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {emp.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-tighter flex items-center ml-auto">
                    <Download size={14} className="mr-1" /> Generate Slip
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

export default HRPayroll;