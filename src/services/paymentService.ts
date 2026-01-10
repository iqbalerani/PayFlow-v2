import api from '../lib/api';

export interface Transaction {
  id: string;
  invoiceId: string;
  milestoneIdx: number;
  type: 'DEPOSIT' | 'RELEASE' | 'REFUND';
  amount: string;
  fromWallet: string;
  toWallet: string;
  txHash: string;
  createdAt: string;
  invoice?: {
    id: string;
    title: string;
    clientName?: string;
    clientWallet?: string;
  };
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EscrowBalance {
  balance: string;
  totalReleased: string;
  milestoneCount: number;
}

export interface PaymentStats {
  totalEarned: string;
  inEscrow: string;
  pendingAmount: string;
  pendingInvoices: number;
  activeInvoices: number;
  completedInvoices: number;
  totalInvoices: number;
  completionRate: number;
  completedThisMonth: number;
  percentChange: number;
}

class PaymentService {
  /**
   * Get transaction history
   */
  async getTransactions(page = 1, limit = 20): Promise<TransactionsResponse> {
    const response = await api.get<TransactionsResponse>('/payments', {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get escrow balance summary
   */
  async getEscrowBalance(): Promise<EscrowBalance> {
    const response = await api.get<EscrowBalance>('/payments/escrow');
    return response.data;
  }

  /**
   * Get payment statistics for dashboard
   */
  async getStats(period: 'week' | 'month' | 'year' = 'month'): Promise<PaymentStats> {
    const response = await api.get<PaymentStats>('/payments/stats', {
      params: { period },
    });
    return response.data;
  }
}

export default new PaymentService();
