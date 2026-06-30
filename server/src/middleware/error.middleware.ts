import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const message = 'Validation Error';
    error = new AppError(message, 400);
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: err.errors
    });
  }

  // Prisma Errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
