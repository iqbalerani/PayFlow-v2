import { prisma } from '../lib/prisma';
import { CreateInvoiceDTO, InvoiceQueryParams, UpdateInvoiceDTO } from '../types';
import { generateInvoiceId, generatePaymentLink, validateMilestonePercentages, validateMilestoneAmounts } from '../lib/utils';
import { InvoiceStatus } from '@prisma/client';

export class InvoiceService {
  /**
   * Create a new invoice with milestones
   */
  static async createInvoice(freelancerId: string, data: CreateInvoiceDTO) {
    // Validate milestones
    if (!validateMilestonePercentages(data.milestones)) {
      throw new Error('Milestone percentages must sum to 100');
    }

    if (!validateMilestoneAmounts(data.milestones, data.totalAmount)) {
      throw new Error('Milestone amounts must sum to total amount');
    }

    // Use provided ID from blockchain registration, or generate new one
    const invoiceId = data.id || generateInvoiceId();
    const paymentLink = generatePaymentLink(invoiceId);

    // Create invoice with milestones in transaction
    const invoice = await prisma.invoice.create({
      data: {
        id: invoiceId,
        freelancerId,
        title: data.title,
        description: data.description,
        clientEmail: data.clientEmail,
        clientName: data.clientName,
        totalAmount: data.totalAmount,
        currency: data.currency || 'MNEE',
        category: data.category,
        paymentLink,
        status: InvoiceStatus.PENDING,
        milestones: {
          create: data.milestones.map((milestone, index) => ({
            index,
            title: milestone.title,
            description: milestone.description,
            amount: milestone.amount,
            percentage: milestone.percentage,
            status: 'EMPTY'
          }))
        }
      },
      include: {
        milestones: {
          orderBy: { index: 'asc' }
        }
      }
    });

    return invoice;
  }

  /**
   * Get all invoices for a user with pagination and filtering
   */
  static async getInvoices(freelancerId: string, params: InvoiceQueryParams) {
    const { status, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      freelancerId,
      ...(status && { status })
    };

    // Exclude CANCELLED invoices by default unless explicitly requested
    if (!status) {
      where.status = { not: 'CANCELLED' };
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          milestones: {
            orderBy: { index: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.invoice.count({ where })
    ]);

    return {
      invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get a single invoice by ID
   */
  static async getInvoiceById(invoiceId: string, freelancerId?: string) {
    const where: any = { id: invoiceId };
    if (freelancerId) {
      where.freelancerId = freelancerId;
    }

    const invoice = await prisma.invoice.findFirst({
      where,
      include: {
        milestones: {
          orderBy: { index: 'asc' }
        },
        freelancer: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true
          }
        }
      }
    });

    return invoice;
  }

  /**
   * Update invoice details
   */
  static async updateInvoice(invoiceId: string, freelancerId: string, data: UpdateInvoiceDTO) {
    // Verify ownership
    const existing = await prisma.invoice.findFirst({
      where: { id: invoiceId, freelancerId }
    });

    if (!existing) {
      throw new Error('Invoice not found or unauthorized');
    }

    // Can only update certain fields based on status
    if (existing.status !== InvoiceStatus.PENDING && data.status !== InvoiceStatus.CANCELLED) {
      throw new Error('Cannot modify invoice that has been paid');
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.clientEmail && { clientEmail: data.clientEmail }),
        ...(data.clientName && { clientName: data.clientName }),
        ...(data.status && { status: data.status })
      },
      include: {
        milestones: {
          orderBy: { index: 'asc' }
        }
      }
    });

    return invoice;
  }

  /**
   * Cancel/delete invoice (only if PENDING)
   */
  static async cancelInvoice(invoiceId: string, freelancerId: string) {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, freelancerId }
    });

    if (!invoice) {
      throw new Error('Invoice not found or unauthorized');
    }

    if (invoice.status !== InvoiceStatus.PENDING) {
      throw new Error('Can only cancel pending invoices');
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.CANCELLED }
    });

    return { success: true };
  }

  /**
   * Register client wallet when they first pay
   */
  static async registerClient(invoiceId: string, walletAddress: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.clientWallet && invoice.clientWallet !== walletAddress.toLowerCase()) {
      throw new Error('Invoice already assigned to different client');
    }

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { clientWallet: walletAddress.toLowerCase() }
    });

    return updated;
  }
}
