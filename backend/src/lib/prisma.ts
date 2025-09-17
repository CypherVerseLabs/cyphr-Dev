// backend/prisma.ts

import { PrismaClient } from '@prisma/client'

// Global object for storing Prisma instance (to avoid duplicate instances in dev)
const globalForPrisma = globalThis as {
  prisma?: PrismaClient
}

// Create or reuse the PrismaClient instance
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Avoid creating a new client on every hot reload (dev only)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
