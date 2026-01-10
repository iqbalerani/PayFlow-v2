import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { AuthRequest } from '../types';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/user
 * Get current user profile
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        walletAddress: true,
        displayName: true,
        email: true,
        autoApproval: true,
        emailNotify: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * PATCH /api/user
 * Update user profile
 */
router.patch('/', authenticate, validate(schemas.updateUser), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { displayName, email, autoApproval, emailNotify } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(email !== undefined && { email }),
        ...(autoApproval !== undefined && { autoApproval }),
        ...(emailNotify !== undefined && { emailNotify })
      },
      select: {
        id: true,
        walletAddress: true,
        displayName: true,
        email: true,
        autoApproval: true,
        emailNotify: true,
        updatedAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * DELETE /api/user
 * Delete user account (soft delete - just removes personal info)
 */
router.delete('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if user has any active invoices
    const activeInvoices = await prisma.invoice.count({
      where: {
        freelancerId: req.user.id,
        status: {
          in: ['PENDING', 'ACTIVE']
        }
      }
    });

    if (activeInvoices > 0) {
      res.status(400).json({
        error: 'Cannot delete account with active invoices',
        message: `You have ${activeInvoices} active invoice(s). Please complete or cancel them first.`
      });
      return;
    }

    // Soft delete: remove personal information
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        displayName: null,
        email: null,
        emailNotify: false
      }
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
