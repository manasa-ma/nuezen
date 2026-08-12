import React, { useState } from 'react';
import Layout from '../../components/layout/Navbar';
import { UserPlus, Send, Eye, FileText } from 'lucide-react';

const Onboarding = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', salary: '' });

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Onboarding Portal</h1>
          <p className="text-slate-500">Trigger candidate onboarding and generate offer letters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <UserPlus className="mr-2 text-blue-600" size={20}/> Candidate Details
          </h2>
          <form className="space-y-4">
            <input 
              type="text" placeholder="Full Name" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="">Select Role</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Product Manager">Product Manager</option>
            </select>
            <input 
              type="number" placeholder="Monthly Salary (₹)" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
            />
            <div className="flex space-x-3 pt-4">
              <button 
                type="button" onClick={() => setShowPreview(true)}
                className="flex-1 flex items-center justify-center py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
              >
                <Eye size={18} className="mr-2" /> Preview Letter
              </button>
              <button 
                type="button" 
                className="flex-1 flex items-center justify-center py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
              >
                <Send size={18} className="mr-2" /> Send Offer
              </button>
            </div>
          </form>
        </div>

        {/* Digital Letter Preview */}
        {showPreview ? (
          <div className="bg-white p-10 rounded-2xl shadow-inner border-2 border-blue-50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileText size={120} />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-black text-blue-600 italic mb-10">NEUZEN AI</h3>
               <p className="text-sm text-slate-500 mb-6 font-bold uppercase tracking-widest">Letter of Intent</p>
               <p className="text-slate-700 mb-4 font-medium">Dear <span className="text-blue-600 font-bold">{formData.name || "[Candidate Name]"}</span>,</p>
               <p className="text-slate-600 text-sm leading-relaxed mb-6">
                 We are pleased to offer you the position of <span className="font-bold text-slate-800">{formData.role || "[Role]"}</span> at NEUZEN AI. 
                 Your monthly gross salary will be <span className="font-bold text-slate-800">₹{formData.salary || "0"}</span>.
               </p>
               <div className="pt-10 border-t border-slate-100">
                 <p className="text-xs font-bold text-slate-400">Authorized Signatory</p>
                 <p className="text-sm font-black text-slate-800">Human Resources Team</p>
               </div>
             </div>
          </div>
        ) : (
          <div className="flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
            <p className="text-slate-400 text-sm font-bold">Enter details to generate preview</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Onboarding;