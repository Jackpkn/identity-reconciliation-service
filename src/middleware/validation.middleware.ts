import { logger } from "@/utils/logger";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodSchema, ZodError } from "zod";

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = schema.parse(req.body);
      req.body = value;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorDetails = err.errors.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        }));
        logger.warn("Validation error", {
          path: req.path,
          method: req.method,
          body: req.body,
          error: errorDetails.map((d) => d.message).join(", "),
        });
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            status: StatusCodes.BAD_REQUEST,
            message: "Validation failed",
            details: errorDetails,
          },
        });
      }
      next(err);
    }
  };
};
