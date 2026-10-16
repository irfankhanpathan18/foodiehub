import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { config } from '../config';

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Safe logging without credentials
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    const target = (err.meta?.target as string[])?.join(', ') || 'field';
    sendError(res, `A record with this ${target} already exists.`, 409);
    return;
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    sendError(res, 'The requested resource was not found.', 404);
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = config.isProduction && statusCode === 500
    ? 'An unexpected internal server error occurred.'
    : err.message || 'Internal server error';

  sendError(res, message, statusCode, !config.isProduction ? err.stack : undefined);
}
