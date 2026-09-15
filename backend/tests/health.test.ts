import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/v1/health', () => {
  it('should return 200 OK and health status object', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('status', 'ok');
    expect(res.body.data).toHaveProperty('service', 'wemeat-backend');
    expect(res.body.data).toHaveProperty('version');
    expect(res.body.data).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/non-existent-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
