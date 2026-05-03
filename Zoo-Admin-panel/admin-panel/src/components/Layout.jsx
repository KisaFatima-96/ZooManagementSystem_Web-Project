import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Zoo Management System</h1>
          <div className="flex items-center gap-4">
            <span className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-primary border border-gray-100">
              Admin Panel
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
