import { ZodError } from "zod";
import httpStatus from "http-status";
import { HttpError } from "http-errors";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpError && err.expose) {
    res.status(err.status).json({ message: err.message });
  } else if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors
    });
  } else {
    console.log(err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR] });
  }
}
