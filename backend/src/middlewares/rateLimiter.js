import rateLimit from 'express-rate-limit';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Create rate limiter with custom options
 */
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || env.RATE_LIMIT_WINDOW_MS,
    max: options.max || env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      message: options.message || 'Too many requests, please try again later',
      statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn({
        message: 'Rate limit exceeded',
        ip: req.ip,
        path: req.path,
        userId: req.user?.id,
      });
      
      res.status(429).json({
        success: false,
        message: options.message || 'Too many requests, please try again later',
        statusCode: 429,
        retryAfter: res.getHeader('Retry-After'),
      });
    },
    skip: (req) => {
      // Skip rate limiting for super admins
      return req.user?.role === 'SUPER_ADMIN';
    },
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user?.id || req.ip;
    },
  });
};

/**
 * General API rate limiter
 */
export const generalLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests from this user, please try again later',
});

/**
 * Auth endpoints rate limiter (stricter)
 */
export const authLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Increased for development
  message: 'Too many authentication attempts, please try again after 1 minute',
});

/**
 * Role-based rate limiters
 */
export const studentLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many requests, please try again later',
});

export const facultyLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 50,
  message: 'Too many requests, please try again later',
});

export const adminLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
});

/**
 * File upload rate limiter
 */
export const uploadLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many file uploads, please try again later',
});

/**
 * Dynamic role-based rate limiter middleware
 */
export const roleBasedRateLimiter = (req, res, next) => {
  if (!req.user) {
    return generalLimiter(req, res, next);
  }

  switch (req.user.role) {
    case 'STUDENT':
      return studentLimiter(req, res, next);
    case 'FACULTY':
      return facultyLimiter(req, res, next);
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return adminLimiter(req, res, next);
    default:
      return generalLimiter(req, res, next);
  }
};
