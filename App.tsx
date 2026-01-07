
import React, { useState, useEffect } from 'react';
import { AppView, Invoice, InvoiceStatus, MilestoneStatus, AppState } from './types';
import LandingPage from './components/LandingPage';
import HowItWorks from './components/HowItWorks';
import FeaturesPage from './components/FeaturesPage';
import PricingPage from './components/PricingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import CreateInvoice from './components/CreateInvoice';
import InvoiceList from './components/InvoiceList';
import InvoiceDetails from './components/InvoiceDetails';
import ClientPayPage from './components/ClientPayPage';
import PaymentsView from './components/PaymentsView';
import SettingsView from './components/SettingsView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Mock Initial Data
const INITIAL_INVOICES: Invoice[] = [
  {
    id: "INV-2026-041",
    freelancer_wallet: "0x1a2b3c4d5e6f",
    client_wallet: "0x9c8d7e6f5a4b",
    client_email: "sara@tech.io",
    client_name: "Sara Tech",
    title: "Website Development - Frontend",
    description: "Responsive React frontend for SaaS landing page.",
    total_amount: 1200,
    currency: "MNEE",
    category: "Development",
    status: InvoiceStatus.ACTIVE,
    created_at: "2026-01-03T10:00:00Z",
    milestones: [
      { id: "MS-1", title: "Upfront", description: "Project kick-off", amount: 360, percentage: 30, order: 1, status: MilestoneStatus.RELEASED, released_at: "2026-01-03T11:00:00Z" },
      { id: "MS-2", title: "Homepage Complete", description: "Design to HTML/CSS", amount: 480, percentage: 40, order: 2, status: MilestoneStatus.RELEASED, released_at: "2026-01-05T15:00:00Z" },
      { id: "MS-3", title: "Final Delivery", description: "Deployment and testing", amount: 360, percentage: 30, order: 3, status: MilestoneStatus.PAID, paid_at: "2026-01-05T10:00:00Z" }
    ]
  },
  {
    id: "INV-2026-038",
    freelancer_wallet: "0x1a2b3c4d5e6f",
    client_wallet: "0x7f8e9a2b1c3d",
    client_email: "hr@techflow.com",
    client_name: "TechFlow Inc",
    title: "Mobile App UI Design",
    description: "Design system and 10 screens for iOS app.",
    total_amount: 650,
    currency: "MNEE",
    category: "Design",
    status: InvoiceStatus.COMPLETED,
    created_at: "2025-12-28T09:00:00Z",
    milestones: [
      { id: "MS-1", title: "Final Delivery", description: "Figma files handoff", amount: 650, percentage: 100, order: 1, status: MilestoneStatus.RELEASED, released_at: "2026-01-02T12:00:00Z" }
    ]
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'landing',
    walletAddress: null,
    userType: null
  });

  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  // Simple Hash Routing Simulation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      // We only care about pay/ routing. 
      if (hash.startsWith('pay/')) {
        const id = hash.split('/')[1];
        setState(prev => ({ ...prev, view: 'client-pay', selectedInvoiceId: id, userType: 'client' }));
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const connectWallet = (type: 'freelancer' | 'client' = 'freelancer') => {
    setState(prev => ({ 
      ...prev, 
      walletAddress: "0x1a2b" + Math.random().toString(16).slice(2, 10),
      userType: type,
      view: type === 'freelancer' ? 'dashboard' : prev.view
    }));
  };

  const logout = () => {
    setState({ view: 'landing', walletAddress: null, userType: null });
    window.location.hash = '';
  };

  const navigate = (view: AppView, invoiceId?: string) => {
    setState(prev => ({ ...prev, view, selectedInvoiceId: invoiceId }));
    if (view === 'client-pay' && invoiceId) {
      window.location.hash = `pay/${invoiceId}`;
    } else {
      if (window.location.hash.startsWith('#pay/')) {
        window.location.hash = '';
      }
    }
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const updateMilestone = (invoiceId: string, milestoneId: string, status: MilestoneStatus) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const updatedMilestones = inv.milestones.map(ms => 
          ms.id === milestoneId ? { ...ms, status, released_at: status === MilestoneStatus.RELEASED ? new Date().toISOString() : ms.released_at } : ms
        );
        const allReleased = updatedMilestones.every(m => m.status === MilestoneStatus.RELEASED);
        const anyPaid = updatedMilestones.some(m => m.status === MilestoneStatus.PAID || m.status === MilestoneStatus.RELEASED);
        
        return {
          ...inv,
          milestones: updatedMilestones,
          status: allReleased ? InvoiceStatus.COMPLETED : (anyPaid ? InvoiceStatus.ACTIVE : inv.status)
        };
      }
      return inv;
    }));
  };

  const renderContent = () => {
    if (state.view === 'landing') {
      return (
        <LandingPage 
          onStart={() => navigate('auth')} 
          onHowItWorks={() => navigate('how-it-works')}
          onFeatures={() => navigate('features')}
          onPricing={() => navigate('pricing')}
        />
      );
    }

    if (state.view === 'how-it-works') {
      return (
        <HowItWorks 
          onBack={() => navigate('landing')} 
          onStart={() => navigate('auth')}
        />
      );
    }

    if (state.view === 'features') {
      return (
        <FeaturesPage 
          onBack={() => navigate('landing')} 
          onStart={() => navigate('auth')}
        />
      );
    }

    if (state.view === 'pricing') {
      return (
        <PricingPage 
          onBack={() => navigate('landing')} 
          onStart={() => navigate('auth')}
        />
      );
    }

    if (state.view === 'auth') {
      return (
        <AuthPage 
          onBack={() => navigate('landing')}
          onSuccess={(type) => connectWallet(type)}
        />
      );
    }

    if (state.view === 'client-pay' && state.selectedInvoiceId) {
      const invoice = invoices.find(i => i.id === state.selectedInvoiceId);
      return (
        <ClientPayPage 
          invoice={invoice} 
          walletConnected={!!state.walletAddress}
          onConnect={() => connectWallet('client')} // Inline connection now
          onPay={(msId) => updateMilestone(state.selectedInvoiceId!, msId, MilestoneStatus.PAID)}
          onApprove={(msId) => updateMilestone(state.selectedInvoiceId!, msId, MilestoneStatus.RELEASED)}
        />
      );
    }

    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar activeView={state.view} onNavigate={navigate} onLogout={logout} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header walletAddress={state.walletAddress} onDisconnect={logout} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {state.view === 'dashboard' && <Dashboard invoices={invoices} onNavigate={navigate} />}
            {state.view === 'create' && <CreateInvoice walletAddress={state.walletAddress!} onCreated={addInvoice} onNavigate={navigate} />}
            {state.view === 'invoices' && <InvoiceList invoices={invoices} onNavigate={navigate} />}
            {state.view === 'payments' && <PaymentsView invoices={invoices} />}
            {state.view === 'settings' && <SettingsView walletAddress={state.walletAddress} />}
            {state.view === 'details' && (
              <InvoiceDetails 
                invoice={invoices.find(i => i.id === state.selectedInvoiceId)} 
                onBack={() => navigate('invoices')}
                onUpdateMilestone={updateMilestone}
              />
            )}
          </main>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};

export default App;
