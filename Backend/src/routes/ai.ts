import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { AuthRequest } from '../types';
import { AIService } from '../services/aiService';

const router = Router();

/**
 * POST /api/ai/generate
 * Generate invoice from natural language description
 */
router.post('/generate', authenticate, validate(schemas.aiGenerate), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { description } = req.body;

    const invoiceData = await AIService.generateInvoice(description);

    res.json(invoiceData);
  } catch (error) {
    console.error('AI generate error:', error);
    res.status(500).json({
      error: 'Failed to generate invoice',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/ai/message
 * Generate professional message for client
 */
router.post('/message', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { invoiceTitle, clientName, totalAmount, type } = req.body;

    if (!invoiceTitle || !clientName || !totalAmount) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const message = await AIService.generateMessage(
      invoiceTitle,
      clientName,
      totalAmount,
      type || 'payment_request'
    );

    res.json({ message });
  } catch (error) {
    console.error('AI message error:', error);
    res.status(500).json({
      error: 'Failed to generate message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
