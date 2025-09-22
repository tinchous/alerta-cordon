// src/lib/prisma.ts - Singleton Prisma Client para Next.js (evita reconexiones en dev/prod)
// Fuente: Docs Prisma + Next.js - https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Uso: Importa { prisma } desde aquí en tus routes, no new PrismaClient() directo.
// Beneficio: 1 instancia global, no leaks en serverless (Vercel).
