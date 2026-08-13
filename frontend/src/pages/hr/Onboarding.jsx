import React, { useState } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { Send, FileText, UserPlus, Mail, IndianRupee } from 'lucide-react';

export default function Onboarding() {
  const [form, setForm] = useState({ name: '', email: '', salary: '', role: 'Software Engineer' });
  const [loading, setLoading] = useState(false);

  const handleOnboard = async (e) => {
    e.preventDefault();
    
    // 1. Frontend Validation
    if(!form.name || !form.email || !form.salary) {
        return alert("Please fill in all fields (Name, Email, and Salary).");
    }

    setLoading(true);
    try {
      // 2. API Call (FIXED: Route changed from '/hr/onboard' to match your backend model endpoint)
      await API.post('/api/admin/users', form);
      
      alert(`✅ Success! Digital Offer Letter sent to ${form.email}. They can now login with password: password123`);
      
      // 3. Reset form on success
      setForm({ name: '', email: '', salary: '', role: 'Software Engineer' });
    } catch (err) { 
      // 4. Catch specific error message from Backend
      const msg = err.response?.data?.message || "Onboarding Failed. Check if the server is running.";
      alert(msg); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* LEFT: INPUT FORM */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">New Onboarding</h1>
            <p className="text-slate-500 font-medium">Create employee profile and generate letter.</p>
          </div>

          <form onSubmit={handleOnboard} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-500 transition font-medium" 
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="email" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-500 transition font-medium" 
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@neuzen.ai" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Monthly Salary</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 text-slate-400" size={18} />
                <input required type="number" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-blue-500 transition font-medium" 
                  value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="75000" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center hover:bg-blue-600 transition shadow-xl disabled:opacity-50">
              <Send size={18} className="mr-2" /> {loading ? "RECORDING..." : "FINISH & SEND OFFER"}
            </button>
          </form>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="lg:w-2/3">
          <div className="bg-white p-12 rounded-[2rem] shadow-2xl border border-slate-100 min-h-[600px] relative overflow-hidden">
            <div className="absolute top-10 right-10 opacity-10 rotate-12 text-slate-300">
               <FileText size={150} />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-black text-blue-600 italic mb-10">NEUZEN AI</h2>
              <h3 className="text-4xl font-bold text-slate-800 mb-8 underline decoration-blue-500 underline-offset-8">Letter of Intent</h3>
              
              <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>To, <br/><span className="text-slate-900 font-bold text-xl">{form.name || "[Candidate Name]"}</span></p>
                
                <p>We are delighted to offer you a position at <b>NEUZEN AI</b>. Based on your profile, you have been selected for the role of <b>{form.role}</b>.</p>
                
                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-blue-500">
                  <p className="text-sm font-bold text-slate-400 mb-2 uppercase">Financial Package</p>
                  <p className="text-2xl font-black text-slate-800">₹{form.salary || "0"} <span className="text-sm font-medium text-slate-500">/ per month</span></p>
                </div>

                <p>Please review this document and confirm your acceptance by replying to the HR team.</p>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-400">Authorized Signatory</p>
                <p className="text-lg font-black text-slate-800">Head of Human Resources</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
