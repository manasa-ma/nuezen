import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Navbar';
import API from '../../api/axios';
import { UserCog, Trash2, ShieldCheck, Mail, User } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // 🌟 FIX: Shift endpoint to query your live MongoDB user collection endpoint
      const res = await API.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) { 
      console.error("Error loading users:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      // 🌟 FIX: Updated route string parameters to match backend configurations
      await API.patch(`/api/admin/users/${id}/role`, { role: newRole });
      alert("System access level updated.");
      fetchUsers();
    } catch (err) { 
      alert("Failed to update role."); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will remove the employee's full system access.")) {
      try {
        // 🌟 FIX: Updated route string parameters to match backend configurations
        await API.delete(`/api/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Employee Management</h1>
          <p className="text-slate-500 font-medium">Assign roles, manage access, and oversee personnel.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">System Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="3" className="p-10 text-center text-slate-400 animate-pulse font-bold">Loading system profiles...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="3" className="p-10 text-center text-slate-400 italic">No users found in database.</td></tr>
              ) : (
                users.map((u) => (
                  // 🌟 FIX: Changed map key identifier assignment from u.id to u._id for MongoDB 
                  <tr key={u._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                          {u.name ? u.name.substring(0, 2) : '??'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.name || "Unknown User"}</p>
                          <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <select 
                        value={u.role}
                        // 🌟 FIX: Updated event target identifier reference from u.id to u._id
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-white border border-slate-200 text-slate-700 text-xs font-black p-2 rounded-xl outline-none focus:ring-2 ring-blue-500 transition"
                      >
                        <option value="Admin">ADMIN</option>
                        <option value="HR">HR MANAGER</option>
                        <option value="Employee">EMPLOYEE</option>
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        // 🌟 FIX: Updated deletion query execution identifier reference from u.id to u._id
                        onClick={() => handleDelete(u._id)}
                        className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
