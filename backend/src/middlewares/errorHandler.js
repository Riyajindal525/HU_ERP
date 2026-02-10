import { ApiError, ValidationError } from '../utils/errors.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Convert Zod errors to validation error format
 */
const formatZodErrors = (zodErrors) => {
  return zodErrors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
};

/**
 * Error response formatter
 */
const formatErrorResponse = (err, req) => {
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
  };

  // Add stack trace in development
  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.path = req.path;
    response.method = req.method;
  }

  // Add validation errors if present
  if (err instanceof ValidationError && err.errors) {
    response.errors = err.errors;
  }

  return response;
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error
  logger.error({
    message: err.message,
    statusCode: err.statusCode || 500,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  });

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = new ValidationError('Validation failed', errors);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = new ApiError(409, `${field} already exists`);
  }

  // Handle Mongoose CastError
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    const errors = formatZodErrors(err.errors);
    error = new ValidationError('Validation failed', errors);
  }

  // Send error response
  const statusCode = error.statusCode || 500;
  const response = formatErrorResponse(error, req);

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Cannot ${req.method} ${req.path}`);
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
