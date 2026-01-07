
import React from 'react';

interface FeaturesPageProps {
  onBack: () => void;
  onStart: () => void;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onBack, onStart }) => {
  const featureList = [
    {
      title: "AI-Gen Smart Contracts",
      desc: "Powered by Gemini 3.0, our engine converts natural language project scopes into mathematically sound, milestone-based smart contracts.",
      icon: "fa-wand-magic-sparkles",
      tags: ["NLP Parsing", "Auto-Milestones", "Legal-to-Code"],
      color: "text-purple-500"
    },
    {
      title: "Arbitrum-Powered Escrow",
      desc: "Funds are held in high-speed, low-cost L2 escrow contracts. You get the security of Ethereum with the speed of a credit card.",
      icon: "fa-vault",
      tags: ["Non-Custodial", "Open Source", "Gas Optimized"],
      color: "text-blue-500"
    },
    {
      title: "Stablecoin Native",
      desc: "Settle in MNEE or USDC. Avoid the volatility of ETH while maintaining the global instant settlement of blockchain.",
      icon: "fa-coins",
      tags: ["1:1 Backed", "Zero Slippage", "Instant Off-ramp"],
      color: "text-green-500"
    },
    {
      title: "Client Portal (No Wallet Req)",
      desc: "Clients can pay via traditional methods. We handle the bridge to escrow, making it seamless for non-crypto companies to hire you.",
      icon: "fa-door-open",
      tags: ["Web2 Bridge", "Email Magic Links", "Direct Checkout"],
      color: "text-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Inter'] selection:bg-blue-600 selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-bolt text-white text-sm"></i>
            </div>
            <span className="text-lg font-black tracking-tighter">PayFlow</span>
          </div>
          <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
            <i className="fa-solid fa-arrow-left mr-2"></i> Exit
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-40">
        <div className="max-w-5xl mx-auto px-6">
          <header className="mb-24 text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-none">
              Powerful <span className="text-blue-600 italic">Core.</span><br/>Simple Surface.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              We've abstracted the complexity of the blockchain to give you a payment experience that feels like magic.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featureList.map((f, i) => (
              <div key={i} className="group p-10 bg-[#fafbfc] rounded-[40px] border border-slate-100 hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-blue-500/5 relative overflow-hidden">
                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-sm ${f.color} group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>

          {/* Detailed Breakdown */}
          <section className="mt-40 space-y-24">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-black text-slate-900">The "Magic Link" Onboarding</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Your clients don't need a wallet, tokens, or even a basic understanding of Web3. When you send an invoice, they receive a professional checkout link. They can pay via bank transfer or credit card, and our protocol handles the conversion to escrowed stablecoins automatically.
                </p>
              </div>
              <div className="flex-1 w-full aspect-square bg-slate-900 rounded-[60px] flex items-center justify-center shadow-2xl relative">
                <div className="absolute inset-0 bg-blue-600 opacity-20 blur-[100px]"></div>
                <i className="fa-solid fa-link text-white/10 text-[180px]"></i>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black shadow-2xl rotate-3">
                  payflow.ai/auth/magic...
                </div>
              </div>
            </div>
          </section>

          <div className="mt-40 text-center">
             <button 
               onClick={onStart}
               className="px-12 py-6 bg-slate-900 text-white text-xl font-black rounded-3xl hover:bg-blue-600 transition-all transform hover:scale-105 shadow-2xl active:scale-95"
             >
               Start Building for Free
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
