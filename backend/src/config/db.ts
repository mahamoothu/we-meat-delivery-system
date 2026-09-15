import { PrismaClient } from '@prisma/client';
import { env } from './env';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (!env.DATABASE_URL) {
      return false;
    }
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
