import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  PawPrint, 
  DoorOpen, 
  CreditCard, 
  FileText, 
  CloudSun,
  Bot,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Staff', path: '/staff', icon: <Users size={20} /> },
    { name: 'Animals', path: '/animals', icon: <PawPrint size={20} /> },
    { name: 'Payments', path: '/payments', icon: <CreditCard size={20} /> },
    { name: 'Documents', path: '/documents', icon: <FileText size={20} /> },
    { name: 'AI Assistant', path: '/chatbot', icon: <Bot size={20} /> },
    { name: 'Weather', path: '/weather', icon: <CloudSun size={20} /> },
  ];

  return (
    <aside className="w-64 bg-primary text-white min-h-screen flex flex-col sticky top-0 h-screen">
      <div className="p-8 text-2xl font-black flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg shadow-black/20">
            <PawPrint size={24} />
        </div>
        ZooAdmin
      </div>
      <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-white text-primary shadow-xl shadow-black/20 scale-105' 
                : 'text-green-100 hover:bg-white/10 hover:translate-x-2'
              }`
            }
          >
            <div className={({ isActive }) => `transition-transform group-hover:scale-110`}>{item.icon}</div>
            <span className="font-bold tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-6">
        <button 
            onClick={() => { localStorage.clear(); window.location.href='/login'; }}
            className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-2xl transition-all duration-300 font-bold border border-red-500/30"
        >
            <LogOut size={20} />
            Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
