import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, Calendar, ClipboardCheck, FileText, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const menuItems = {
    Admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20}/> },
      { name: 'Manage Users', path: '/admin/users', icon: <Users size={20}/> },
    ],
    HR: [
      { name: 'Dashboard', path: '/hr/dashboard', icon: <LayoutDashboard size={20}/> },
      { name: 'Onboarding', path: '/hr/onboarding', icon: <Users size={20}/> },
      { name: 'Leave Approvals', path: '/hr/leaves', icon: <Calendar size={20}/> },
      { name: 'Payroll', path: '/hr/payroll', icon: <FileText size={20}/> },
    ],
    Employee: [
      { name: 'My Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={20}/> },
      { name: 'Attendance', path: '/employee/attendance', icon: <ClipboardCheck size={20}/> },
      { name: 'My Leaves', path: '/employee/leaves', icon: <Calendar size={20}/> },
      { name: 'Pay Slips', path: '/employee/payroll', icon: <FileText size={20}/> },
      // Inside menuItems for all roles:
{ name: 'Calendar', path: '/employee/calendar', icon: <Calendar size={20}/> },
    ],
  };

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-400 tracking-wider">NEUZEN AI</h1>
        <p className="text-xs text-slate-400">HR Management System</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems[user?.role]?.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className="flex items-center p-3 hover:bg-slate-800 rounded-xl transition-all duration-200 group"
          >
            <span className="mr-3 text-slate-400 group-hover:text-blue-400 transition-colors">{item.icon}</span> 
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center mb-4 px-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold truncate w-32">{user?.name}</p>
            <p className="text-[10px] text-slate-400">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="w-full flex items-center p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium text-sm"
        >
          <LogOut size={18} className="mr-3" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;