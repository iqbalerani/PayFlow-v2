import { Request } from 'express';
import { InvoiceStatus, MilestoneStatus, TransactionType } from '@prisma/client';

// Re-export Prisma enums
export { InvoiceStatus, MilestoneStatus, TransactionType };

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    walletAddress: string;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Invoice creation DTO
export interface CreateInvoiceDTO {
  title: string;
  description: string;
  clientEmail?: string;
  clientName?: string;
  totalAmount: number;
  currency?: string;
  category?: string;
  milestones: CreateMilestoneDTO[];
}

export interface CreateMilestoneDTO {
  title: string;
  description?: string;
  amount: number;
  percentage: number;
}

// Update DTOs
export interface UpdateInvoiceDTO {
  title?: string;
  description?: string;
  status?: InvoiceStatus;
  clientEmail?: string;
  clientName?: string;
}

export interface UpdateMilestoneDTO {
  status?: MilestoneStatus;
  txHash?: string;
  paidAt?: Date;
  releasedAt?: Date;
}

export interface UpdateUserDTO {
  displayName?: string;
  email?: string;
  autoApproval?: boolean;
  emailNotify?: boolean;
}

// AI Generation types
export interface AIGenerateRequest {
  description: string;
}

export interface AIGenerateResponse {
  title: string;
  description: string;
  clientName?: string;
  totalAmount: number;
  currency?: string;
  category?: string;
  milestones: {
    title: string;
    description: string;
    amount: number;
    percentage: number;
  }[];
  suggestedMessage?: string;
}

// Blockchain event types
export interface BlockchainEvent {
  event: 'MilestoneDeposited' | 'MilestoneReleased' | 'MilestoneRefunded';
  invoiceId: string;
  milestoneIndex: number;
  amount: string;
  wallet: string;
  txHash: string;
  timestamp: number;
}

// Statistics types
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

// Query parameters
export interface InvoiceQueryParams {
  status?: InvoiceStatus;
  page?: number;
  limit?: number;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
}
