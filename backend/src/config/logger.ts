import { env } from './env';

const LOG_LEVELS: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const currentLevelNumber = LOG_LEVELS[env?.LOG_LEVEL || 'info'] ?? 2;

function shouldLog(level: string): boolean {
  const levelNum = LOG_LEVELS[level] ?? 2;
  return levelNum <= currentLevelNumber;
}

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  http: (message: string, ...args: unknown[]) => {
    if (shouldLog('http')) {
      console.log(`[HTTP] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  debug: (message: string, ...args: unknown[]) => {
    if (shouldLog('debug')) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
};
