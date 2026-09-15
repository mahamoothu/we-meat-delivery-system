import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { UserRole } from '@wemeat/shared-types';
import { authenticate, requireRole } from '../src/middleware/auth.middleware';
import { errorHandler } from '../src/middleware/error.middleware';
import { env } from '../src/config/env';
import { sendSuccess } from '../src/utils/api-response';

// Create dedicated test app for auth middleware unit tests
function createAuthTestApp() {
  const testApp = express();
  testApp.use(express.json());

  // Protected route requiring valid token
  testApp.get('/test/protected', authenticate, (req, res) => {
    sendSuccess(res, { user: req.user }, 'Access granted');
  });

  // Protected route requiring SHOP_OWNER or ADMIN role
  testApp.get(
    '/test/shop-owner-only',
    authenticate,
    requireRole(UserRole.SHOP_OWNER, UserRole.ADMIN),
    (req, res) => {
      sendSuccess(res, { user: req.user }, 'Shop owner access granted');
    },
  );

  testApp.use(errorHandler);
  return testApp;
}

const authApp = createAuthTestApp();

describe('Auth Middleware (JWT & Role Verification)', () => {
  const validSecret = env.JWT_SECRET;

  it('should reject requests missing Authorization header (401)', async () => {
    const res = await request(authApp).get('/test/protected');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('MISSING_AUTH_HEADER');
  });

  it('should reject requests with invalid Bearer format (401)', async () => {
    const res = await request(authApp).get('/test/protected').set('Authorization', 'Basic 123456');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_BEARER_FORMAT');
  });

  it('should reject invalid / corrupted tokens (401)', async () => {
    const res = await request(authApp)
      .get('/test/protected')
      .set('Authorization', 'Bearer invalid.token.payload');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_TOKEN');
  });

  it('should reject expired tokens (401)', async () => {
    const expiredToken = jwt.sign({ id: 'user-123', role: UserRole.CUSTOMER }, validSecret, {
      expiresIn: '-1s',
    });

    const res = await request(authApp)
      .get('/test/protected')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('TOKEN_EXPIRED');
  });

  it('should allow valid tokens and attach user to request (200)', async () => {
    const validToken = jwt.sign(
      { id: 'user-123', role: UserRole.CUSTOMER, phoneNumber: '+919876543210' },
      validSecret,
      { expiresIn: '1h' },
    );

    const res = await request(authApp)
      .get('/test/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toEqual({
      id: 'user-123',
      role: UserRole.CUSTOMER,
      phoneNumber: '+919876543210',
    });
  });

  it('should forbid user with insufficient role (403)', async () => {
    const customerToken = jwt.sign({ id: 'customer-1', role: UserRole.CUSTOMER }, validSecret, {
      expiresIn: '1h',
    });

    const res = await request(authApp)
      .get('/test/shop-owner-only')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN_ROLE');
  });

  it('should allow user with required role (200)', async () => {
    const shopOwnerToken = jwt.sign({ id: 'owner-1', role: UserRole.SHOP_OWNER }, validSecret, {
      expiresIn: '1h',
    });

    const res = await request(authApp)
      .get('/test/shop-owner-only')
      .set('Authorization', `Bearer ${shopOwnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe(UserRole.SHOP_OWNER);
  });
});
