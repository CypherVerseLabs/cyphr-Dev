import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { body, validationResult } from 'express-validator';
import { authenticateJWT } from '../middleware/authenticateJWT';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

// ------------------------
// GET user by wallet
// ------------------------
router.get('/by-wallet/:address', async (req: Request, res: Response) => {
  const { address } = req.params;

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address },
      include: { user: true },
    });

    if (!wallet || !wallet.user) {
      return res.status(404).json({ error: 'User not found for this wallet' });
    }

    res.json(wallet.user);
  } catch (error) {
    console.error('Error in /users/by-wallet/:address', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------
// GET full user list w/ wallets (Admin only?)
// ------------------------
router.get('/full', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '10', 10);

  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
      include: { wallets: true },
    });

    const totalUsers = await prisma.user.count();

    res.json({
      users,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error('GET /users/full error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------
// GET paginated user list
// ------------------------
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '10', 10);

  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    const totalUsers = await prisma.user.count();

    res.json({
      users,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------
// GET /me — current user
// ------------------------
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.jwtUser?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallets: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------
// GET user by ID
// ------------------------
router.get('/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------------
// PUT update user
// ------------------------
router.put(
  '/:id',
  authenticateJWT,
  [body('email').optional().isEmail().withMessage('Valid email required')],
  async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Optional: only allow updating self unless admin
    if (req.jwtUser?.userId !== id && !req.jwtUser?.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: req.body,
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ------------------------
// DELETE user
// ------------------------
router.delete('/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  // Optional: only allow self-deletion or admins
  if (req.jwtUser?.userId !== id && !req.jwtUser?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
