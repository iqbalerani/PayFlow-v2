import { Router, Request, Response } from 'express';
import { validate, schemas } from '../middleware/validation';
import { InvoiceService } from '../services/invoiceService';
import { serializeInvoice } from '../lib/serializers';

const router = Router();

/**
 * GET /api/public/invoice/:id
 * Get invoice details for payment page (no auth required)
 */
router.get('/invoice/:id', async (req: Request, res: Response) => {
  try {
    const invoice = await InvoiceService.getInvoiceById(req.params.id);

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Return public-safe invoice data
    res.json({
      invoice: serializeInvoice(invoice)
    });
  } catch (error) {
    console.error('Get public invoice error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

/**
 * POST /api/public/invoice/:id/register-client
 * Register client wallet address for invoice
 */
router.post('/invoice/:id/register-client', validate(schemas.registerClient), async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;

    await InvoiceService.registerClient(req.params.id, walletAddress);

    res.json({
      success: true,
      message: 'Client wallet registered'
    });
  } catch (error) {
    console.error('Register client error:', error);
    res.status(400).json({
      error: 'Failed to register client',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
