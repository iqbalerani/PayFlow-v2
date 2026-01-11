import api from '../lib/api';
import { Invoice, InvoiceStatus, MilestoneStatus } from '../types';

export interface InvoiceQueryParams {
  status?: InvoiceStatus;
  page?: number;
  limit?: number;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateInvoiceData {
  id?: string; // Optional: pre-generated ID from blockchain creation
  title: string;
  description: string;
  totalAmount: number;
  currency?: string;
  category?: string;
  clientEmail?: string;
  clientName?: string;
  milestones: {
    title: string;
    description?: string;
    amount: number;
    percentage: number;
    index?: number;
  }[];
}

export interface UpdateMilestoneData {
  status?: MilestoneStatus;
  txHash?: string;
  paidAt?: string;
  releasedAt?: string;
}

class InvoiceService {
  /**
   * Get all invoices for authenticated user
   */
  async getInvoices(params?: InvoiceQueryParams): Promise<InvoicesResponse> {
    const response = await api.get<InvoicesResponse>('/invoices', { params });
    return response.data;
  }

  /**
   * Get single invoice by ID
   */
  async getInvoiceById(id: string): Promise<Invoice> {
    const response = await api.get<{ invoice: Invoice }>(`/invoices/${id}`);
    return response.data.invoice;
  }

  /**
   * Create new invoice
   */
  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    console.log('🌐 [invoiceService] Calling API POST /invoices');
    console.log('  Request data:', data);

    try {
      const response = await api.post<{ invoice: Invoice }>('/invoices', data);
      console.log('  API Response:', response);
      console.log('  Status:', response.status);
      console.log('  Invoice:', response.data.invoice);
      return response.data.invoice;
    } catch (error: any) {
      console.error('  ❌ API call failed:', error);
      console.error('  Response data:', error.response?.data);
      console.error('  Status:', error.response?.status);
      throw error;
    }
  }

  /**
   * Update invoice
   */
  async updateInvoice(id: string, data: Partial<CreateInvoiceData>): Promise<Invoice> {
    const response = await api.patch<{ invoice: Invoice }>(`/invoices/${id}`, data);
    return response.data.invoice;
  }

  /**
   * Cancel invoice (delete)
   */
  async cancelInvoice(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/invoices/${id}`);
    return response.data;
  }

  /**
   * Update milestone status
   */
  async updateMilestone(
    invoiceId: string,
    milestoneIndex: number,
    data: UpdateMilestoneData
  ): Promise<any> {
    const response = await api.patch(`/invoices/${invoiceId}/milestones/${milestoneIndex}`, data);
    return response.data;
  }

  /**
   * Get public invoice (no auth required)
   */
  async getPublicInvoice(id: string): Promise<Invoice> {
    const response = await api.get<{ invoice: Invoice }>(`/public/invoice/${id}`);
    return response.data.invoice;
  }

  /**
   * Register client wallet for invoice
   */
  async registerClient(invoiceId: string, walletAddress: string): Promise<void> {
    await api.post(`/public/invoice/${invoiceId}/register-client`, { walletAddress });
  }
}

export default new InvoiceService();
