import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service';
import { sendSuccess } from '../utils/api-response';

export class HealthController {
  async getHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await healthService.getHealth();
      sendSuccess(res, health, 'Health check completed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const healthController = new HealthController();
