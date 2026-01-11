import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const NetworkIndicator: React.FC = () => {
  const { chainId, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const [showSuccess, setShowSuccess] = useState(true);

  const isCorrectNetwork = chainId === 11155111; // Sepolia
  const networkName = chainId === 1 ? 'Mainnet' : chainId === 11155111 ? 'Sepolia' : `Chain ${chainId}`;

  // Auto-hide success indicator after 5 seconds
  useEffect(() => {
    if (isCorrectNetwork && showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCorrectNetwork, showSuccess]);

  // Reset visibility when network changes
  useEffect(() => {
    if (isConnected) {
      setShowSuccess(true);
    }
  }, [chainId, isConnected]);

  if (!isConnected) return null;

  if (isCorrectNetwork && showSuccess) {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top duration-300">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-bold">
          Connected to {networkName}
        </span>
        <button
          onClick={() => setShowSuccess(false)}
          className="ml-2 text-green-600 hover:text-green-800 transition-colors"
          aria-label="Dismiss"
        >
          <i className="fa-solid fa-times text-sm"></i>
        </button>
      </div>
    );
  }

  if (isCorrectNetwork) {
    return null; // Hide when on correct network and dismissed
  }

  return (
    <div className="fixed top-4 right-4 bg-red-100 border-2 border-red-400 text-red-900 px-4 py-3 rounded-xl shadow-xl z-50 animate-in slide-in-from-top duration-300 max-w-md">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm mb-1">⚠️ Wrong Network!</p>
          <p className="text-xs mb-3">
            You're connected to <strong>{networkName}</strong>. PayFlow only works on <strong>Sepolia Testnet</strong>.
          </p>
          <button
            onClick={() => switchChain({ chainId: sepolia.id })}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg"
          >
            Switch to Sepolia Testnet
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkIndicator;
