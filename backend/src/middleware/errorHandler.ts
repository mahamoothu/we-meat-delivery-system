import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../config/logger';

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    logger.warn(`Operational Error: ${err.message} (Status: ${err.statusCode})`);
    sendError(res, err.message, err.statusCode, err.name, err.details);
    return;
  }

  logger.error('Unhandled Error:', err);
  sendError(res, 'Internal server error', 500, 'INTERNAL_SERVER_ERROR');
}
