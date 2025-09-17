import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected!');
  } catch (e) {
    console.error('Connection error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
