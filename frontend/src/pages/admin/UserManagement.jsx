import React from 'react';
import Layout from '../../components/layout/Navbar';
import { UserCog, Search } from 'lucide-react';

const UserManagement = () => {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@neuzen.ai', role: 'Admin' },
    { id: 2, name: 'Sarah Miller', email: 'sarah.hr@neuzen.ai', role: 'HR' },
    { id: 3, name: 'John Employee', email: 'john@neuzen.ai', role: 'Employee' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500">Manage system access and assign user roles.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
          + Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center">
          <Search size={18} className="text-slate-400 mr-2" />
          <input type="text" placeholder="Search by name or email..." className="outline-none text-sm w-full" />
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">User Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Current Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-700">{u.name}</td>
                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                <td className="px-6 py-4">
                  <select className="bg-slate-100 border-none rounded-lg text-xs font-bold p-1 outline-none">
                    <option selected={u.role === 'Admin'}>Admin</option>
                    <option selected={u.role === 'HR'}>HR</option>
                    <option selected={u.role === 'Employee'}>Employee</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-bold text-sm hover:underline">Update Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UserManagement;