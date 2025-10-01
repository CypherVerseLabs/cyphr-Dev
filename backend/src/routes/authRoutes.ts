import { Router, Request, Response } from 'express';
import { SiweMessage, generateNonce } from 'siwe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid'
import rateLimit from 'express-rate-limit';

import prisma from '../lib/prisma';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
const nonceStore = new Map<string, string>();
const generateOTP = customAlphabet('0123456789', 6)

const otpRequestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  message: 'Too many OTP requests, please try again later',
});

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
// ─── 5. Email-only login (fallback) ────────────────────────────────
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

//
// ─── 6. Register with Email + Password ─────────────────────────────
//
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser && existingUser.password) {
    return res.status(400).json({ error: 'User already exists with email/password' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: '7d' });

  res.json({ token, user });
});

//
// ─── 7. Login with Email + Password ────────────────────────────────
//
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, isAdmin: user.isAdmin },
    JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.json({ token, user });
});

router.post('/phone/request-otp', otpRequestLimiter, async (req, res) => {
  const { phoneNumber } = req.body

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' })
  }

  const otp = generateOTP()
  const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  await prisma.phoneLogin.upsert({
    where: { phoneNumber },
    update: { otp, otpExpires: expires, verified: false },
    create: {
      phoneNumber,
      otp,
      otpExpires: expires,
    },
  })

  // MOCK: In production, send SMS here
  console.log(`[DEBUG] Sending OTP ${otp} to ${phoneNumber}`)

  res.json({ ok: true, message: 'OTP sent' })
})

router.post('/phone/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  const record = await prisma.phoneLogin.findUnique({ where: { phoneNumber } });

  if (!record) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  const MAX_FAILED_ATTEMPTS = 5;

  // Lockout check
  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many failed attempts. Please try again later.' });
  }

  // OTP validation
  if (record.otp !== otp || !record.otpExpires || record.otpExpires < new Date()) {
    // Increment failedAttempts
    await prisma.phoneLogin.update({
      where: { phoneNumber },
      data: {
        failedAttempts: (record.failedAttempts || 0) + 1,
      },
    });

    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  // OTP verified successfully, reset failedAttempts and update verified status
  await prisma.phoneLogin.update({
    where: { phoneNumber },
    data: {
      verified: true,
      failedAttempts: 0,
      otp: null,
      otpExpires: null,
    },
  });

  let user;

  if (record.userId) {
    user = await prisma.user.findUnique({ where: { id: record.userId } });

    if (!user) {
      return res.status(500).json({ error: 'User record not found for linked phone login' });
    }
  } else {
    user = await prisma.user.create({ data: { email: `${phoneNumber}@phone` } });
    await prisma.phoneLogin.update({
      where: { phoneNumber },
      data: { userId: user.id },
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: '7d' });

  res.json({ user, token });
});

export default router;
