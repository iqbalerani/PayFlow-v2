import { Router, Request, Response } from 'express';
import { verifySIWEMessage, findOrCreateUser, generateToken } from '../lib/auth';
import { validate, schemas } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

/**
 * POST /api/auth/verify
 * Verify SIWE signature and return JWT token
 */
router.post('/verify', validate(schemas.authVerify), async (req: Request, res: Response) => {
  try {
    const { message, signature } = req.body;

    // Verify SIWE signature
    const verification = await verifySIWEMessage(message, signature);

    if (!verification.success || !verification.address) {
      res.status(401).json({
        error: 'Invalid signature',
        message: verification.error
      });
      return;
    }

    // Find or create user
    const user = await findOrCreateUser(verification.address);

    // Generate JWT token
    const token = generateToken(user.id, user.walletAddress);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token (requires valid token)
 */
router.post('/refresh', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Generate new token
    const token = generateToken(req.user.id, req.user.walletAddress);

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authenticate, async (req: Request, res: Response) => {
  // In a JWT-based system, logout is typically handled client-side by removing the token
  // We could implement token blacklisting here if needed
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    res.json({
      user: {
        id: req.user.id,
        walletAddress: req.user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * POST /api/auth/test-login (DEVELOPMENT ONLY)
 * Test login without signature verification
 * WARNING: Only use in development environment
 */
if (process.env.NODE_ENV === 'development') {
  router.post('/test-login', async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.body;

      if (!walletAddress) {
        res.status(400).json({ error: 'Wallet address required' });
        return;
      }

      // Validate wallet address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        res.status(400).json({ error: 'Invalid wallet address format' });
        return;
      }

      // Find or create user
      const user = await findOrCreateUser(walletAddress);

      // Generate JWT token
      const token = generateToken(user.id, user.walletAddress);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          displayName: user.displayName,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Test login error:', error);
      res.status(500).json({
        error: 'Test login failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

export default router;
