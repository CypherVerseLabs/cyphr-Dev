import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { body, validationResult } from 'express-validator';

const router = Router();

router.post(
  '/',
  [
    body('email')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('walletAddress')
      .isString().withMessage('Wallet address must be a string')
      .trim()
      .notEmpty().withMessage('Wallet address is required'),
    body('walletType')
      .isIn(['embedded', 'smart', 'external']).withMessage('Invalid wallet type'),
  ],
  async (req: Request, res: Response) => {  // <--- Here
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, walletAddress, walletType } = req.body;

    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email },
      });

      const wallet = await prisma.wallet.upsert({
        where: { address: walletAddress },
        update: {},
        create: {
          address: walletAddress,
          walletType,
          userId: user.id,
        },
      });

      res.status(201).json({ user, wallet });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
