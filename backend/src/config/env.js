import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("5000"),

  // Database
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // ✅ SENDGRID EMAIL CONFIG
  SENDGRID_API_KEY: z.string(),
  SENDGRID_FROM_EMAIL: z.string().email(),
  EMAIL_FROM_NAME: z.string().optional(),

  // SMS
  SMS_API_KEY: z.string().optional(),
  SMS_API_URL: z.string().url().optional(),

  // Frontend
  FRONTEND_URL: z.string().url(),

  // Uploads
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_FILE_SIZE: z.string().transform(Number).default("5242880"),

  // Rate limit
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("60000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),

  // Session
  SESSION_SECRET: z.string().min(32),
});

let env;

try {
  env = envSchema.parse(process.env);
  console.log("✅ Environment variables validated successfully");
} catch (error) {
  console.error("❌ Invalid environment variables:");
  console.error(error.errors);
  process.exit(1);
}

export default env;
