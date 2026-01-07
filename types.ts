
export enum InvoiceStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MilestoneStatus {
  PENDING = 'pending',
  PAID = 'paid', // Paid into escrow
  RELEASED = 'released' // Released to freelancer
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  percentage: number;
  order: number;
  status: MilestoneStatus;
  paid_at?: string;
  released_at?: string;
}

export interface Invoice {
  id: string;
  freelancer_wallet: string;
  client_wallet: string | null;
  client_email: string | null;
  client_name: string;
  title: string;
  description: string;
  total_amount: number;
  currency: string;
  category: string;
  milestones: Milestone[];
  status: InvoiceStatus;
  created_at: string;
  escrow_contract?: string;
}

export type AppView = 'landing' | 'how-it-works' | 'features' | 'pricing' | 'auth' | 'dashboard' | 'create' | 'invoices' | 'details' | 'client-pay' | 'payments' | 'settings';

export interface AppState {
  view: AppView;
  selectedInvoiceId?: string;
  walletAddress: string | null;
  userType: 'freelancer' | 'client' | null;
}
