import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/utils/logger";
import { ApiError } from "@/types/api.types";
export class AppError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: any;
  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let code: string | undefined;
  let details: any;
  if (error instanceof AppError) {
    status = error.status;
    message = error.message;
    code = error.code;
    details = error.details;
  }
  // log error details
  logger.error("Request error", {
    path: req.path,
    method: req.method,
    status,
    message,
    code,
    stack: error.stack,
    body: req.body,
    query: req.query,
    params: req.params,
  });
  // don't expose internal server errors in production
  if (
    status === StatusCodes.INTERNAL_SERVER_ERROR &&
    process.env.NODE_ENV === "production"
  ) {
    message = "Something went wrong";
    details = undefined;
  }
  const errorResponse: { error: ApiError } = {
    error: {
      status,
      message,
      code,
      details,
    },
  };

  res.status(status).json(errorResponse);
};
