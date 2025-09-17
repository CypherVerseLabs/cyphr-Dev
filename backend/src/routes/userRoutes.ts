import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { body, validationResult } from 'express-validator';

const router = Router();

// GET user by wallet address (must be before /:id)
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

// GET full user list with wallets (optional)
router.get('/full', async (req: Request, res: Response) => {
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

// GET users list with pagination
router.get('/', async (req: Request, res: Response) => {
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

// GET user by id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update user by id
router.put(
  '/:id',
  [
    body('email').optional().isEmail().withMessage('Valid email required'),
  ],
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

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

// DELETE user by id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
