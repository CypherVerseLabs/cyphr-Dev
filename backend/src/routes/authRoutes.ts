import { Router, Request, Response } from 'express';
import { SiweMessage, generateNonce } from 'siwe';
import jwt from 'jsonwebtoken';

import prisma from '../lib/prisma';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
const nonceStore = new Map<string, string>();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

//
// ─── 1. Generate Nonce ─────────────────────────────────────────────
//
router.get('/nonce', (_req, res) => {
  const nonce = generateNonce();
  nonceStore.set(nonce, nonce);
  res.json({ nonce });
});

//
// ─── 2. Verify SIWE message + issue JWT ────────────────────────────
//
router.post('/verify', async (req: Request, res: Response) => {
  const { message, signature } = req.body;

  if (!message || !signature) {
    return res.status(400).json({ error: 'Message and signature are required' });
  }

  try {
    const siweMessage = new SiweMessage(message);
    const domain = req.headers.host!;
    const nonce = siweMessage.nonce;

    const { success, data } = await siweMessage.verify({
      signature,
      domain,
      nonce,
    });

    if (!success || !data.address || !nonceStore.has(nonce)) {
      return res.status(401).json({ error: 'SIWE verification failed or nonce invalid' });
    }

    nonceStore.delete(nonce); // prevent replay attacks

    const normalizedAddress = data.address.toLowerCase();
    const email = `${normalizedAddress}@wallet`;

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Upsert wallet
    const wallet = await prisma.wallet.upsert({
      where: { address: normalizedAddress },
      update: {},
      create: {
        address: normalizedAddress,
        walletType: 'external',
        userId: user.id,
      },
    });

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, address: normalizedAddress, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ ok: true, user, wallet, token });
  } catch (e) {
    console.error('SIWE verification failed:', e);
    return res.status(401).json({ error: 'Invalid SIWE message or signature' });
  }
});

//
// ─── 3. Refresh JWT Token ──────────────────────────────────────────
//
router.post('/refresh-token', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      address: string;
      isAdmin?: boolean;
    };

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return res.status(403).json({ error: 'Invalid token structure' });
    }

    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        address: decoded.address,
        isAdmin: decoded.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token: newToken });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
});

//
// ─── 4. Get Authenticated User ─────────────────────────────────────
//
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.jwtUser?.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallets: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//
// ─── 5. Email-based Auth (Optional) ────────────────────────────────
//
router.post('/email-login', async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({ data: { email } });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
});

export default router;
