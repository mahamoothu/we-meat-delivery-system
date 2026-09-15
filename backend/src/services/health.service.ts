import { checkDatabaseConnection } from '../config/db';
import type { HealthStatus } from '@wemeat/shared-types';

export class HealthService {
  async getHealth(): Promise<HealthStatus> {
    const isDbConnected = await checkDatabaseConnection();

    return {
      status: 'ok',
      service: 'wemeat-backend',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      database: isDbConnected ? 'connected' : 'disconnected',
    };
  }
}

export const healthService = new HealthService();
