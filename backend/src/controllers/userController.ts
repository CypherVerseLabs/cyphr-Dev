import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createUserAndWallet = async (req: Request, res: Response) => {
  const { email, walletAddress, walletType } = req.body;

  if (!email || !walletAddress || !walletType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

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

    res.json({ user, wallet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
