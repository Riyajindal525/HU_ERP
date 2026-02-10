import { asyncHandler } from './errorHandler.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import jwtUtil from '../utils/jwt.js';
import redisClient from '../config/redis.js';
import User from '../models/User.js';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.substring(7);

  // Check if token is blacklisted
  const isBlacklisted = await redisClient.exists(`blacklist:${token}`);
  if (isBlacklisted) {
    throw new UnauthorizedError('Token has been revoked');
  }

  // Verify token
  const decoded = jwtUtil.verifyAccessToken(token);

  // Get user from database
  const user = await User.findById(decoded.userId).select('-password');
  
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // Attach user to request
  req.user = user;
  req.token = token;
  
  next();
});

/**
 * Check if user has required role
 */
export const authorize = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }

    next();
  });
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Super admin has all permissions
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Check if user's role has the required permission
    const userPermissions = req.user.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      throw new ForbiddenError(`Permission denied: ${permission}`);
    }

    next();
  });
};

/**
 * Optional authentication - attaches user if token is present
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwtUtil.verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
});

/**
 * Check if user is accessing their own resource
 */
export const isOwner = (userIdParam = 'id') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const resourceUserId = req.params[userIdParam];

    // Super admin and admin can access any resource
    if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN') {
      return next();
    }

    // Check if user is accessing their own resource
    if (req.user.id !== resourceUserId) {
      throw new ForbiddenError('You can only access your own resources');
    }

    next();
  });
};
