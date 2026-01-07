
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
    { label: 'Total Earned', value: `${totalEarned.toLocaleString()} MNEE`, sub: '↑ 12% from last month', icon: 'fa-money-bill-trend-up', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Invoices', value: pendingInvoices.toString(), sub: 'Awaiting client response', icon: 'fa-clock-rotate-left', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'In Escrow', value: `${inEscrow.toLocaleString()} MNEE`, sub: 'Funds locked in contracts', icon: 'fa-vault', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: invoices.filter(i => i.status === InvoiceStatus.COMPLETED).length.toString(), sub: 'This month', icon: 'fa-circle-check', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-4`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            <p className="text-xs text-slate-400 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Create New Invoice</h3>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">AI POWERED</span>
            </div>
            <div 
              onClick={() => onNavigate('create')}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 p-8 transition-all hover:bg-blue-50/30"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-magic"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">AI Invoice Generator</h4>
                  <p className="text-slate-500 max-w-sm mt-1">Describe your work in plain English and let AI handle the structure, milestones, and payment terms.</p>
                </div>
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 group-hover:bg-blue-600 transition-colors">
                  Generate with AI
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
              <button onClick={() => onNavigate('invoices')} className="text-sm font-bold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {invoices.slice(0, 4).map((inv) => (
                <div 
                  key={inv.id} 
                  className="p-6 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onNavigate('details', inv.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                    inv.status === InvoiceStatus.COMPLETED ? 'bg-green-500' :
                    inv.status === InvoiceStatus.ACTIVE ? 'bg-blue-500' : 'bg-amber-500'
                  }`}>
                    <i className={`fa-solid ${
                      inv.status === InvoiceStatus.COMPLETED ? 'fa-check' :
                      inv.status === InvoiceStatus.ACTIVE ? 'fa-vault' : 'fa-file-signature'
                    }`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{inv.title}</h4>
                    <p className="text-sm text-slate-500">{inv.client_name} • {inv.total_amount} {inv.currency}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold uppercase text-slate-400">{new Date(inv.created_at).toLocaleDateString()}</p>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      inv.status === InvoiceStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                      inv.status === InvoiceStatus.ACTIVE ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">⚡ Quick Actions</h3>
              <p className="text-slate-400 text-sm mb-6">Common tasks at your fingertips</p>
              <div className="space-y-3">
                <button onClick={() => onNavigate('create')} className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-left group">
                  <span className="font-bold text-sm">New Invoice</span>
                  <i className="fa-solid fa-plus-circle group-hover:rotate-90 transition-transform"></i>
                </button>
                <button onClick={() => onNavigate('invoices')} className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-left">
                  <span className="font-bold text-sm">View All Invoices</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-left">
                  <span className="font-bold text-sm">Escrow Wallet Settings</span>
                  <i className="fa-solid fa-cog"></i>
                </button>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] -mr-16 -mt-16 opacity-30"></div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Milestone Suggestions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "For software projects over 2,000 MNEE, we recommend a 20% / 30% / 50% split for better escrow protection."
                </p>
              </div>
              <button className="w-full py-2 text-blue-600 font-bold text-sm hover:underline">Learn more about Escrow best practices</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
