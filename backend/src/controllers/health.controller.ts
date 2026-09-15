import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service';
import { sendSuccess } from '../utils/apiResponse';

export class HealthController {
  async checkHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await healthService.getHealth();
      sendSuccess(res, health, 'Service is healthy');
    } catch (error) {
      next(error);
    }
  }
}

export const healthController = new HealthController();
