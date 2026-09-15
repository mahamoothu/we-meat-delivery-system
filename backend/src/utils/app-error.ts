export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public isOperational: boolean;
  public details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    errorCode = 'INTERNAL_ERROR',
    details?: unknown,
    isOperational = true,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown, errorCode = 'BAD_REQUEST') {
    return new AppError(message, 400, errorCode, details);
  }

  static unauthorized(message = 'Unauthorized access', errorCode = 'UNAUTHORIZED') {
    return new AppError(message, 401, errorCode);
  }

  static forbidden(message = 'Forbidden access', errorCode = 'FORBIDDEN') {
    return new AppError(message, 403, errorCode);
  }

  static notFound(message = 'Resource not found', errorCode = 'NOT_FOUND') {
    return new AppError(message, 404, errorCode);
  }

  static conflict(message: string, errorCode = 'CONFLICT') {
    return new AppError(message, 409, errorCode);
  }

  static unprocessable(message: string, details?: unknown, errorCode = 'VALIDATION_ERROR') {
    return new AppError(message, 422, errorCode, details);
  }

  static internal(message = 'Internal server error', errorCode = 'INTERNAL_SERVER_ERROR') {
    return new AppError(message, 500, errorCode, undefined, false);
  }
}
