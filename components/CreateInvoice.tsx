
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { waitForTransactionReceipt } from 'viem/actions';
import { createPublicClient, http } from 'viem';
import { sepolia, mainnet } from 'viem/chains';
import aiService from '../src/services/aiService';
import invoiceService from '../src/services/invoiceService';
import { useInvoiceStore } from '../src/store/invoiceStore';
import { useAuthStore } from '../src/store/authStore';
import { useUIStore } from '../src/store/uiStore';
import { usePayFlowEscrow } from '../src/hooks/usePayFlowEscrow';
import { Invoice, InvoiceStatus, MilestoneStatus, AppView } from '../types';

interface CreateInvoiceProps {
  onNavigate: (view: AppView, id?: string) => void;
}

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { createInvoice } = useInvoiceStore();
  const { showSuccess, showError } = useUIStore();
  const { address: userAddress, isConnected, chainId } = useAccount();
  const { createInvoice: createBlockchainInvoice } = usePayFlowEscrow();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Partial<Invoice> | null>(null);
  const [success, setSuccess] = useState<Invoice | null>(null);
  const [aiMessage, setAiMessage] = useState('');
  const [generatingMsg, setGeneratingMsg] = useState(false);
  const [blockchainStep, setBlockchainStep] = useState<'idle' | 'submitting' | 'confirming' | 'saving' | 'done'>('idle');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const generated = await aiService.generateInvoice(prompt);
      setPreview(generated);
      showSuccess('Invoice generated successfully!');
    } catch (err) {
      console.error("Error generating invoice:", err);
      showError("Error generating invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview) return;

    // Check wallet connection
    if (!isConnected || !userAddress) {
      showError('Please connect your wallet to create an invoice');
      return;
    }

    // CRITICAL: Verify user is on Sepolia testnet
    if (chainId !== 11155111) {
      showError(
        `Wrong network! Please switch to Sepolia Testnet in your wallet. Currently on chain ID: ${chainId}`
      );
      return;
    }

    console.log('✅ Network check passed - User is on Sepolia (chain ID: 11155111)');
    console.log('✅ Wallet connected:', userAddress);

    let tempInvoiceId: string | null = null;
    let blockchainTxHash: string | null = null;
    let blockchainSuccess = false; // Track if blockchain registration succeeded

    try {
      const invoiceData = {
        title: preview.title!,
        description: preview.description || '',
        totalAmount: preview.totalAmount!,
        currency: preview.currency || 'MNEE',
        category: preview.category || 'General',
        ...(preview.client_email && { clientEmail: preview.client_email }),
        ...(preview.client_name && { clientName: preview.client_name }),
        milestones: preview.milestones?.map((m) => ({
          title: m.title,
          description: m.description || '',
          amount: m.amount,
          percentage: m.percentage
        })) || []
      };

      // Step 1: Generate temporary invoice ID (format: INV-YYYY-XXX)
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 1000);
      tempInvoiceId = `INV-${year}-${random}`;

      // Step 2: Create invoice on BLOCKCHAIN FIRST
      setBlockchainStep('submitting');
      const milestoneAmounts = invoiceData.milestones.map(m => m.amount.toString());

      console.log('📝 Creating invoice on blockchain:');
      console.log('  Invoice ID:', tempInvoiceId);
      console.log('  Freelancer:', userAddress);
      console.log('  Milestones:', milestoneAmounts);
      console.log('  ChainId:', chainId);

      blockchainTxHash = await createBlockchainInvoice(
        tempInvoiceId,
        userAddress,
        milestoneAmounts
      );

      console.log('✅ Transaction submitted:', blockchainTxHash);

      // Step 3: Wait for ACTUAL blockchain confirmation (not just a timeout!)
      setBlockchainStep('confirming');

      // Create public client to check transaction status
      const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
      const rpcUrl = chainId === 11155111
        ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
        : `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;

      const publicClient = createPublicClient({
        chain: chainId === 11155111 ? sepolia : mainnet,
        transport: http(rpcUrl),
      });

      // Wait for transaction to be mined and confirmed
      const receipt = await waitForTransactionReceipt(publicClient, {
        hash: blockchainTxHash,
        confirmations: 1, // Wait for at least 1 confirmation
      });

      console.log('📄 Transaction receipt:', receipt);
      console.log('  Status:', receipt.status);
      console.log('  Block:', receipt.blockNumber);
      console.log('  Gas used:', receipt.gasUsed.toString());

      // Check if transaction was successful
      if (receipt.status !== 'success') {
        console.error('❌ Transaction reverted!');
        throw new Error('Transaction was reverted on the blockchain. Please check your wallet and try again.');
      }

      console.log('✅ Transaction confirmed successfully!');

      // Verify invoice was created on blockchain
      console.log('🔍 Verifying invoice on blockchain...');
      const verifyResult = await publicClient.readContract({
        address: (await import('../src/lib/wagmi')).PAYFLOW_ESCROW_ADDRESS,
        abi: (await import('../src/lib/PayFlowEscrow.json')).default.abi,
        functionName: 'getInvoice',
        args: [tempInvoiceId],
      }) as [string, string, bigint, boolean];

      const invoiceExists = verifyResult[3];
      console.log('  Invoice exists on blockchain:', invoiceExists ? '✅ YES' : '❌ NO');

      if (!invoiceExists) {
        console.error('❌ Invoice was NOT created on blockchain despite successful transaction!');
        throw new Error('Invoice creation failed. The transaction succeeded but the invoice was not created. Please try again.');
      }

      console.log('✅ Blockchain registration VERIFIED and SUCCESSFUL!');
      blockchainSuccess = true; // Mark blockchain as successful

      // Step 4: ONLY create in database after blockchain success
      setBlockchainStep('saving');
      console.log('💾 Creating invoice in database...');
      console.log('  Data:', { ...invoiceData, id: tempInvoiceId });

      let createdInvoice;
      try {
        createdInvoice = await createInvoice({
          ...invoiceData,
          id: tempInvoiceId // Use the same ID we registered on blockchain
        });
        console.log('✅ Database save successful!');
        console.log('  Created invoice:', createdInvoice);
      } catch (dbError: any) {
        console.error('❌ Database save FAILED:', dbError);
        console.error('  Error message:', dbError.message);
        console.error('  Error details:', dbError);
        throw new Error(`Blockchain registration succeeded, but database save failed: ${dbError.message}`);
      }

      setBlockchainStep('done');
      setSuccess(createdInvoice);
      setPreview(null);
      showSuccess('Invoice created on blockchain successfully!');
    } catch (err: any) {
      console.error("Error creating invoice:", err);
      setBlockchainStep('idle');

      // CRITICAL: Check if blockchain succeeded but database failed
      if (blockchainSuccess && tempInvoiceId) {
        console.error('🚨 CRITICAL: Blockchain succeeded but database save failed!');
        console.error(`🚨 ORPHANED INVOICE: ${tempInvoiceId} exists on blockchain but not in database`);
        console.error(`🚨 Transaction hash: ${blockchainTxHash}`);
        console.error(`🚨 This invoice needs to be cleaned up or manually added to database`);

        showError(
          `⚠️ Blockchain registration succeeded (${tempInvoiceId}), but database save failed!\n\n` +
          `Error: ${err?.message || 'Unknown database error'}\n\n` +
          `The invoice exists on the blockchain but not in the app. ` +
          `Please contact support with invoice ID: ${tempInvoiceId}`
        );
        return;
      }

      // Show user-friendly error messages for blockchain failures
      if (err?.message?.includes('User rejected') || err?.message?.includes('user rejected')) {
        showError('Transaction rejected. Invoice was not created.');
      } else if (err?.message?.includes('insufficient')) {
        showError('Insufficient ETH for gas fees. Please add ETH to your wallet.');
      } else {
        showError(err?.message || 'Failed to create invoice on blockchain. Please try again.');
      }
    }
  };

  const handleGenerateMsg = async () => {
    if (!success) return;
    setGeneratingMsg(true);
    try {
      const msg = await aiService.generateMessage(
        success.title,
        success.client_name,
        success.total_amount
      );
      setAiMessage(msg);
      showSuccess('Message generated successfully!');
    } catch (err) {
      console.error("Failed to generate msg", err);
      showError("Failed to generate message. Please try again.");
    } finally {
      setGeneratingMsg(false);
    }
  };
  // Show blockchain creation progress
  if (blockchainStep !== 'idle' && blockchainStep !== 'done') {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl border border-slate-200 animate-in zoom-in duration-300">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {blockchainStep === 'submitting' && 'Submitting Transaction...'}
                {blockchainStep === 'confirming' && 'Confirming on Blockchain...'}
                {blockchainStep === 'saving' && 'Saving to Database...'}
              </h3>
              <p className="text-slate-500 text-sm">
                {blockchainStep === 'submitting' && 'Please confirm the transaction in your wallet'}
                {blockchainStep === 'confirming' && 'Waiting for blockchain confirmation (this may take 10-30 seconds)'}
                {blockchainStep === 'saving' && 'Almost done! Saving invoice details...'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <i className="fa-solid fa-lock"></i>
              <span>Secured by Smart Contract</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    const publicLink = `${window.location.origin}/#pay/${success.id}`;
    return (
      <div className="max-w-2xl mx-auto py-12 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl shadow-green-100">
          <i className="fa-solid fa-check"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Invoice Created!</h2>
        <p className="text-slate-500 mb-10">Invoice <span className="font-mono font-bold text-slate-900">{success.id}</span> is ready to share.</p>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-left space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Payment Link</label>
            <div className="flex items-center gap-2">
              <input readOnly value={publicLink} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-600 outline-none" />
              <button onClick={() => navigator.clipboard.writeText(publicLink)} className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                <i className="fa-solid fa-copy"></i>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI-Generated Client Message</label>
              <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">GEN AI</span>
            </div>
            
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl relative min-h-[100px] flex items-center justify-center">
              {generatingMsg ? (
                <div className="flex flex-col items-center gap-2 py-4 text-blue-500">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span className="text-[9px] font-black uppercase tracking-widest">Drafting message...</span>
                </div>
              ) : aiMessage ? (
                <div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">{aiMessage}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(aiMessage)}
                    className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <i className="fa-solid fa-copy"></i> Copy Message
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button 
                    onClick={handleGenerateMsg}
                    className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Generate Message with AI
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <button onClick={() => onNavigate('details', success.id)} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
            View Invoice Detail
          </button>
          <button onClick={() => onNavigate('dashboard')} className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">🤖 AI Generated Preview</h2>
          <div className="flex gap-2">
            <button onClick={() => setPreview(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50">
              <i className="fa-solid fa-redo mr-2"></i> Redo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">INVOICE</h1>
                <p className="text-slate-400 mt-1 font-mono">DRAFT</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Amount Due</p>
                <p className="text-3xl font-bold text-slate-900">{preview.totalAmount} {preview.currency}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-10 pb-10 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">From (Freelancer)</h4>
                <p className="font-bold text-slate-900">You</p>
                <p className="text-sm text-slate-500 font-mono mt-1 truncate">{user?.walletAddress}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bill To (Client)</h4>
                <p className="font-bold text-slate-900">{preview.clientName || 'Client'}</p>
                <p className="text-sm text-slate-500 mt-1">Pending connection</p>
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Service Description</h4>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{preview.title}</h3>
                <p className="text-slate-600 leading-relaxed">{preview.description}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Breakdown (Escrow)</h4>
              <div className="space-y-4">
                {preview.milestones?.map((ms, i) => (
                  <div key={`milestone-${i}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{ms.title}</p>
                        <p className="text-xs text-slate-500">{ms.description || 'Deliverable approval required'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{ms.amount} {preview.currency}</p>
                      <p className="text-[10px] font-bold text-blue-600 uppercase">{ms.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-6">
          <button onClick={() => setPreview(null)} className="text-slate-600 font-bold hover:underline">
            <i className="fa-solid fa-arrow-left mr-2"></i> Back
          </button>
          <button 
            onClick={handleConfirm}
            className="px-10 py-4 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transform hover:scale-105 transition-all"
          >
            ✅ Create & Send Invoice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-magic text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Invoice Generator</h2>
            <p className="text-slate-500">Describe your work in plain English.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Describe your work:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I'm designing a logo for Ahmed's tech startup CloudBase. The project includes logo concepts, color palette and business card design. Total cost is $800. 30% upfront, 40% after draft, 30% on final."
              rows={8}
              className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder:text-slate-400 leading-relaxed"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-5 bg-slate-900 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate Invoice with AI</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
