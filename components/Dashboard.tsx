
import React from 'react';
import { Invoice, InvoiceStatus, AppView } from '../types';

interface DashboardProps {
  invoices: Invoice[];
  onNavigate: (view: AppView, id?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, onNavigate }) => {
  const totalEarned = invoices
    .filter(i => i.status === InvoiceStatus.COMPLETED)
    .reduce((sum, i) => sum + i.total_amount, 0);
    
  const pendingInvoices = invoices.filter(i => i.status === InvoiceStatus.PENDING).length;
  
  const inEscrow = invoices.reduce((sum, inv) => {
    return sum + inv.milestones
      .filter(m => m.status === 'paid')
      .reduce((mSum, m) => mSum + m.amount, 0);
  }, 0);

  const stats = [
    { label: 'Total Revenue', value: `${totalEarned.toLocaleString()}`, currency: 'MNEE', sub: '↑ 12% vs last month', icon: 'fa-money-bill-trend-up', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Escrow', value: `${inEscrow.toLocaleString()}`, currency: 'MNEE', sub: 'Secured in contracts', icon: 'fa-vault', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending', value: pendingInvoices.toString(), currency: 'INVOICES', sub: 'Awaiting signature', icon: 'fa-clock-rotate-left', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completion', value: '98', currency: '% RATE', sub: 'Top 1% freelancer', icon: 'fa-award', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Dynamic Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor your performance and active escrow streams.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <i className="fa-solid fa-calendar"></i> Last 30 Days
          </button>
          <button 
            onClick={() => onNavigate('create')}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{stat.currency}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-3 flex items-center gap-1.5">
              <span className={stat.sub.includes('↑') ? 'text-emerald-500' : ''}>{stat.sub}</span>
            </p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* AI Hero Section */}
          <div className="relative bg-slate-900 rounded-[40px] p-10 text-white overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="relative z-10 grid md:grid-cols-2 items-center gap-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  Gemini-Powered Intelligence
                </div>
                <h2 className="text-4xl font-black tracking-tight leading-none italic">
                  Generate Invoices <br/>in Seconds.
                </h2>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">
                  Describe your scope of work and let PayFlow AI structure the milestones, amounts, and protection terms for you.
                </p>
                <button 
                  onClick={() => onNavigate('create')}
                  className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 flex items-center gap-3"
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Open AI Generator
                </button>
              </div>
              <div className="hidden md:flex justify-center relative">
                <div className="w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-40 animate-pulse absolute"></div>
                <div className="w-40 h-40 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl flex items-center justify-center text-5xl relative z-10 shadow-2xl rotate-12 transition-transform hover:rotate-0 duration-700">
                  <i className="fa-solid fa-bolt-lightning text-blue-500"></i>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-lg shadow-xl shadow-emerald-500/20 -rotate-12">
                  <i className="fa-solid fa-check"></i>
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mb-32"></div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Payment Streams</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time status of your last 4 projects</p>
              </div>
              <button 
                onClick={() => onNavigate('invoices')}
                className="px-4 py-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-50 rounded-xl transition-colors"
              >
                Full List <i className="fa-solid fa-arrow-right ml-1"></i>
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {invoices.slice(0, 4).map((inv) => (
                <div 
                  key={inv.id} 
                  className="px-10 py-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-slate-50/50 cursor-pointer transition-colors group"
                  onClick={() => onNavigate('details', inv.id)}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm ${
                    inv.status === InvoiceStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' :
                    inv.status === InvoiceStatus.ACTIVE ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <i className={`fa-solid ${
                      inv.status === InvoiceStatus.COMPLETED ? 'fa-circle-check' :
                      inv.status === InvoiceStatus.ACTIVE ? 'fa-vault' : 'fa-file-signature'
                    }`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">{inv.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>{inv.client_name}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span>{inv.total_amount} {inv.currency}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Status</p>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${
                        inv.status === InvoiceStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === InvoiceStatus.ACTIVE ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights area */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Quick Actions</h3>
            <div className="space-y-4 relative z-10">
              {[
                { label: 'New Invoice', icon: 'fa-plus', action: () => onNavigate('create') },
                { label: 'Export Data', icon: 'fa-file-export', action: () => {} },
                { label: 'Link Wallet', icon: 'fa-link', action: () => onNavigate('settings') },
                { label: 'Support', icon: 'fa-headset', action: () => {} }
              ].map((act, i) => (
                <button 
                  key={i}
                  onClick={act.action}
                  className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-[24px] border border-slate-100 transition-all group/btn"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-white group-hover/btn:bg-white/10 flex items-center justify-center text-slate-400 transition-colors shadow-sm">
                      <i className={`fa-solid ${act.icon} text-sm`}></i>
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest">{act.label}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] opacity-30 group-hover/btn:opacity-100"></i>
                </button>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px] -mr-16 -mt-16"></div>
          </div>

          {/* AI Advisor Box */}
          <div className="bg-blue-50 rounded-[40px] border border-blue-100 p-10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">AI Escrow Tip</h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                "We noticed your average project size has increased. To minimize risk, we suggest enabling <strong>'Staged Escrow'</strong> which requires deposits for each phase individually."
              </p>
              <button className="mt-8 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] hover:underline">
                Update Settings →
              </button>
            </div>
            <i className="fa-solid fa-wand-sparkles absolute bottom-4 right-4 text-blue-100 text-7xl rotate-12"></i>
          </div>

          {/* Network Health */}
          <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Protocol Integrity</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-700">Arbitrum L2</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">99.9% Uptime</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-700">MNEE Liquidity</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">$24.1M Pool</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
