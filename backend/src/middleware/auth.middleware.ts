import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { UserRole, AuthenticatedUser } from '@wemeat/shared-types';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';

export interface JwtPayload {
  id: string;
  role: UserRole;
  phoneNumber?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

/**
 * Foundational JWT Verification Middleware.
 * Extracts and verifies Bearer JWT token from the Authorization header.
 * Attaches decoded user payload to `req.user`.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(AppError.unauthorized('Authorization header is required', 'MISSING_AUTH_HEADER'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(
      AppError.unauthorized(
        'Invalid authorization format. Expected: Bearer <token>',
        'INVALID_BEARER_FORMAT',
      ),
    );
  }

  const token = parts[1];
  if (!token || token.trim() === '') {
    return next(AppError.unauthorized('Token is missing', 'MISSING_TOKEN'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.id || !decoded.role) {
      return next(
        AppError.unauthorized('Invalid token payload structure', 'INVALID_TOKEN_PAYLOAD'),
      );
    }

    const user: AuthenticatedUser = {
      id: decoded.id,
      role: decoded.role,
      phoneNumber: decoded.phoneNumber,
      name: decoded.name,
    };

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(AppError.unauthorized('Authentication token has expired', 'TOKEN_EXPIRED'));
    }
    if (error instanceof JsonWebTokenError) {
      return next(
        AppError.unauthorized('Invalid or corrupted authentication token', 'INVALID_TOKEN'),
      );
    }
    return next(AppError.unauthorized('Token verification failed', 'AUTH_VERIFICATION_FAILED'));
  }
}

/**
 * Role-based Authorization Middleware.
 * Enforces that `req.user` has at least one of the allowed roles.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        AppError.unauthorized(
          'Authentication required before checking role permissions',
          'AUTH_REQUIRED',
        ),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
          'FORBIDDEN_ROLE',
        ),
      );
    }

    next();
  };
}
