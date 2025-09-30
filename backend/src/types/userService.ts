import prisma from '../lib/prisma';
import { User } from '@prisma/client';

const userCache = new Map<number, User>();

export async function getUserById(userId: number): Promise<User | null> {
  if (userCache.has(userId)) {
    return userCache.get(userId)!;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallets: true },
  });

  if (user) {
    userCache.set(userId, user);
    setTimeout(() => userCache.delete(userId), 5 * 60 * 1000); // 5 mins
  }

  return user;
}
