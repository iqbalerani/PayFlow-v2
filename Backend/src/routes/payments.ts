import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { AuthRequest, PaymentStats } from '../types';
import { prisma } from '../lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();

/**
 * GET /api/payments
 * Get transaction history
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Get all transactions for user's invoices
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          invoice: {
            freelancerId: req.user.id
          }
        },
        include: {
          invoice: {
            select: {
              id: true,
              title: true,
              clientName: true,
              clientWallet: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({
        where: {
          invoice: {
            freelancerId: req.user.id
          }
        }
      })
    ]);

    res.json({
      transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * GET /api/payments/escrow
 * Get escrow balance summary
 */
router.get('/escrow', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get all PAID milestones (in escrow) for user's invoices
    const paidMilestones = await prisma.milestone.findMany({
      where: {
        invoice: {
          freelancerId: req.user.id
        },
        status: 'PAID'
      },
      select: {
        amount: true
      }
    });

    // Get all RELEASED milestones (total released) for user's invoices
    const releasedMilestones = await prisma.milestone.findMany({
      where: {
        invoice: {
          freelancerId: req.user.id
        },
        status: 'RELEASED'
      },
      select: {
        amount: true
      }
    });

    const balance = paidMilestones.reduce(
      (sum, m) => sum + parseFloat(m.amount.toString()),
      0
    );

    const totalReleased = releasedMilestones.reduce(
      (sum, m) => sum + parseFloat(m.amount.toString()),
      0
    );

    res.json({
      balance: balance.toFixed(2),
      totalReleased: totalReleased.toFixed(2),
      milestoneCount: paidMilestones.length
    });
  } catch (error) {
    console.error('Get escrow balance error:', error);
    res.status(500).json({ error: 'Failed to fetch escrow balance' });
  }
});

/**
 * GET /api/payments/stats
 * Get payment statistics for dashboard
 */
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const period = (req.query.period as string) || 'month';

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get all user's invoices (excluding cancelled)
    const invoices = await prisma.invoice.findMany({
      where: {
        freelancerId: req.user.id,
        status: { not: 'CANCELLED' }
      },
      include: {
        milestones: true
      }
    });

    // Calculate total earned (all RELEASED milestones)
    const totalEarned = invoices.reduce((sum, inv) => {
      return sum + inv.milestones
        .filter(m => m.status === 'RELEASED')
        .reduce((mSum, m) => mSum + parseFloat(m.amount.toString()), 0);
    }, 0);

    // Calculate in escrow (all PAID milestones)
    const inEscrow = invoices.reduce((sum, inv) => {
      return sum + inv.milestones
        .filter(m => m.status === 'PAID')
        .reduce((mSum, m) => mSum + parseFloat(m.amount.toString()), 0);
    }, 0);

    // Calculate pending amount (all EMPTY milestones)
    const pendingAmount = invoices.reduce((sum, inv) => {
      return sum + inv.milestones
        .filter(m => m.status === 'EMPTY')
        .reduce((mSum, m) => mSum + parseFloat(m.amount.toString()), 0);
    }, 0);

    // Count invoices by status
    const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING').length;
    const activeInvoices = invoices.filter(inv => inv.status === 'ACTIVE').length;
    const completedInvoices = invoices.filter(inv => inv.status === 'COMPLETED').length;
    const totalInvoices = invoices.length;

    // Calculate completion rate (percentage of total value that's been released)
    const totalValue = totalEarned + inEscrow + pendingAmount;
    const completionRate = totalValue > 0
      ? parseFloat(((totalEarned / totalValue) * 100).toFixed(1))
      : 0;

    // Count completed in current period
    const completedThisMonth = invoices.filter(inv =>
      inv.status === 'COMPLETED' &&
      new Date(inv.updatedAt) >= startDate
    ).length;

    // Calculate previous period for comparison
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate() - (now.getDate() - startDate.getDate()));

    const completedLastMonth = invoices.filter(inv =>
      inv.status === 'COMPLETED' &&
      new Date(inv.updatedAt) >= previousStartDate &&
      new Date(inv.updatedAt) < startDate
    ).length;

    const percentChange = completedLastMonth > 0
      ? parseFloat(((completedThisMonth - completedLastMonth) / completedLastMonth * 100).toFixed(1))
      : 0;

    const stats: PaymentStats = {
      totalEarned: totalEarned.toFixed(2),
      inEscrow: inEscrow.toFixed(2),
      pendingAmount: pendingAmount.toFixed(2),
      pendingInvoices,
      activeInvoices,
      completedInvoices,
      totalInvoices,
      completionRate,
      completedThisMonth,
      percentChange
    };

    res.json(stats);
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ error: 'Failed to fetch payment statistics' });
  }
});

export default router;
