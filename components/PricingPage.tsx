
import React, { useState } from 'react';

interface PricingPageProps {
  onBack: () => void;
  onStart: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onStart }) => {
  const [billMonthly, setBillMonthly] = useState(true);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-['Inter'] selection:bg-blue-600 selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-bolt text-white text-sm"></i>
            </div>
            <span className="text-lg font-black tracking-tighter">PayFlow</span>
          </div>
          <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
             Back Home
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-40 px-6">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-24 space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">
              Pricing that grows <span className="text-blue-600">with you.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
              Simple, transparent, and built to scale your freelance business.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <span className={`text-sm font-bold ${billMonthly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
              <button 
                onClick={() => setBillMonthly(!billMonthly)}
                className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-colors hover:bg-slate-300"
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${!billMonthly ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-sm font-bold ${!billMonthly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="text-blue-600 text-[10px] ml-1">20% OFF</span></span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free/Standard Tier */}
            <div className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Starter</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-6xl font-black text-slate-900">0</span>
                  <span className="text-xl font-bold text-slate-400">/mo</span>
                </div>
                <p className="text-slate-500 font-medium mb-12">Perfect for freelancers starting their journey.</p>
                
                <ul className="space-y-6 mb-12">
                  {[
                    "1% transaction fee",
                    "Unlimited AI-generated invoices",
                    "Decentralized escrow protection",
                    "Community support"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-4 text-sm font-bold text-slate-700">
                      <i className="fa-solid fa-check text-green-500"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={onStart}
                className="w-full py-5 border-2 border-slate-900 rounded-2xl font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                Start for Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-900 p-12 rounded-[48px] text-white shadow-2xl shadow-blue-600/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-xs font-black rounded-bl-3xl">MOST POPULAR</div>
              <div>
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-8">Pro Agency</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-6xl font-black text-white">{billMonthly ? '29' : '19'}</span>
                  <span className="text-xl font-bold text-slate-500">/mo</span>
                </div>
                <p className="text-slate-400 font-medium mb-12">For serious creators and growing teams.</p>
                
                <ul className="space-y-6 mb-12">
                  {[
                    "0.2% transaction fee",
                    "Custom branding on invoices",
                    "Priority dispute mediation",
                    "API Access & Webhooks",
                    "Premium AI models (Gemini 2.5 Pro)"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-4 text-sm font-bold text-slate-100">
                      <i className="fa-solid fa-bolt text-blue-500"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={onStart}
                className="w-full py-5 bg-blue-600 rounded-2xl font-black text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                Go Pro Now
              </button>
            </div>
          </div>

          <div className="mt-40 bg-white border border-slate-200 rounded-[40px] p-12 text-center shadow-sm">
             <h3 className="text-2xl font-black text-slate-900 mb-4">Enterprise?</h3>
             <p className="text-slate-500 font-medium mb-8 max-w-xl mx-auto">
               Custom fee structures for organizations processing over $500k/year.
             </p>
             <button className="text-blue-600 font-black hover:underline">Contact Sales →</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
