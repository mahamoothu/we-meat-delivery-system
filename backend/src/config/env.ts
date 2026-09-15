import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.string().optional(),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long').default(
      // Development-only fallback. In production, refinement below enforces a non-default secret.
      'dev_jwt_secret_key_wemeat_development_only_not_for_production',
    ),
    JWT_EXPIRES_IN: z.string().default('15m'),
    CORS_ORIGIN: z.string().default('*'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),

    // Future placeholders (optional in Step 2)
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().optional(),
    FIREBASE_PRIVATE_KEY: z
      .string()
      .optional()
      .transform(val => (val ? val.replace(/\\n/g, '\n') : undefined)),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    GOOGLE_MAPS_API_KEY: z.string().optional(),
  })
  .refine(
    data => {
      if (data.NODE_ENV === 'production') {
        return (
          data.JWT_SECRET !== 'dev_jwt_secret_key_wemeat_development_only_not_for_production' &&
          Boolean(data.DATABASE_URL && data.DATABASE_URL.length > 0)
        );
      }
      return true;
    },
    {
      message: 'In production, a custom secure JWT_SECRET and DATABASE_URL are strictly required.',
      path: ['JWT_SECRET'],
    },
  );

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formattedErrors = parsed.error.issues
    .map(issue => `  - [${issue.path.join('.')}] ${issue.message}`)
    .join('\n');
  console.error(`❌ Invalid environment configuration:\n${formattedErrors}`);
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
}

export const env = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>);
