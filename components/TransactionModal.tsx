import React from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'idle' | 'approving' | 'pending' | 'confirming' | 'success' | 'error';
  txHash?: string;
  error?: string;
  title?: string;
  description?: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  status,
  txHash,
  error,
  title = 'Transaction',
  description,
}) => {
  if (!isOpen) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'approving':
        return {
          icon: 'fa-shield-halved',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          title: 'Approve MNEE',
          subtitle: 'Confirm the approval in your wallet',
          showSpinner: true,
        };
      case 'pending':
        return {
          icon: 'fa-clock',
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-50',
          title: 'Transaction Pending',
          subtitle: 'Waiting for confirmation...',
          showSpinner: true,
        };
      case 'confirming':
        return {
          icon: 'fa-hourglass-half',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          title: 'Confirming Transaction',
          subtitle: 'This may take a few moments',
          showSpinner: true,
        };
      case 'success':
        return {
          icon: 'fa-circle-check',
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          title: 'Transaction Successful!',
          subtitle: 'Your transaction has been confirmed',
          showSpinner: false,
        };
      case 'error':
        return {
          icon: 'fa-circle-xmark',
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          title: 'Transaction Failed',
          subtitle: error || 'Something went wrong',
          showSpinner: false,
        };
      default:
        return {
          icon: 'fa-wallet',
          iconColor: 'text-slate-500',
          bgColor: 'bg-slate-50',
          title: title,
          subtitle: description || '',
          showSpinner: false,
        };
    }
  };

  const config = getStatusConfig();
  const canClose = status === 'success' || status === 'error' || status === 'idle';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={canClose ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close button (only show when transaction is complete) */}
        {canClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        )}

        {/* Icon */}
        <div className={`w-20 h-20 ${config.bgColor} rounded-[24px] flex items-center justify-center mx-auto mb-6 relative`}>
          {config.showSpinner && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full border-4 border-transparent border-t-blue-500 rounded-[24px] animate-spin" />
            </div>
          )}
          <i className={`fa-solid ${config.icon} text-3xl ${config.iconColor}`}></i>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-slate-900 mb-2">{config.title}</h3>
          <p className="text-sm text-slate-500 font-medium">{config.subtitle}</p>
        </div>

        {/* Transaction Hash Link */}
        {txHash && status === 'success' && (
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-center text-xs font-bold text-slate-600 transition-colors mb-4"
          >
            <i className="fa-solid fa-arrow-up-right-from-square mr-2"></i>
            View on Etherscan
          </a>
        )}

        {/* Actions */}
        {status === 'success' && (
          <button
            onClick={onClose}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            Done
          </button>
        )}

        {status === 'error' && (
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all"
          >
            Close
          </button>
        )}

        {/* Loading state message */}
        {(status === 'pending' || status === 'confirming' || status === 'approving') && (
          <div className="text-center">
            <p className="text-xs text-slate-400 font-medium">
              Do not close this window
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;
