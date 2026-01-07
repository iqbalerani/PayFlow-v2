
import React from 'react';
import { Invoice, MilestoneStatus } from '../types';

interface PaymentsViewProps {
  invoices: Invoice[];
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ invoices }) => {
  const inEscrow = invoices.reduce((acc, inv) => {
    return acc + inv.milestones
      .filter(m => m.status === MilestoneStatus.PAID)
      .reduce((sum, m) => sum + m.amount, 0);
  }, 0);

  const totalReleased = invoices.reduce((acc, inv) => {
    return acc + inv.milestones
      .filter(m => m.status === MilestoneStatus.RELEASED)
      .reduce((sum, m) => sum + m.amount, 0);
  }, 0);

  const transactions = invoices.flatMap(inv => 
    inv.milestones
      .filter(m => m.status !== MilestoneStatus.PENDING)
      .map(m => ({
        id: m.id,
        invoiceId: inv.id,
        title: `${inv.title} - ${m.title}`,
        client: inv.client_name,
        amount: m.amount,
        status: m.status,
        date: m.released_at || m.paid_at || inv.created_at
      }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">💰 Payments & Escrow</h2>
        <button className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-700 transition-colors">
          <i className="fa-solid fa-file-export"></i> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="relative z-10">
            <p className="text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.2em]">Locked in Escrow</p>
            <h3 className="text-4xl font-black tracking-tight">{inEscrow.toLocaleString()} <span className="text-lg font-bold text-slate-600">MNEE</span></h3>
            <div className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full w-fit">
              <i className="fa-solid fa-shield-halved text-blue-500 text-[10px]"></i>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secured Protocol</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[100px] -mr-16 -mt-16"></div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <p className="text-slate-400 text-[10px] font-black mb-2 uppercase tracking-[0.2em]">Total Released</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">{totalReleased.toLocaleString()} <span className="text-lg font-bold text-slate-200">MNEE</span></h3>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-10 overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000" 
              style={{ width: `${(totalReleased / (totalReleased + inEscrow || 1)) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest">
            Settlement Progress: {Math.round((totalReleased / (totalReleased + inEscrow || 1)) * 100)}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 tracking-tight">Transaction History</h3>
          
          {/* Modernized Dropdown Component */}
          <div className="relative group">
            <select className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-6 py-2.5 pr-12 text-xs font-black text-slate-900 uppercase tracking-widest outline-none cursor-pointer transition-all shadow-sm active:scale-95">
              <option>All Assets</option>
              <option>MNEE (Stable)</option>
              <option>USDC (Stable)</option>
              <option>WETH</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] flex flex-col gap-0.5 text-slate-400">
              <i className="fa-solid fa-chevron-up"></i>
              <i className="fa-solid fa-chevron-down text-slate-900"></i>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Transaction</th>
                <th className="px-8 py-5">Client</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-default">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{tx.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-tighter mt-1">{tx.invoiceId}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-black">
                        {tx.client.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-600 font-bold">{tx.client}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      tx.status === MilestoneStatus.RELEASED 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-right">
                    <span className="font-black text-slate-900">+{tx.amount}</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-1 tracking-tighter">MNEE</span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <i className="fa-solid fa-receipt text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">No transaction history found</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Start by creating your first invoice.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsView;
