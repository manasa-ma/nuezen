import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import { Banknote, Download, FileText, IndianRupee, ShieldCheck } from 'lucide-react';

export default function MyPayroll() {
  const [user, setUser] = useState(null);

   useEffect(() => {
    // 🌟 FIX: Checks both 'user' and 'profile' keys so it never stays stuck loading
    const storedUser = localStorage.getItem('user') || localStorage.getItem('profile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  // 🌟 FIX: Shifted static summary lists to current 2026 deployment dates
  const payslips = [
    { month: 'July 2026', status: 'Paid' },
    { month: 'June 2026', status: 'Paid' },
  ];

  if (!user) return <Layout><div className="p-10 font-bold text-slate-400 animate-pulse">Loading Financial Data...</div></Layout>;

  const baseSalary = user.salary || 60000;
  const tax = baseSalary * 0.10;
  const netPay = baseSalary - tax;

  const downloadPayslip = (month) => {
    const content = `
================================================
           NEUZEN AI - OFFICIAL PAYSLIP         
================================================
Statement Period : ${month}
Employee Name    : ${user.name}
Employee Email   : ${user.email}
Employee Role    : ${user.role}
------------------------------------------------
EARNINGS (Monthly)
------------------------------------------------
Base Salary      : INR ${baseSalary.toLocaleString()}
------------------------------------------------
DEDUCTIONS
------------------------------------------------
TDS (10%)        : INR ${tax.toLocaleString()}
------------------------------------------------
TOTAL NET PAY    : INR ${netPay.toLocaleString()}
================================================
Status           : SUCCESS / PAID
Generated On     : ${new Date().toLocaleString()}

This is a system-generated digital document.
================================================
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payslip_${month.replace(' ', '_')}_${user.name.replace(' ', '_')}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Compensation</h1>
          <p className="text-slate-500 font-medium">View your salary breakdown and download digital payslips.</p>
        </div>

        {/* SALARY SUMMARY CARD */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl mb-10 relative overflow-hidden">
          <Banknote className="absolute right-[-20px] bottom-[-20px] text-white/5" size={200} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">
              <ShieldCheck size={16} /> Verified Secure Portal
            </div>
            <p className="text-slate-400 font-medium">Current Monthly Net Pay</p>
            <h2 className="text-5xl font-black mt-2 flex items-center">
              <IndianRupee size={40} className="mr-2" /> {netPay.toLocaleString()}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-10 pt-8 border-t border-white/10">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase">Base Salary</p>
                <p className="text-xl font-bold">₹{baseSalary.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase">TDS (10%)</p>
                <p className="text-xl font-bold text-red-400">- ₹{tax.toLocaleString()}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-slate-400 text-xs font-bold uppercase">Payment Mode</p>
                <p className="text-xl font-bold">Bank Transfer</p>
              </div>
            </div>
          </div>
        </div>

        {/* PAYSLIP TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center">
              <FileText size={18} className="mr-2 text-blue-600" /> Historical Payslips
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase">Month</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase">Net Amount</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payslips.map((slip, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="p-6">
                    <p className="font-bold text-slate-700">{slip.month}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase">{slip.status}</p>
                  </td>
                  <td className="p-6 font-black text-slate-800">
                    ₹{netPay.toLocaleString()}
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => downloadPayslip(slip.month)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition border border-transparent hover:border-blue-100"
                    >
                      <Download size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
