import { z } from "zod";

export const identifyRequestSchema = z
  .object({
    email: z.string().email().optional().nullable(),
    phoneNumber: z
      .string()
      .regex(/^[+]?[\d\s\-\(\)]+$/)
      .min(10)
      .max(15)
      .optional()
      .nullable(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "At least one of email or phoneNumber must be provided",
    path: [],
  });
