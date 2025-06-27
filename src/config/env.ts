import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.string().default("info"),
  LOG_FORMAT: z.string().default("combined"),
});

export const env = envSchema.parse(process.env);
export type Environment = z.infer<typeof envSchema>;
