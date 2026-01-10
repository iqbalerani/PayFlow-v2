
import React, { useState } from 'react';
import aiService from '../src/services/aiService';
import { useInvoiceStore } from '../src/store/invoiceStore';
import { useAuthStore } from '../src/store/authStore';
import { useUIStore } from '../src/store/uiStore';
import { Invoice, InvoiceStatus, MilestoneStatus, AppView } from '../types';

interface CreateInvoiceProps {
  onNavigate: (view: AppView, id?: string) => void;
}

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { createInvoice } = useInvoiceStore();
  const { showSuccess, showError } = useUIStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Partial<Invoice> | null>(null);
  const [success, setSuccess] = useState<Invoice | null>(null);
  const [aiMessage, setAiMessage] = useState('');
  const [generatingMsg, setGeneratingMsg] = useState(false);

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

    try {
      const invoiceData = {
        title: preview.title!,
        description: preview.description || '',
        totalAmount: preview.totalAmount!,
        currency: preview.currency || 'MNEE',
        category: preview.category || 'General',
        milestones: preview.milestones?.map((m) => ({
          title: m.title,
          description: m.description || '',
          amount: m.amount,
          percentage: m.percentage
        })) || []
      };

      const createdInvoice = await createInvoice(invoiceData);
      setSuccess(createdInvoice);
      setPreview(null);
      showSuccess('Invoice created successfully!');
    } catch (err) {
      console.error("Error creating invoice:", err);
      showError("Failed to create invoice. Please try again.");
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
