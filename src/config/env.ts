import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  logging: z.object({
    level: z.string().default(process.env.LOG_LEVEL || "info"),
    format: z.string().default(process.env.LOG_FORMAT || "combined"),
  }),
});

export const env = envSchema.parse(process.env);
export type Environment = z.infer<typeof envSchema>;
