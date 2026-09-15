import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from './logger';

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

/**
 * Checks if the PostgreSQL database is reachable.
 * Never throws — returns false if connection fails or is unconfigured.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (!env.DATABASE_URL) {
      return false;
    }
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.debug('Database connection check failed:', error);
    return false;
  }
}

/**
 * Gracefully disconnects Prisma client.
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed.');
  } catch (error) {
    logger.error('Error during database disconnect:', error);
  }
}
