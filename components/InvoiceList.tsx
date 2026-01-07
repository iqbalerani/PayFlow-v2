
import React, { useState } from 'react';
import { Invoice, InvoiceStatus, AppView } from '../types';

interface InvoiceListProps {
  invoices: Invoice[];
  onNavigate: (view: AppView, id?: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onNavigate }) => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = invoices.filter(inv => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case InvoiceStatus.ACTIVE: return 'bg-blue-100 text-blue-700';
      case InvoiceStatus.PENDING: return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">My Invoices</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Manage and track your active payment streams.</p>
        </div>
        <button 
          onClick={() => onNavigate('create')} 
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <i className="fa-solid fa-plus-circle text-lg"></i> Create New
        </button>
      </div>

      <div className="bg-slate-100/50 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200/50 w-fit">
        {['all', 'pending', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.length > 0 ? (
          filtered.map((inv) => (
            <div 
              key={inv.id} 
              onClick={() => onNavigate('details', inv.id)}
              className="bg-white p-8 rounded-[32px] border border-slate-200 hover:border-blue-300 transition-all hover:shadow-2xl hover:shadow-blue-500/5 cursor-pointer group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[10px] font-black text-slate-300 uppercase tracking-widest">{inv.id}</span>
                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{inv.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><i className="fa-solid fa-user-tie text-slate-200"></i> {inv.client_name}</div>
                    <div className="flex items-center gap-2"><i className="fa-solid fa-layer-group text-slate-200"></i> {inv.milestones.length} Milestones</div>
                    <div className="flex items-center gap-2"><i className="fa-solid fa-calendar-check text-slate-200"></i> {new Date(inv.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:flex-col md:items-end gap-4 md:pl-10 md:border-l border-slate-100">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                    <p className="text-4xl font-black text-slate-900">{inv.total_amount} <span className="text-sm font-bold text-slate-300">MNEE</span></p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 flex items-center justify-center transition-all">
                      <i className="fa-solid fa-link"></i>
                    </button>
                    <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 flex items-center justify-center transition-all">
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl text-slate-200 mb-8 shadow-sm">
              <i className="fa-solid fa-file-invoice"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No invoices found</h3>
            <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto">Try changing your filters or use our AI generator to start a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
