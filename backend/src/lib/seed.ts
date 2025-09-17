// backend/src/lib/seed.ts
import prisma from './prisma';

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        wallets: {
          create: {
            address: '0xabc1234567890',  // Use a valid wallet address format
            walletType: 'embedded',
          },
        },
      },
    });

    console.log('Seeded user:', user);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
