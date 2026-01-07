
import React, { useState } from 'react';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: (type: 'freelancer' | 'client') => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletConnect = () => {
    setIsConnecting(true);
    // Simulate wallet connection delay
    setTimeout(() => {
      setIsConnecting(false);
      onSuccess('freelancer');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6 font-['Inter'] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[1000px] bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row overflow-hidden relative z-10">
        
        {/* Left Side: Brand & Value Prop (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-[45%] bg-slate-900 p-12 flex-col justify-between text-white relative">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-bolt text-white"></i>
              </div>
              <span className="text-xl font-black tracking-tighter">PayFlow</span>
            </div>
            
            <h2 className="text-4xl font-black leading-tight mb-6">
              The future of <span className="text-blue-500 italic">secure</span> freelance payments.
            </h2>
            
            <ul className="space-y-6">
              {[
                { icon: 'fa-shield-halved', text: 'Trustless Escrow Protocol' },
                { icon: 'fa-wand-magic-sparkles', text: 'AI-Generated Contracts' },
                { icon: 'fa-bolt', text: 'Instant Stablecoin Settlement' }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-400 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500 text-sm">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-12 border-t border-white/10">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Trusted by creators at</p>
            <div className="flex gap-6 opacity-30 grayscale contrast-200">
               <span className="text-sm font-black italic">VERCEL</span>
               <span className="text-sm font-black italic">STRIPE</span>
               <span className="text-sm font-black italic">LINEAR</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex-1 p-8 md:p-16">
          <button 
            onClick={onBack}
            className="md:hidden mb-8 text-slate-400 font-bold text-sm flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {mode === 'login' ? 'Welcome back' : 'Join the protocol'}
            </h1>
            <p className="text-slate-500 font-medium">
              {mode === 'login' ? 'Sign in to manage your active escrows.' : 'Start protecting your freelance income today.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Create Account
            </button>
          </div>

          {/* Primary Action: Wallet Connect */}
          <div className="space-y-4">
            <button 
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {isConnecting ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-wallet"></i>
              )}
              {mode === 'login' ? 'Connect Wallet to Sign In' : 'Sign Up with Wallet'}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleWalletConnect} className="py-3.5 border border-slate-200 rounded-2xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <i className="fa-solid fa-link"></i> WalletConnect
              </button>
              <button onClick={handleWalletConnect} className="py-3.5 border border-slate-200 rounded-2xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <i className="fa-solid fa-shield text-blue-500"></i> Coinbase
              </button>
            </div>
          </div>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest">or continue with email</span>
          </div>

          {/* Social / Email (Mock) */}
          <div className="space-y-4">
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="email" 
                placeholder="name@company.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all">
              {mode === 'login' ? 'Continue' : 'Create Account'}
            </button>
          </div>

          <p className="mt-10 text-center text-xs text-slate-400 font-medium">
            By continuing, you agree to our <a href="#" className="text-slate-900 underline font-bold">Terms of Service</a> and <a href="#" className="text-slate-900 underline font-bold">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Mobile Back Button Floating */}
      <button 
        onClick={onBack}
        className="hidden md:flex fixed top-10 left-10 w-12 h-12 bg-white rounded-2xl shadow-xl items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
  );
};

export default AuthPage;
