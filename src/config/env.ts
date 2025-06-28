import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.string().default("info"),
  LOG_FORMAT: z.string().default("combined"),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  REDIS_TTL: z.coerce.number().default(3600), // in seconds
});

export const env = envSchema.parse(process.env);
export type Environment = z.infer<typeof envSchema>;
