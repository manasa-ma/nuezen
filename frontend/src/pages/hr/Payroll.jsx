import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { Banknote, Download, CheckCircle, Search, CreditCard, Receipt, TrendingUp } from 'lucide-react';

export default function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get('/hr/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error("Payroll fetch error");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handlePay = (name) => {
    alert(`💸 Payment of salary successfully initiated for ${name}. Digital payslip generated.`);
  };

  const totalMonthlyExp = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Payroll Management</h1>
          <p className="text-slate-500 font-medium mt-1">Review, calculate, and disburse monthly employee compensations.</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
             <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-white/5" size={120} />
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Monthly Payout</p>
             <h2 className="text-4xl font-black text-blue-400">₹{totalMonthlyExp.toLocaleString()}</h2>
             <p className="text-xs text-slate-500 mt-4 font-bold">Projected for {new Date().toLocaleString('default', { month: 'long' })} 2025</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Active Payrolls</p>
              <h2 className="text-3xl font-black text-slate-800">{employees.length} Employees</h2>
            </div>
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Banknote size={28} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Tax Deductions</p>
              <h2 className="text-3xl font-black text-slate-800">10% Applied</h2>
            </div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Receipt size={28} />
            </div>
          </div>
        </div>

        {/* PAYROLL LIST */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-slate-800">Disbursement Queue</h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-500 transition font-medium"
                placeholder="Search by employee name..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Salary</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Pay (Est.)</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xs">
                          {emp.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{emp.name}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-slate-600">₹{emp.salary?.toLocaleString()}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-slate-800">₹{(emp.salary * 0.9).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-medium">After 10% TDS</p>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handlePay(emp.name)}
                          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                        >
                          <CreditCard size={14} className="mr-2" /> Pay Now
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEmployees.length === 0 && (
             <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest italic">
               No employees found in payroll records.
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}