
import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceStatus, MilestoneStatus } from '../types';
import { generateClientMessage } from '../services/geminiService';

interface InvoiceDetailsProps {
  invoice?: Invoice;
  onBack: () => void;
  onUpdateMilestone: (invoiceId: string, milestoneId: string, status: MilestoneStatus) => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onBack, onUpdateMilestone }) => {
  const [aiMessage, setAiMessage] = useState<string>('');
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [requestSent, setRequestSent] = useState<string | null>(null);

  useEffect(() => {
    if (invoice && !aiMessage) {
      setLoadingMsg(true);
      generateClientMessage(invoice).then(msg => {
        setAiMessage(msg);
        setLoadingMsg(false);
      });
    }
  }, [invoice]);

  if (!invoice) return null;

  const handleRequestApproval = (msId: string) => {
    setRequestSent(msId);
    // Simulate API call to send notification
    setTimeout(() => setRequestSent(null), 3000);
  };

  const releasedAmount = invoice.milestones
    .filter(m => m.status === MilestoneStatus.RELEASED)
    .reduce((sum, m) => sum + m.amount, 0);
  
  const inEscrowAmount = invoice.milestones
    .filter(m => m.status === MilestoneStatus.PAID)
    .reduce((sum, m) => sum + m.amount, 0);

  const getPublicLink = () => `${window.location.origin}/#pay/${invoice.id}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors group">
          <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i> 
          Back to Invoices
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 shadow-sm flex items-center gap-2">
            <i className="fa-solid fa-download"></i> PDF Export
          </button>
          <button onClick={() => copyToClipboard(getPublicLink())} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 flex items-center gap-2">
            <i className="fa-solid fa-link"></i> Copy Client Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-slate-400 uppercase tracking-tighter">{invoice.id}</span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                    invoice.status === InvoiceStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                    invoice.status === InvoiceStatus.ACTIVE ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{invoice.title}</h1>
                <p className="text-slate-500 mt-2 flex items-center gap-2 font-medium">
                  <i className="fa-solid fa-calendar-day text-slate-300"></i>
                  Created on {new Date(invoice.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="text-left md:text-right bg-slate-50 md:bg-transparent p-6 md:p-0 rounded-3xl border border-slate-100 md:border-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Value</p>
                <p className="text-4xl font-black text-slate-900">{invoice.total_amount} <span className="text-sm font-bold text-slate-400">{invoice.currency}</span></p>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Client Details</h4>
                  <div>
                    <p className="font-black text-slate-900 text-xl">{invoice.client_name}</p>
                    <p className="text-slate-500 text-sm mt-1">{invoice.client_email || 'No email provided'}</p>
                    <div className="flex items-center gap-2 mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <i className="fa-solid fa-wallet text-slate-300 text-xs"></i>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{invoice.client_wallet || 'Waiting for client connection...'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Service Type</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
                      {invoice.category}
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-bold border border-slate-200">
                      Escrow-Protected
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4 mb-6">📊 Milestone Roadmap</h4>
                <div className="space-y-4">
                  {invoice.milestones.map((ms, idx) => (
                    <div key={ms.id} className={`p-6 rounded-3xl border transition-all hover:shadow-md ${
                      ms.status === MilestoneStatus.RELEASED ? 'bg-green-50/30 border-green-100' : 
                      ms.status === MilestoneStatus.PAID ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-slate-100'
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-5">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                            ms.status === MilestoneStatus.RELEASED ? 'bg-green-500 text-white' : 
                            ms.status === MilestoneStatus.PAID ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {ms.status === MilestoneStatus.RELEASED ? <i className="fa-solid fa-check"></i> : idx + 1}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg leading-tight">{ms.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${
                                ms.status === MilestoneStatus.RELEASED ? 'text-green-600' : 
                                ms.status === MilestoneStatus.PAID ? 'text-blue-600' : 'text-slate-400'
                              }`}>
                                {ms.status === MilestoneStatus.RELEASED ? `Released on ${new Date(ms.released_at!).toLocaleDateString()}` :
                                 ms.status === MilestoneStatus.PAID ? 'Locked in Escrow' : 'Awaiting Payment'}
                              </span>
                            </div>
                            {ms.description && <p className="text-xs text-slate-400 mt-2 font-medium">{ms.description}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 min-w-[120px]">
                          <p className="font-black text-slate-900 text-xl">{ms.amount} <span className="text-xs text-slate-400">{invoice.currency}</span></p>
                          
                          {ms.status === MilestoneStatus.PAID && (
                            <button 
                              disabled={!!requestSent}
                              onClick={() => handleRequestApproval(ms.id)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest shadow-xl transition-all uppercase active:scale-95 ${
                                requestSent === ms.id 
                                  ? 'bg-green-500 text-white border-green-400' 
                                  : 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800 shadow-slate-900/10'
                              }`}
                            >
                              {requestSent === ms.id ? 'Request Sent' : 'Request Release'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">💰 Financial Health</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Released</span>
                <span className="font-black text-2xl text-green-400">{releasedAmount} {invoice.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">In Escrow</span>
                <span className="font-black text-2xl text-blue-400">{inEscrowAmount} {invoice.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Pending</span>
                <span className="font-black text-2xl text-slate-500">{invoice.total_amount - releasedAmount - inEscrowAmount} {invoice.currency}</span>
              </div>
              
              <div className="pt-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Overall Progress</span>
                  <span className="text-xs font-black text-blue-400">{Math.round((releasedAmount / (invoice.total_amount || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${(releasedAmount / (invoice.total_amount || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-paper-plane"></i>
              </div>
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Client Portal</h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Secure Payment Link</label>
                <div className="flex items-center gap-2 group">
                  <input 
                    readOnly 
                    value={getPublicLink()} 
                    className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-mono text-slate-500 outline-none focus:bg-white focus:border-blue-400 transition-all"
                  />
                  <button 
                    onClick={() => copyToClipboard(getPublicLink())}
                    className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">AI Smart Message</label>
                  <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded tracking-tighter">GEN AI</span>
                </div>
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[32px] relative transition-all hover:bg-blue-50">
                  {loadingMsg ? (
                    <div className="flex items-center justify-center py-12 text-blue-400"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>
                  ) : (
                    <>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium italic pr-6">{aiMessage}</p>
                      <button 
                        onClick={() => copyToClipboard(aiMessage)}
                        className="absolute top-4 right-4 text-blue-300 hover:text-blue-600 transition-colors"
                      >
                        <i className="fa-solid fa-copy"></i>
                      </button>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => window.open(`mailto:${invoice.client_email || ''}?subject=Invoice: ${invoice.title}&body=${encodeURIComponent(aiMessage)}`)}
                  className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-envelope"></i> Send via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
