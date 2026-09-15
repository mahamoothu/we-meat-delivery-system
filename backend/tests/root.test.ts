import request from 'supertest';
import { app } from '../src/app';

describe('GET / (Root Endpoint)', () => {
  it('should return 200 OK with API information', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('WeMeat API is running');
    expect(res.body.data).toHaveProperty('service', 'wemeat-backend');
    expect(res.body.data).toHaveProperty('version', '0.1.0');
    expect(res.body.data).toHaveProperty('environment');
    expect(res.body.data.endpoints).toHaveProperty('health', '/api/v1/health');
  });
});
