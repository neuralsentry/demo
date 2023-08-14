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
  } else {
    console.log(err);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR] });
  }
}
