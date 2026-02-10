import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
console.log('✅ SMTP_USER from env:', process.env.SMTP_USER);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_SECURE: z.string().transform(val => val === 'true').default('false'),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email(),
  
  SMS_API_KEY: z.string().optional(),
  SMS_API_URL: z.string().url().optional(),
  
  FRONTEND_URL: z.string().url(),
  
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),
  
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  SESSION_SECRET: z.string().min(32),
});

let env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables:');
  console.error(error.errors);
  process.exit(1);
}

export default env;
