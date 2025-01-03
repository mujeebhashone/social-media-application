import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const errorResponse: ErrorResponse = {
    message: err.message,
  };

  // Agar development mode hai, to stack trace bhi bhejo
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};