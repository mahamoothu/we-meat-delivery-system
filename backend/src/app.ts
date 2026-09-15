import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { requestLogger } from './middleware/request-logger.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { errorHandler } from './middleware/error.middleware';
import { apiRouter } from './routes';
import { sendSuccess } from './utils/api-response';

export function createApp(): Express {
  const app = express();

  // 1. Security & Standard Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map(o => o.trim()),
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. HTTP Request Logger
  app.use(requestLogger);

  // 3. Root Endpoint
  app.get('/', (_req, res) => {
    sendSuccess(
      res,
      {
        service: 'wemeat-backend',
        version: '0.1.0',
        environment: env.NODE_ENV,
        endpoints: {
          health: '/api/v1/health',
        },
      },
      'WeMeat API is running',
    );
  });

  // 4. API v1 Router
  app.use('/api/v1', apiRouter);

  // 5. 404 Catch-All Middleware
  app.use(notFoundHandler);

  // 6. Global Error Handling Middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
