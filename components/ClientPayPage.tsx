
import React, { useState } from 'react';
import { Invoice, Milestone, MilestoneStatus } from '../types';

interface ClientPayPageProps {
  invoice?: Invoice;
  walletConnected: boolean;
  onConnect: () => void;
  onPay: (milestoneId: string) => void;
  onApprove: (milestoneId: string) => void;
}

const ClientPayPage: React.FC<ClientPayPageProps> = ({ invoice, walletConnected, onConnect, onPay, onApprove }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [txStep, setTxStep] = useState<'idle' | 'approving' | 'confirming' | 'success'>('idle');
  const [isApprovingMode, setIsApprovingMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!invoice) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Invoice Not Found</h1>
        <p className="text-slate-500 mt-2">The link you followed might be broken or the invoice has been removed.</p>
        <button onClick={() => window.location.hash = ''} className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Return Home</button>
      </div>
    </div>
  );

  const handleWalletConnect = () => {
    setIsConnecting(true);
    // Simulate wallet connection inline
    setTimeout(() => {
      onConnect();
      setIsConnecting(false);
    }, 1200);
  };

  const handleActionClick = (ms: Milestone, mode: 'pay' | 'approve') => {
    if (!walletConnected) {
      handleWalletConnect();
      return;
    }
    setSelectedMilestone(ms);
    setIsApprovingMode(mode === 'approve');
    setTxStep('idle');
  };

  const simulateTransaction = async () => {
    setTxStep('approving');
    await new Promise(r => setTimeout(r, 1200));
    setTxStep('confirming');
    await new Promise(r => setTimeout(r, 1200));
    setTxStep('success');
    await new Promise(r => setTimeout(r, 800));
    
    if (selectedMilestone) {
      if (isApprovingMode) {
        onApprove(selectedMilestone.id);
      } else {
        onPay(selectedMilestone.id);
      }
    }
    setSelectedMilestone(null);
    setTxStep('idle');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-bolt text-white text-sm"></i>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">PayFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-green-500 text-sm"></i>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Secure Payment Gateway</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice From</h4>
                <p className="text-2xl font-black text-slate-900">Muhammad Ali</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-mono text-slate-400 truncate max-w-[150px]">{invoice.freelancer_wallet}</p>
                  <span className="text-blue-500 text-[10px] font-bold bg-blue-50 px-1.5 rounded">VERIFIED</span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                <p className="text-3xl font-black text-slate-900">{invoice.total_amount} <span className="text-sm font-bold text-slate-400">{invoice.currency}</span></p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 text-lg">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{invoice.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">{invoice.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">💰 Payment Milestones</h4>
                <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                  <i className="fa-solid fa-lock text-slate-400"></i> ESCROW ACTIVE
                </div>
              </div>
              
              <div className="space-y-4">
                {invoice.milestones.map((ms, idx) => {
                  const isLocked = idx > 0 && invoice.milestones[idx-1].status === MilestoneStatus.PENDING;
                  
                  return (
                    <div key={ms.id} className={`p-5 rounded-2xl border transition-all ${
                      ms.status === MilestoneStatus.RELEASED ? 'bg-green-50/50 border-green-100 opacity-60' : 
                      ms.status === MilestoneStatus.PAID ? 'bg-blue-50 border-blue-100' : 
                      isLocked ? 'bg-slate-50 border-slate-200 opacity-50' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                            ms.status === MilestoneStatus.RELEASED ? 'bg-green-500 text-white' : 
                            ms.status === MilestoneStatus.PAID ? 'bg-blue-500 text-white' : 
                            isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white'
                          }`}>
                            {ms.status === MilestoneStatus.RELEASED ? <i className="fa-solid fa-check text-[10px]"></i> : (idx + 1)}
                          </div>
                          <div>
                            <p className={`font-bold leading-tight ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{ms.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] font-bold uppercase ${
                                ms.status === MilestoneStatus.RELEASED ? 'text-green-600' : 
                                ms.status === MilestoneStatus.PAID ? 'text-blue-600' : 
                                isLocked ? 'text-slate-400' : 'text-amber-500'
                              }`}>
                                {ms.status === MilestoneStatus.RELEASED ? 'Released' : 
                                 ms.status === MilestoneStatus.PAID ? 'In Escrow' : 
                                 isLocked ? 'Locked' : 'Awaiting Payment'}
                              </span>
                              <span className="text-[10px] font-bold text-slate-300">•</span>
                              <span className="text-xs text-slate-400 font-bold">{ms.amount} {invoice.currency}</span>
                            </div>
                          </div>
                        </div>

                        {!isLocked && ms.status === MilestoneStatus.PENDING && (
                          <button 
                            onClick={() => handleActionClick(ms, 'pay')}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                          >
                            Pay Milestone
                          </button>
                        )}

                        {ms.status === MilestoneStatus.PAID && (
                          <button 
                            onClick={() => handleActionClick(ms, 'approve')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                          >
                            Approve & Release
                          </button>
                        )}

                        {isLocked && (
                          <div className="p-2 text-slate-300">
                            <i className="fa-solid fa-lock"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-500/20">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Protected by Blockchain Escrow</h4>
                  <p className="text-sm text-slate-400 leading-relaxed mt-1">
                    Your MNEE tokens are held by a non-custodial smart contract. The freelancer can only access them once you click <span className="text-white font-bold">"Approve & Release"</span>.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-6">
          {!walletConnected ? (
            <button 
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className="w-full max-w-sm py-5 bg-blue-600 text-white text-lg font-black rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-70 active:scale-95"
            >
              {isConnecting ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-wallet"></i>
              )}
              {isConnecting ? 'Opening Wallet...' : 'Connect Wallet to Pay'}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-300">
              <div className="flex items-center gap-3 px-6 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm font-bold shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Connected: 0x7f8...9a2b
              </div>
              <p className="text-xs text-slate-400 font-medium">Network: Ethereum Mainnet • Stablecoin: MNEE</p>
            </div>
          )}
        </div>
      </main>

      {selectedMilestone && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">
                  {isApprovingMode ? '✅ Confirm Release' : '💳 Pay Escrow'}
                </h3>
                <button onClick={() => setSelectedMilestone(null)} className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:text-slate-900 hover:bg-slate-200 transition-all">
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>

              <div className="space-y-8">
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 text-center relative overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">{selectedMilestone.title}</p>
                  <p className="text-5xl font-black text-slate-900 relative z-10">{selectedMilestone.amount} <span className="text-sm font-bold text-slate-400">MNEE</span></p>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mb-8"></div>
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400 font-medium">Smart Contract</span>
                    <span className="font-mono text-xs text-slate-900 bg-slate-100 px-2 py-1 rounded">0xEscrow...7a2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400 font-medium">Estimated Gas</span>
                    <span className="text-sm font-bold text-slate-900">~$0.85 MNEE</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex gap-4 ${isApprovingMode ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isApprovingMode ? 'bg-amber-200 text-amber-700' : 'bg-blue-200 text-blue-700'}`}>
                    <i className={`fa-solid ${isApprovingMode ? 'fa-triangle-exclamation' : 'fa-info-circle'}`}></i>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed">
                    {isApprovingMode 
                      ? 'You are about to release funds from the smart contract. Once released, the freelancer will receive the tokens instantly in their wallet. This action is irreversible.' 
                      : 'Funds will be transferred to the secure escrow contract. The freelancer will see the funds but cannot withdraw them until you approve the work.'}
                  </p>
                </div>

                {txStep === 'idle' ? (
                  <button 
                    onClick={simulateTransaction}
                    className={`w-full py-5 text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 ${
                      isApprovingMode 
                        ? 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700' 
                        : 'bg-slate-900 shadow-slate-900/10 hover:bg-slate-800'
                    }`}
                  >
                    {isApprovingMode ? 'Confirm & Release Funds' : 'Approve & Pay Escrow'}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                      {txStep === 'success' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full">
                          <i className="fa-solid fa-check text-green-500 text-2xl"></i>
                        </div>
                      )}
                    </div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs">{txStep}...</p>
                    <p className="text-xs text-slate-400">Please check your wallet for confirmation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPayPage;
