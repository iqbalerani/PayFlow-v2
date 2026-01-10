import jwt from 'jsonwebtoken';
import { SiweMessage } from 'siwe';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// JWT payload interface
interface JWTPayload {
  userId: string;
  walletAddress: string;
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(userId: string, walletAddress: string): string {
  const payload: JWTPayload = { userId, walletAddress };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify SIWE (Sign-In With Ethereum) message signature
 */
export async function verifySIWEMessage(
  message: string,
  signature: string
): Promise<{ success: boolean; address?: string; error?: string }> {
  try {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });

    if (fields.success) {
      return {
        success: true,
        address: siweMessage.address
      };
    } else {
      return {
        success: false,
        error: 'Invalid signature'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Find or create user by wallet address
 */
export async function findOrCreateUser(walletAddress: string) {
  let user = await prisma.user.findUnique({
    where: { walletAddress: walletAddress.toLowerCase() }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress: walletAddress.toLowerCase()
      }
    });
  }

  return user;
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}
