import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { AuthRequest, InvoiceQueryParams } from '../types';
import { InvoiceService } from '../services/invoiceService';
import { serializeInvoice, serializeInvoiceList } from '../lib/serializers';
import crypto from 'crypto';

const router = Router();

/**
 * GET /api/invoices
 * Get all invoices for authenticated user
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const params: InvoiceQueryParams = {
      status: req.query.status as any,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };

    const result = await InvoiceService.getInvoices(req.user.id, params);

    res.json({
      ...result,
      invoices: serializeInvoiceList(result.invoices)
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

/**
 * POST /api/invoices
 * Create new invoice
 */
router.post('/', authenticate, validate(schemas.createInvoice), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const invoice = await InvoiceService.createInvoice(req.user.id, req.body);

    res.status(201).json({ invoice: serializeInvoice(invoice) });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(400).json({
      error: 'Failed to create invoice',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/invoices/:id
 * Get single invoice details
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const invoice = await InvoiceService.getInvoiceById(req.params.id, req.user.id);

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json({ invoice: serializeInvoice(invoice) });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

/**
 * PATCH /api/invoices/:id
 * Update invoice
 */
router.patch('/:id', authenticate, validate(schemas.updateInvoice), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const invoice = await InvoiceService.updateInvoice(req.params.id, req.user.id, req.body);

    res.json({ invoice: serializeInvoice(invoice) });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(400).json({
      error: 'Failed to update invoice',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/invoices/:id
 * Cancel invoice (only if PENDING)
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await InvoiceService.cancelInvoice(req.params.id, req.user.id);

    res.json(result);
  } catch (error) {
    console.error('Cancel invoice error:', error);
    res.status(400).json({
      error: 'Failed to cancel invoice',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PATCH /api/invoices/:id/milestones/:index
 * Update milestone status (typically called by blockchain listener)
 */
router.patch('/:id/milestones/:index', validate(schemas.updateMilestone), async (req: Response, res: Response) => {
  try {
    const { id, index } = req.params;
    const { status, txHash, paidAt, releasedAt } = req.body;

    // Get current milestone state before updating
    const currentMilestone = await prisma.milestone.findUnique({
      where: {
        invoiceId_index: {
          invoiceId: id,
          index: parseInt(index)
        }
      }
    });

    const milestone = await prisma.milestone.update({
      where: {
        invoiceId_index: {
          invoiceId: id,
          index: parseInt(index)
        }
      },
      data: {
        ...(status && { status }),
        ...(txHash && status === 'PAID' && { depositTxHash: txHash }),
        ...(txHash && status === 'RELEASED' && { releaseTxHash: txHash }),
        ...(paidAt && { paidAt: new Date(paidAt) }),
        ...(releasedAt && { releasedAt: new Date(releasedAt) })
      }
    });

    // Update invoice status if needed
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { milestones: true }
    });

    if (invoice) {
      const allReleased = invoice.milestones.every(m => m.status === 'RELEASED');
      const anyPaid = invoice.milestones.some(m => m.status === 'PAID' || m.status === 'RELEASED');

      if (allReleased && invoice.status !== 'COMPLETED') {
        await prisma.invoice.update({
          where: { id },
          data: { status: 'COMPLETED' }
        });
      } else if (anyPaid && invoice.status === 'PENDING') {
        await prisma.invoice.update({
          where: { id },
          data: { status: 'ACTIVE' }
        });
      }

      // Create transaction records when status changes
      const statusChanged = currentMilestone && currentMilestone.status !== status;

      if (statusChanged && status) {
        const mockTxHash = txHash || `0x${crypto.randomBytes(32).toString('hex')}`;

        if (status === 'PAID') {
          // Create DEPOSIT transaction (client → escrow)
          await prisma.transaction.create({
            data: {
              invoiceId: id,
              milestoneIdx: parseInt(index),
              type: 'DEPOSIT',
              amount: milestone.amount,
              fromWallet: invoice.clientWallet || 'UNKNOWN',
              toWallet: invoice.escrowContract || 'ESCROW_CONTRACT',
              txHash: mockTxHash
            }
          });
        } else if (status === 'RELEASED') {
          // Create RELEASE transaction (escrow → freelancer)
          await prisma.transaction.create({
            data: {
              invoiceId: id,
              milestoneIdx: parseInt(index),
              type: 'RELEASE',
              amount: milestone.amount,
              fromWallet: invoice.escrowContract || 'ESCROW_CONTRACT',
              toWallet: invoice.freelancerWallet || 'UNKNOWN',
              txHash: mockTxHash
            }
          });
        }
      }
    }

    res.json({ milestone });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(400).json({ error: 'Failed to update milestone' });
  }
});

// Import prisma for milestone update route
import { prisma } from '../lib/prisma';

export default router;
