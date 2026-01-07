
import React from 'react';

interface SettingsViewProps {
  walletAddress: string | null;
}

const SettingsView: React.FC<SettingsViewProps> = ({ walletAddress }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900">⚙️ Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-bold text-slate-900">Profile & Wallet</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Manage your public identity and connected blockchain wallet.</p>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-bold">
                {walletAddress ? walletAddress.slice(2, 4).toUpperCase() : '??'}
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Display Name</label>
                <input defaultValue="Freelancer" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Connected Wallet</label>
              <div className="flex items-center gap-2 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
                <i className="fa-solid fa-wallet text-slate-500"></i>
                <span className="font-mono text-xs flex-1">{walletAddress || 'No wallet connected'}</span>
                <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded uppercase font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-2 pt-8">
          <h3 className="font-bold text-slate-900">Escrow Configuration</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Default settings for your smart contract interactions.</p>
        </div>
        <div className="md:col-span-2 space-y-6 pt-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">Auto-Request Approval</p>
                <p className="text-xs text-slate-500">Automatically ping client when milestone date passes.</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-900 text-sm">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive updates on payment and escrow status.</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button className="px-10 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
