// src/lib/prisma.ts - SINGLETON PRISMA CLIENT
// Evita múltiples conexiones en serverless (Vercel/Neon)
// =================================================================
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// SINGLETON: 1 instancia global, reutilizada en requests
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;