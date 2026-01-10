import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { BlockchainEvent } from '../types';

const router = Router();

/**
 * POST /api/webhooks/blockchain
 * Handle blockchain events from listener service
 *
 * This endpoint receives events from the blockchain listener and updates the database
 */
router.post('/blockchain', async (req: Request, res: Response) => {
  try {
    // In production, verify webhook signature/secret
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      res.status(401).json({ error: 'Invalid webhook secret' });
      return;
    }

    const event: BlockchainEvent = req.body;

    switch (event.event) {
      case 'MilestoneDeposited':
        await handleMilestoneDeposited(event);
        break;
      case 'MilestoneReleased':
        await handleMilestoneReleased(event);
        break;
      case 'MilestoneRefunded':
        await handleMilestoneRefunded(event);
        break;
      default:
        res.status(400).json({ error: 'Unknown event type' });
        return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

async function handleMilestoneDeposited(event: BlockchainEvent) {
  // Update milestone status to PAID
  await prisma.milestone.update({
    where: {
      invoiceId_index: {
        invoiceId: event.invoiceId,
        index: event.milestoneIndex
      }
    },
    data: {
      status: 'PAID',
      paidAt: new Date(event.timestamp * 1000),
      depositTxHash: event.txHash
    }
  });

  // Update invoice status to ACTIVE if it was PENDING
  const invoice = await prisma.invoice.findUnique({
    where: { id: event.invoiceId }
  });

  if (invoice && invoice.status === 'PENDING') {
    await prisma.invoice.update({
      where: { id: event.invoiceId },
      data: { status: 'ACTIVE' }
    });
  }

  // Create transaction record
  await prisma.transaction.create({
    data: {
      invoiceId: event.invoiceId,
      milestoneIdx: event.milestoneIndex,
      type: 'DEPOSIT',
      amount: event.amount,
      fromWallet: event.wallet,
      toWallet: process.env.PAYFLOW_ESCROW_ADDRESS || '0x0',
      txHash: event.txHash
    }
  });

  console.log(`✅ Milestone deposited: ${event.invoiceId}[${event.milestoneIndex}]`);
}

async function handleMilestoneReleased(event: BlockchainEvent) {
  // Get the milestone to find the invoice freelancer
  const milestone = await prisma.milestone.findUnique({
    where: {
      invoiceId_index: {
        invoiceId: event.invoiceId,
        index: event.milestoneIndex
      }
    },
    include: {
      invoice: {
        select: {
          freelancerId: true,
          freelancer: {
            select: {
              walletAddress: true
            }
          }
        }
      }
    }
  });

  if (!milestone) {
    throw new Error('Milestone not found');
  }

  // Update milestone status to RELEASED
  await prisma.milestone.update({
    where: {
      invoiceId_index: {
        invoiceId: event.invoiceId,
        index: event.milestoneIndex
      }
    },
    data: {
      status: 'RELEASED',
      releasedAt: new Date(event.timestamp * 1000),
      releaseTxHash: event.txHash
    }
  });

  // Check if all milestones are released
  const allMilestones = await prisma.milestone.findMany({
    where: { invoiceId: event.invoiceId }
  });

  const allReleased = allMilestones.every(m => m.status === 'RELEASED');

  if (allReleased) {
    await prisma.invoice.update({
      where: { id: event.invoiceId },
      data: { status: 'COMPLETED' }
    });
  }

  // Create transaction record
  await prisma.transaction.create({
    data: {
      invoiceId: event.invoiceId,
      milestoneIdx: event.milestoneIndex,
      type: 'RELEASE',
      amount: event.amount,
      fromWallet: process.env.PAYFLOW_ESCROW_ADDRESS || '0x0',
      toWallet: milestone.invoice.freelancer.walletAddress,
      txHash: event.txHash
    }
  });

  console.log(`✅ Milestone released: ${event.invoiceId}[${event.milestoneIndex}]`);
}

async function handleMilestoneRefunded(event: BlockchainEvent) {
  // Update milestone status to REFUNDED
  await prisma.milestone.update({
    where: {
      invoiceId_index: {
        invoiceId: event.invoiceId,
        index: event.milestoneIndex
      }
    },
    data: {
      status: 'REFUNDED'
    }
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      invoiceId: event.invoiceId,
      milestoneIdx: event.milestoneIndex,
      type: 'REFUND',
      amount: event.amount,
      fromWallet: process.env.PAYFLOW_ESCROW_ADDRESS || '0x0',
      toWallet: event.wallet,
      txHash: event.txHash
    }
  });

  console.log(`✅ Milestone refunded: ${event.invoiceId}[${event.milestoneIndex}]`);
}

export default router;
