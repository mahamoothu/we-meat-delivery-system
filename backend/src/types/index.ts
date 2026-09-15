import { AuthenticatedUser } from '@wemeat/shared-types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export * from '@wemeat/shared-types';
