
import React from 'react';

interface HeaderProps {
  walletAddress: string | null;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ walletAddress, onDisconnect }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10">
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <i className="fa-solid fa-bolt text-white text-xs"></i>
        </div>
        <span className="font-bold">PayFlow</span>
      </div>
      
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold text-slate-800">
          {new Date().getHours() < 12 ? 'Good morning' : 'Welcome back'}, Freelancer! 👋
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
          <i className="fa-solid fa-bell"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-mono text-slate-700">
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          </span>
          <button 
            onClick={onDisconnect} 
            className="flex items-center gap-1.5 pl-2 ml-2 border-l border-slate-200 text-xs text-slate-400 hover:text-red-500 transition-colors font-bold uppercase tracking-tighter"
            title="Logout"
          >
            <i className="fa-solid fa-power-off"></i>
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
