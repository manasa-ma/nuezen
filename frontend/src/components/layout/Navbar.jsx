import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar hidden on mobile, visible on medium+ screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content: Adjust margin for mobile */}
      <div className="flex-1 md:ml-64 p-4 md:p-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;