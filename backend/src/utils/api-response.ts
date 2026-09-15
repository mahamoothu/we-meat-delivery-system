import { Response } from 'express';
import type { ApiResponse, ApiErrorResponse, PaginatedResult } from '@wemeat/shared-types';

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200,
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: unknown,
): Response {
  const response: ApiErrorResponse = {
    success: false,
    message,
    error: {
      code,
      details,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  limit: number,
  message?: string,
): Response {
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedData: PaginatedResult<T> = {
    items,
    total,
    page,
    limit,
    totalPages,
  };

  return sendSuccess(res, paginatedData, message);
}
