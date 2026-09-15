import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';
import { AppError } from './utils/appError';

export function createApp(): Express {
  const app = express();

  // Security & standard middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Mount API router
  app.use('/api/v1', apiRouter);

  // Handle 404
  app.use((_req, _res, next) => {
    next(AppError.notFound('Route not found'));
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
