
import React from 'react';

interface HowItWorksProps {
  onBack: () => void;
  onStart: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onStart }) => {
  const steps = [
    {
      title: "AI-Powered Generation",
      description: "Stop manually drafting terms. Describe your project in plain English, and our AI constructs a structured invoice with fair milestones and industry-standard payment terms.",
      icon: "fa-wand-magic-sparkles",
      color: "bg-purple-600",
      detail: "Gemini 3.0 parses your intent to ensure no deliverable is left vague."
    },
    {
      title: "The Secure Escrow Vault",
      description: "Once the invoice is sent, the client deposits the total or milestone amount into a decentralized smart contract. The funds are locked and visible to both parties.",
      icon: "fa-vault",
      color: "bg-blue-600",
      detail: "Non-custodial. No middleman can touch your money."
    },
    {
      title: "Milestone-Based Release",
      description: "As you finish work, request a release. When the client approves your deliverable, the smart contract instantly transfers the stablecoins to your wallet.",
      icon: "fa-bolt",
      color: "bg-green-600",
      detail: "Instant settlement. Zero bank delays or chargeback risks."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-bolt text-white"></i>
          </div>
          <span className="text-xl font-black tracking-tighter">PayFlow</span>
        </div>
        <button 
          onClick={onBack}
          className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Home
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
            How it <span className="text-blue-500 italic">Works</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            PayFlow bridges the trust gap between freelancers and clients using blockchain and AI.
          </p>
        </div>

        <div className="space-y-32">
          {steps.map((step, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>
              <div className="flex-1 space-y-6">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-2xl shadow-2xl`}>
                  <i className={`fa-solid ${step.icon}`}></i>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">{step.title}</h2>
                <p className="text-lg text-slate-400 leading-relaxed font-medium">
                  {step.description}
                </p>
                <div className="inline-block px-4 py-2 bg-slate-800 rounded-full border border-slate-700 text-xs font-bold text-slate-300">
                  <i className="fa-solid fa-circle-info mr-2 text-blue-400"></i>
                  {step.detail}
                </div>
              </div>
              <div className="flex-1 w-full aspect-video bg-slate-800 rounded-[40px] border border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden group">
                <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-1000 flex items-center justify-center">
                   <i className={`fa-solid ${step.icon} text-9xl text-white/10`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-40 text-center py-20 px-8 bg-blue-600 rounded-[60px] relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8">Stop chasing payments.</h2>
            <p className="text-blue-100 text-xl mb-12 font-medium max-w-xl mx-auto">
              Secure your next project in under 2 minutes with AI-generated escrow protection.
            </p>
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-white text-slate-900 text-lg font-black rounded-3xl hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
            >
              Get Started Now
            </button>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
        </section>
      </main>

      <footer className="py-20 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-sm font-medium italic">Empowering 20,000+ creators globally with PayFlow Protocol.</p>
      </footer>
    </div>
  );
};

export default HowItWorks;
