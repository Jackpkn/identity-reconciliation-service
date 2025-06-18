import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
export type Environment = z.infer<typeof envSchema>;
