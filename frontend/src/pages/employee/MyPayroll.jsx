import React from 'react';
import Layout from '../../components/layout/Navbar';
import { Download, FileText, IndianRupee } from 'lucide-react';

const MyPayroll = () => {
  const payslips = [
    { month: 'July 2025', amount: '₹75,000', date: '01-08-2025', status: 'Paid' },
    { month: 'June 2025', amount: '₹75,000', date: '01-07-2025', status: 'Paid' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Payroll</h1>
        <p className="text-slate-500">View and download your monthly salary slips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <IndianRupee size={24} />
          </div>
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Annual CTC</h3>
          <p className="text-3xl font-black text-slate-800">₹9,00,000</p>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Monthly Gross</span>
              <span className="font-bold">₹75,000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Month</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Amount Paid</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payslips.map((slip, i) => (
              <tr key={i} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-bold text-slate-700">{slip.month}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{slip.amount}</td>
                <td className="px-6 py-4">
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{slip.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center ml-auto font-bold text-sm">
                    <Download size={16} className="mr-1" /> PDF
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

export default MyPayroll;