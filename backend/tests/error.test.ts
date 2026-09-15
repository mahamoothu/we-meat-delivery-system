import request from 'supertest';
import { app } from '../src/app';

describe('Error Handling & 404 Middleware', () => {
  it('should return 404 for unknown routes in standard error format', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint-xyz');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Route not found');
    expect(res.body.error).toHaveProperty('code', 'ROUTE_NOT_FOUND');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should handle malformed JSON gracefully with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/health')
      .set('Content-Type', 'application/json')
      .send('{ "invalidJson": ');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toHaveProperty('code', 'INVALID_JSON');
  });
});
