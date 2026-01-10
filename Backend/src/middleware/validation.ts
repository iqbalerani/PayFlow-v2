import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Validation middleware factory
 * Validates request body, query, or params against a Zod schema
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      const validated = schema.parse(data);

      // Replace the original data with validated data
      if (source === 'body') req.body = validated;
      else if (source === 'query') req.query = validated;
      else req.params = validated;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      } else {
        res.status(500).json({ error: 'Validation error' });
      }
    }
  };
}

// Common validation schemas
export const schemas = {
  // Invoice creation
  createInvoice: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    clientEmail: z.string().email().optional(),
    clientName: z.string().min(2).max(100).optional(),
    totalAmount: z.number().positive(),
    currency: z.string().default('MNEE'),
    category: z.string().optional(),
    milestones: z.array(z.object({
      title: z.string().min(3).max(100),
      description: z.string().max(500).optional(),
      amount: z.number().positive(),
      percentage: z.number().int().min(1).max(100)
    })).min(1).max(10)
  }),

  // Update invoice
  updateInvoice: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).max(5000).optional(),
    status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
    clientEmail: z.string().email().optional(),
    clientName: z.string().min(2).max(100).optional()
  }),

  // Update user
  updateUser: z.object({
    displayName: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    autoApproval: z.boolean().optional(),
    emailNotify: z.boolean().optional()
  }),

  // AI generation
  aiGenerate: z.object({
    description: z.string().min(20).max(2000)
  }),

  // Auth verification
  authVerify: z.object({
    message: z.string(),
    signature: z.string()
  }),

  // Register client
  registerClient: z.object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
  }),

  // Update milestone
  updateMilestone: z.object({
    status: z.enum(['EMPTY', 'PAID', 'RELEASED', 'REFUNDED']).optional(),
    txHash: z.string().optional(),
    paidAt: z.string().datetime().optional(),
    releasedAt: z.string().datetime().optional()
  })
};
