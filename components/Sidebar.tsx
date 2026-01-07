
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'invoices', label: 'My Invoices', icon: 'fa-file-invoice-dollar' },
    { id: 'payments', label: 'Payments', icon: 'fa-vault' },
    { id: 'create', label: 'Create New', icon: 'fa-plus-circle' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-bolt text-white"></i>
        </div>
        <span className="text-xl font-bold tracking-tight">PayFlow</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as AppView)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="px-4 py-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/10 transition-all group"
        >
          <i className="fa-solid fa-right-from-bracket w-5 text-center group-hover:text-red-400"></i>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Network Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-[11px] text-slate-300">Ethereum Mainnet</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
