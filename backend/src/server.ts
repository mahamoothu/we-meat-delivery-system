import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { disconnectDatabase } from './config/prisma';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 WeMeat API Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  logger.info(`   - Root Info:    http://localhost:${env.PORT}/`);
  logger.info(`   - Health Check: http://localhost:${env.PORT}/api/v1/health`);
});

// Graceful shutdown handling
const handleShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await disconnectDatabase();
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forceful shutdown triggered after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
