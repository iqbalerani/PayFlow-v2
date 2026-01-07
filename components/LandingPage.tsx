
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  onFeatures: () => void;
  onPricing: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onHowItWorks, onFeatures, onPricing }) => {
  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col selection:bg-blue-600 selection:text-white font-['Inter']">
      {/* Premium Glassmorphism Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
              <i className="fa-solid fa-bolt text-white text-lg"></i>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">PayFlow</span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            {[
              { label: 'How it works', action: onHowItWorks },
              { label: 'Features', action: onFeatures },
              { label: 'Pricing', action: onPricing }
            ].map((item) => (
              <button 
                key={item.label}
                onClick={item.action}
                className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onStart}
              className="px-5 py-2.5 text-slate-600 font-bold text-sm hover:text-slate-900 transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={onStart}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32">
        {/* Modern Hero Section */}
        <section className="px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center pb-32">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              The Trust Layer for Web3 Work
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] flex flex-col">
              <span>Freelance</span>
              <span className="text-blue-600 italic">without fear.</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Secure your income with AI-driven escrow. We bridge the trust gap between global talent and visionary clients.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onStart}
                className="px-10 py-5 bg-blue-600 text-white text-lg font-black rounded-2xl hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-600/30 active:scale-95 flex items-center gap-3"
              >
                Start Invoicing <i className="fa-solid fa-arrow-right text-sm"></i>
              </button>
              <button 
                onClick={onHowItWorks}
                className="px-10 py-5 bg-white border border-slate-200 text-slate-900 text-lg font-black rounded-2xl hover:bg-slate-50 transition-all shadow-lg active:scale-95"
              >
                How it works
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 opacity-60">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">$2.4M+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secured</p>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">12k+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoices</p>
              </div>
            </div>
          </div>

          {/* Hero Visual: Floating Mockup */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full"></div>
            <div className="relative bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl transform rotate-2 animate-float">
              <div className="flex justify-between items-center mb-10">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full mb-1">ESCROW ACTIVE</div>
                  <p className="text-2xl font-black text-slate-900">1,200 <span className="text-sm font-bold text-slate-400 uppercase">mnee</span></p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-50 rounded-full w-3/4"></div>
                <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                <div className="h-12 bg-blue-600 rounded-2xl w-full flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/40">
                  Approve & Release Funds
                </div>
              </div>
            </div>
            {/* Small floating detail */}
            <div className="absolute -bottom-8 -left-8 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl transform -rotate-6 animate-float-delayed">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Milestone</p>
              <p className="font-bold">UI Final Handoff</p>
            </div>
          </div>
        </section>

        {/* Sophisticated Trusted By Section */}
        <section className="py-20 border-y border-slate-100 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-12">The world's best freelancers work with</p>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 items-center grayscale opacity-40 contrast-125">
               {['GITHUB', 'LINEAR', 'STRIPE', 'VERCEL', 'FIGMA', 'ARC'].map(brand => (
                 <span key={brand} className="text-2xl font-black tracking-tighter">{brand}</span>
               ))}
            </div>
          </div>
        </section>

        {/* Bento Feature Grid */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The platform for trustless growth.</h2>
            <p className="text-slate-500 text-xl font-medium">Everything you need to scale your independent career safely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Feature 1: Large AI Card */}
            <div className="md:col-span-2 md:row-span-1 bg-white border border-slate-200 rounded-[32px] p-10 flex flex-col justify-between hover:border-blue-400 transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <i className="fa-solid fa-magic"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">AI-Powered Invoicing</h3>
                <p className="text-slate-500 font-medium max-w-md">Our Gemini-integrated core turns your job descriptions into professional, milestone-based contracts in seconds.</p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Feature 2: High Security */}
            <div className="md:col-span-1 md:row-span-2 bg-slate-900 rounded-[32px] p-10 flex flex-col justify-between text-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all border border-white/5">
              <div>
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-xl shadow-blue-600/20">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="text-2xl font-black mb-4">Ethereum Escrow</h3>
                <p className="text-slate-400 font-medium leading-relaxed">Payments are locked in non-custodial smart contracts. Not even we can touch your funds. They belong to the work, then they belong to you.</p>
              </div>
              <div className="pt-10">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900"></div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">+2k</div>
                </div>
                <p className="text-xs text-slate-500 mt-4 font-bold uppercase tracking-widest">Active nodes securing protocol</p>
              </div>
            </div>

            {/* Feature 3: Small Grid Item */}
            <div className="md:col-span-1 bg-white border border-slate-200 rounded-[32px] p-10 flex flex-col justify-center hover:border-blue-400 transition-all cursor-pointer" onClick={onFeatures}>
               <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-6">
                 <i className="fa-solid fa-bolt"></i>
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Instant Release</h3>
               <p className="text-sm text-slate-500 font-medium">Get paid the moment the client approves. No 30-day net terms.</p>
            </div>

            {/* Feature 4: Small Grid Item */}
            <div className="md:col-span-1 bg-white border border-slate-200 rounded-[32px] p-10 flex flex-col justify-center hover:border-blue-400 transition-all cursor-pointer" onClick={onPricing}>
               <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-6">
                 <i className="fa-solid fa-globe"></i>
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Stablecoin Native</h3>
               <p className="text-sm text-slate-500 font-medium">Avoid crypto volatility. All contracts are settled in MNEE stablecoins.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-6 max-w-4xl mx-auto text-center">
          <div className="bg-blue-600 rounded-[64px] p-20 text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
             <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter italic leading-none">The era of payment disputes is over.</h2>
               <p className="text-blue-100 text-xl mb-12 font-medium">Zero monthly fees. 1% platform fee only on successful payouts.</p>
               <button 
                 onClick={onStart}
                 className="px-12 py-6 bg-white text-slate-900 text-lg font-black rounded-3xl hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
               >
                 Create Your First Invoice
               </button>
             </div>
             <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -ml-32 -mt-32"></div>
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-900/10 rounded-full blur-[100px] -mr-32 -mb-32"></div>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-bolt text-white"></i>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">PayFlow</span>
            </div>
            <p className="text-slate-400 max-w-sm font-medium">The world's first AI-driven escrow protocol designed for the future of decentralized work.</p>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Product</h4>
            <div className="flex flex-col gap-4 text-sm text-slate-500 font-medium">
              <button onClick={onHowItWorks} className="hover:text-blue-600 text-left">Protocol Specs</button>
              <button onClick={onFeatures} className="hover:text-blue-600 text-left">Tech Stack</button>
              <button onClick={onPricing} className="hover:text-blue-600 text-left">Pricing</button>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Company</h4>
            <div className="flex flex-col gap-4 text-sm text-slate-500 font-medium">
              <a href="#" className="hover:text-blue-600">About</a>
              <a href="#" className="hover:text-blue-600">Twitter</a>
              <a href="#" className="hover:text-blue-600">GitHub</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-xs text-slate-400 font-medium">© 2026 PayFlow. Built with Gemini AI & Ethereum.</p>
           <div className="flex gap-8 text-xs font-black text-slate-300 uppercase tracking-widest">
             <span>Mainnet v2.4.1</span>
             <span>Status: Operational</span>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: rotate(2deg) translateY(0); }
          50% { transform: rotate(2deg) translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: rotate(-6deg) translateY(0); }
          50% { transform: rotate(-6deg) translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
