import { create } from 'zustand';
import invoiceService, { CreateInvoiceData, InvoiceQueryParams } from '../services/invoiceService';
import { Invoice, MilestoneStatus } from '../types';

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;

  // Actions
  fetchInvoices: (params?: InvoiceQueryParams) => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  createInvoice: (data: CreateInvoiceData) => Promise<Invoice>;
  updateInvoice: (id: string, data: Partial<CreateInvoiceData>) => Promise<void>;
  cancelInvoice: (id: string) => Promise<void>;
  updateMilestone: (invoiceId: string, milestoneIndex: number, status: MilestoneStatus, txHash?: string) => Promise<void>;
  clearError: () => void;
  setCurrentInvoice: (invoice: Invoice | null) => void;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,

  fetchInvoices: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await invoiceService.getInvoices(params);
      set({
        invoices: response.invoices,
        total: response.total,
        page: response.page,
        limit: response.limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch invoices', isLoading: false });
    }
  },

  fetchInvoiceById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const invoice = await invoiceService.getInvoiceById(id);
      set({ currentInvoice: invoice, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch invoice', isLoading: false });
    }
  },

  createInvoice: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const invoice = await invoiceService.createInvoice(data);
      set((state) => ({
        invoices: [invoice, ...state.invoices],
        isLoading: false,
      }));
      return invoice;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create invoice', isLoading: false });
      throw error;
    }
  },

  updateInvoice: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedInvoice = await invoiceService.updateInvoice(id, data);
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv.id === id ? updatedInvoice : inv)),
        currentInvoice: state.currentInvoice?.id === id ? updatedInvoice : state.currentInvoice,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update invoice', isLoading: false });
      throw error;
    }
  },

  cancelInvoice: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await invoiceService.cancelInvoice(id);
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id),
        currentInvoice: state.currentInvoice?.id === id ? null : state.currentInvoice,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to cancel invoice', isLoading: false });
      throw error;
    }
  },

  updateMilestone: async (invoiceId, milestoneIndex, status, txHash) => {
    set({ isLoading: true, error: null });
    try {
      await invoiceService.updateMilestone(invoiceId, milestoneIndex, {
        status,
        ...(txHash && { txHash }),
        ...(status === 'PAID' && { paidAt: new Date().toISOString() }),
        ...(status === 'RELEASED' && { releasedAt: new Date().toISOString() }),
      });

      // Refetch the invoice to get updated data
      await get().fetchInvoiceById(invoiceId);
      await get().fetchInvoices();
    } catch (error: any) {
      set({ error: error.message || 'Failed to update milestone', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
}));
