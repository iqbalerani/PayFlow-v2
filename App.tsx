
import React, { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './src/lib/wagmi';
import { AppView, AppState } from './types';
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
import Notifications from './components/Notifications';
import NetworkIndicator from './components/NetworkIndicator';
import { useAuthStore } from './src/store/authStore';
import { useInvoiceStore } from './src/store/invoiceStore';

// Create a client for React Query (required by wagmi)
const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading, initialize } = useAuthStore();
  const { fetchInvoices, currentInvoice, fetchInvoiceById } = useInvoiceStore();

  const [state, setState] = useState<AppState>({
    view: 'landing',
    walletAddress: null,
    userType: null
  });

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch invoices when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchInvoices();
      setState(prev => ({
        ...prev,
        walletAddress: user.walletAddress,
        userType: 'freelancer',
        view: prev.view === 'landing' || prev.view === 'auth' ? 'dashboard' : prev.view
      }));
    }
  }, [isAuthenticated, user, fetchInvoices]);

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

  const { logout: logoutStore } = useAuthStore();

  const logout = async () => {
    await logoutStore();
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

    // Fetch invoice details if navigating to details view
    if (view === 'details' && invoiceId) {
      fetchInvoiceById(invoiceId);
    }
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
          onSuccess={() => navigate('dashboard')}
        />
      );
    }

    if (state.view === 'client-pay' && state.selectedInvoiceId) {
      return (
        <ClientPayPage
          invoiceId={state.selectedInvoiceId}
        />
      );
    }

    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar activeView={state.view} onNavigate={navigate} onLogout={logout} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header walletAddress={state.walletAddress} displayName={user?.displayName} onDisconnect={logout} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {state.view === 'dashboard' && <Dashboard onNavigate={navigate} />}
            {state.view === 'create' && <CreateInvoice onNavigate={navigate} />}
            {state.view === 'invoices' && <InvoiceList onNavigate={navigate} />}
            {state.view === 'payments' && <PaymentsView />}
            {state.view === 'settings' && <SettingsView />}
            {state.view === 'details' && state.selectedInvoiceId && (
              <InvoiceDetails
                invoiceId={state.selectedInvoiceId}
                onBack={() => navigate('invoices')}
              />
            )}
          </main>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Notifications />
      <NetworkIndicator />
      {renderContent()}
    </div>
  );
};

// Wrap App with Web3 providers
const AppWithProviders = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default AppWithProviders;
