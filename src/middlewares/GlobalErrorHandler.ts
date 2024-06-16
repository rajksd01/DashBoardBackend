import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/ServerConfig";
const globalErrorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode;

  return res.status(statusCode).json({
    message: error,
    errorStack: config.ENVIRONMENT === "development" ? error.stack : "",
  });
};

export default globalErrorHandler;
