import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken, extractTokenFromHeader } from '../lib/auth';

/**
 * Authentication middleware
 * Validates JWT token and attaches user to request
 */
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Attach user to request
    req.user = {
      id: payload.userId,
      walletAddress: payload.walletAddress
    };

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
}

/**
 * Optional authentication middleware
 * Similar to authenticate but doesn't fail if no token is present
 */
export function optionalAuthenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = {
          id: payload.userId,
          walletAddress: payload.walletAddress
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
}
