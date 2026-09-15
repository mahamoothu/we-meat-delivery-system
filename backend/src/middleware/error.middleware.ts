import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/app-error';
import { sendError } from '../utils/api-response';
import { logger } from '../config/logger';
import { env } from '../config/env';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // 1. Handled Operational AppError
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[${req.method} ${req.path}] Operational 5xx Error: ${err.message}`, {
        code: err.errorCode,
        details: err.details,
      });
    } else {
      logger.warn(`[${req.method} ${req.path}] ${err.statusCode} - ${err.message}`);
    }
    sendError(res, err.message, err.statusCode, err.errorCode, err.details);
    return;
  }

  // 2. Zod Schema Validation Error
  if (err instanceof ZodError) {
    logger.warn(`[${req.method} ${req.path}] Validation Error:`, err.errors);
    const details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Request validation failed', 422, 'VALIDATION_ERROR', details);
    return;
  }

  // 3. Prisma Known Request Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`[${req.method} ${req.path}] Prisma Known Error [${err.code}]: ${err.message}`);
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target)
        ? err.meta?.target.join(', ')
        : (err.meta?.target as string) || 'field';
      sendError(res, `A record with this ${target} already exists.`, 409, 'DUPLICATE_RESOURCE');
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 'Requested database record not found.', 404, 'RECORD_NOT_FOUND');
      return;
    }
    sendError(res, 'Database operation error.', 400, 'DATABASE_ERROR');
    return;
  }

  // 4. JSON Body Parse Error (Malformed JSON payload)
  if (err instanceof SyntaxError && 'body' in err) {
    logger.warn(`[${req.method} ${req.path}] Malformed JSON request body`);
    sendError(res, 'Invalid JSON payload in request body', 400, 'INVALID_JSON');
    return;
  }

  // 5. Unhandled / Unknown Internal Errors
  logger.error(`[${req.method} ${req.path}] Unhandled Exception:`, err);

  const message =
    env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  sendError(res, message, 500, 'INTERNAL_SERVER_ERROR');
}
