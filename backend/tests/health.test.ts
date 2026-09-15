import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/v1/health', () => {
  it('should return 200 OK and health status object', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('status');
    expect(['ok', 'degraded']).toContain(res.body.data.status);
    expect(res.body.data).toHaveProperty('service', 'wemeat-backend');
    expect(res.body.data).toHaveProperty('version', '0.1.0');
    expect(res.body.data).toHaveProperty('timestamp');
    expect(res.body.data).toHaveProperty('database');
    expect(['connected', 'disconnected']).toContain(res.body.data.database);
  });
});
