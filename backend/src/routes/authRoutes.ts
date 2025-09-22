import { Router, Request, Response } from 'express';
import { SiweMessage } from 'siwe';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// In-memory nonce store (replace with Redis or DB in production)
const nonceStore = new Map<string, string>();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

//
// ─── 1. Generate nonce ─────────────────────────────────────────────
//
router.get('/nonce', (_req, res) => {
  const nonce = (SiweMessage as any).generateNonce();
  nonceStore.set(nonce, nonce);
  res.json({ nonce });
});

//
// ─── 2. Verify SIWE message + issue JWT ────────────────────────────
//
router.post('/verify', async (req: Request, res: Response) => {
  const { message, signature } = req.body;

  try {
    const siweMessage = new SiweMessage(message) as any;
    const fields = await siweMessage.validate(signature);
    const { address, nonce } = fields;

    if (!nonceStore.has(nonce)) {
      return res.status(401).json({ error: 'Invalid nonce' });
    }

    nonceStore.delete(nonce);

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email: `${address}@wallet` },
      update: {},
      create: { email: `${address}@wallet` },
    });

    // Create or update wallet
    const wallet = await prisma.wallet.upsert({
      where: { address },
      update: {},
      create: {
        address,
        walletType: 'external',
        userId: user.id,
      },
    });

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, address },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ ok: true, user, wallet, token });
  } catch (e) {
    console.error('SIWE verification failed', e);
    res.status(401).json({ error: 'Invalid SIWE message or signature' });
  }
});

//
// ─── 3. Refresh token ──────────────────────────────────────────────
//
router.post('/refresh-token', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; address: string };

    const newToken = jwt.sign(
      { userId: decoded.userId, address: decoded.address },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token: newToken });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
});

//
// ─── 4. Get authenticated user ─────────────────────────────────────
//
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user!;

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

// routes/auth.ts

router.post('/email-login', async (req, res) => {
  const { email } = req.body

  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({ data: { email } })
  }

  const token = jwt.sign(
    {
      userId: user.id,
      address: '',         // optional
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.json({ token })
})



export default router;

