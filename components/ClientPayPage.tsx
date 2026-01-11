
import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Invoice, Milestone, MilestoneStatus } from '../types';
import invoiceService from '../src/services/invoiceService';
import { useUIStore } from '../src/store/uiStore';
import { useMNEEToken } from '../src/hooks/useMNEEToken';
import { usePayFlowEscrow } from '../src/hooks/usePayFlowEscrow';
import TransactionModal from './TransactionModal';

interface ClientPayPageProps {
  invoiceId: string;
}

const ClientPayPage: React.FC<ClientPayPageProps> = ({ invoiceId }) => {
  const { showSuccess, showError } = useUIStore();
  const { address: connectedAddress, isConnected, chainId } = useAccount();
  const { approveMNEE, hasSufficientBalance, hasSufficientAllowance, formattedBalance } = useMNEEToken();
  const { depositMilestone, releaseMilestone, checkInvoiceExists, hash, isPending, isConfirming, isSuccess } = usePayFlowEscrow();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [txStep, setTxStep] = useState<'idle' | 'approving' | 'pending' | 'confirming' | 'success' | 'error'>('idle');
  const [isApprovingMode, setIsApprovingMode] = useState(false);
  const [txError, setTxError] = useState<string>('');
  const [hasRegistered, setHasRegistered] = useState(false); // FIX: Track registration to prevent infinite loop

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        const data = await invoiceService.getPublicInvoice(invoiceId);
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        showError('Failed to load invoice');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, showError]);

  // Register wallet with backend when connected
  useEffect(() => {
    if (isConnected && connectedAddress && invoice) {
      registerWallet();
    }
  }, [isConnected, connectedAddress, invoice?.id]); // FIX: Only trigger if invoice ID changes, not the whole object

  const registerWallet = async () => {
    if (!connectedAddress || !invoice || hasRegistered) return; // FIX: Check if already registered

    try {
      await invoiceService.registerClient(invoice.id, connectedAddress);
      setHasRegistered(true); // FIX: Mark as registered to prevent re-registration
      const updatedInvoice = await invoiceService.getPublicInvoice(invoiceId);
      setInvoice(updatedInvoice);
    } catch (error: any) {
      console.error('Error registering wallet:', error);
      // Don't show error if already registered
      if (!error?.message?.includes('already assigned')) {
        showError('Failed to register wallet');
      } else {
        setHasRegistered(true); // FIX: Already registered = success
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
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
  }

  const handleActionClick = (ms: Milestone, mode: 'pay' | 'approve') => {
    if (!isConnected) {
      showError('Please connect your wallet first');
      return;
    }
    setSelectedMilestone(ms);
    setIsApprovingMode(mode === 'approve');
    setTxStep('idle');
    setTxError('');
  };

  const handleTransaction = async () => {
    if (!selectedMilestone || !connectedAddress || !invoice) return;

    try {
      setTxError('');

      // CRITICAL: Verify user is on Sepolia testnet
      if (chainId !== 11155111) {
        throw new Error(
          `Wrong network! Please switch to Sepolia Testnet in your wallet.\n\n` +
          `Currently on chain ID: ${chainId}\n` +
          `Required: Sepolia (11155111)`
        );
      }

      const milestoneIndex = invoice.milestones.findIndex(m => m.id === selectedMilestone.id);
      const amount = selectedMilestone.amount.toString();

      if (isApprovingMode) {
        // Release milestone from escrow
        setTxStep('pending');
        const txHash = await releaseMilestone(invoice.id, milestoneIndex);

        setTxStep('confirming');
        // Wait for transaction confirmation (handled by useWaitForTransactionReceipt in hook)

        // Update backend with transaction hash
        await invoiceService.updateMilestone(invoice.id, milestoneIndex, {
          status: MilestoneStatus.RELEASED,
          txHash: txHash
        });

        setTxStep('success');
        showSuccess('Milestone released successfully!');

        // Refresh invoice data
        setTimeout(async () => {
          const updatedInvoice = await invoiceService.getPublicInvoice(invoiceId);
          setInvoice(updatedInvoice);
          setSelectedMilestone(null);
          setTxStep('idle');
        }, 2000);

      } else {
        // Deposit milestone into escrow
        // Step 1: Check if invoice exists on blockchain
        const exists = await checkInvoiceExists(invoice.id);
        if (!exists) {
          throw new Error(
            '❌ This invoice is not registered on the blockchain.\n\n' +
            'The freelancer needs to recreate this invoice using the latest version of PayFlow. ' +
            'Please contact the freelancer to create a new invoice.'
          );
        }

        // Step 2: Check balance
        if (!hasSufficientBalance(amount)) {
          throw new Error(`Insufficient MNEE balance. You need ${amount} MNEE.`);
        }

        // Step 3: Check/approve allowance
        if (!hasSufficientAllowance(amount)) {
          setTxStep('approving');
          const approvalHash = await approveMNEE(amount);

          setTxStep('confirming');
          // Wait for approval confirmation
        }

        // Step 4: Deposit into escrow
        setTxStep('pending');
        const txHash = await depositMilestone(invoice.id, milestoneIndex);

        setTxStep('confirming');
        // Wait for deposit confirmation

        // Update backend with transaction hash (with retry for rate limiting)
        let retries = 3;
        let updated = false;

        while (retries > 0 && !updated) {
          try {
            await invoiceService.updateMilestone(invoice.id, milestoneIndex, {
              status: MilestoneStatus.PAID,
              txHash: txHash
            });
            updated = true;
          } catch (error: any) {
            retries--;
            if (error?.status === 429 && retries > 0) {
              // Wait 2 seconds before retry if rate limited
              await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
              // Give up after 3 tries or non-429 error
              throw error;
            }
          }
        }

        setTxStep('success');
        showSuccess('Payment successful! Funds are now in escrow.');

        // Refresh invoice data
        setTimeout(async () => {
          const updatedInvoice = await invoiceService.getPublicInvoice(invoiceId);
          setInvoice(updatedInvoice);
          setSelectedMilestone(null);
          setTxStep('idle');
        }, 2000);
      }

    } catch (error: any) {
      console.error('Transaction error:', error);

      // Parse error and show user-friendly message
      let errorMessage = error?.message || error?.shortMessage || 'Transaction failed';

      // Detect specific error types
      if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled. Please try again when ready.';
      } else if (errorMessage.includes('insufficient')) {
        errorMessage = 'Insufficient ETH for gas fees. Please add some ETH to your wallet.';
      } else if (errorMessage.includes('gas limit too high') || errorMessage.includes('transaction gas limit')) {
        errorMessage =
          '⚠️ This invoice is not properly registered on the blockchain.\n\n' +
          'Please contact the freelancer and ask them to recreate the invoice using the latest version of PayFlow.';
      } else if (errorMessage.includes('Invoice does not exist')) {
        errorMessage =
          '❌ Invoice not found on blockchain.\n\n' +
          'The freelancer needs to recreate this invoice.';
      }

      setTxError(errorMessage);
      setTxStep('error');
      showError(errorMessage);
    }
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
                  const isLocked = idx > 0 && invoice.milestones[idx-1].status === MilestoneStatus.EMPTY;
                  
                  return (
                    <div key={ms.id} className={`p-5 rounded-2xl border transition-all ${
                      ms.status === MilestoneStatus.RELEASED ? 'bg-pink-50 border-pink-100' :
                      ms.status === MilestoneStatus.PAID ? 'bg-blue-50 border-blue-100' :
                      isLocked ? 'bg-slate-50 border-slate-200 opacity-50' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                            ms.status === MilestoneStatus.RELEASED ? 'bg-pink-500 text-white' :
                            ms.status === MilestoneStatus.PAID ? 'bg-blue-500 text-white' :
                            isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white'
                          }`}>
                            {ms.status === MilestoneStatus.RELEASED ? <i className="fa-solid fa-check text-[10px]"></i> : (idx + 1)}
                          </div>
                          <div>
                            <p className={`font-bold leading-tight ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{ms.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] font-bold uppercase ${
                                ms.status === MilestoneStatus.RELEASED ? 'text-pink-600' :
                                ms.status === MilestoneStatus.PAID ? 'text-blue-600' :
                                isLocked ? 'text-slate-400' : 'text-amber-500'
                              }`}>
                                {ms.status === MilestoneStatus.RELEASED ? 'PAID' :
                                 ms.status === MilestoneStatus.PAID ? 'PAID - In Escrow' :
                                 isLocked ? 'Locked' : 'Awaiting Payment'}
                              </span>
                              <span className="text-[10px] font-bold text-slate-300">•</span>
                              <span className="text-xs text-slate-400 font-bold">{ms.amount} {invoice.currency}</span>
                            </div>
                          </div>
                        </div>

                        {!isLocked && ms.status === MilestoneStatus.EMPTY && (
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

                        {ms.status === MilestoneStatus.RELEASED && (
                          <button
                            disabled
                            className="bg-pink-100 text-pink-600 px-4 py-2 rounded-xl text-xs font-bold cursor-not-allowed opacity-75"
                          >
                            PAID ✓
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
          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="w-full max-w-sm py-5 bg-blue-600 text-white text-lg font-black rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  <i className="fa-solid fa-wallet"></i>
                  Connect Wallet to Pay
                </button>
              )}
            </ConnectButton.Custom>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-300">
              <div className="flex items-center gap-3 px-6 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm font-bold shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Connected: {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}` : '0x...'}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span>Network: Ethereum Mainnet</span>
                <span>•</span>
                <span>Balance: {formattedBalance} MNEE</span>
              </div>
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
                    onClick={handleTransaction}
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
                      {txStep === 'error' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full">
                          <i className="fa-solid fa-xmark text-red-500 text-2xl"></i>
                        </div>
                      )}
                    </div>
                    <p className="font-black text-slate-900 uppercase tracking-widest text-xs">{txStep}...</p>
                    {txStep === 'error' ? (
                      <p className="text-xs text-red-500 text-center max-w-xs">{txError}</p>
                    ) : (
                      <p className="text-xs text-slate-400">
                        {txStep === 'approving' ? 'Approve MNEE in your wallet' : 'Please check your wallet for confirmation'}
                      </p>
                    )}
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
