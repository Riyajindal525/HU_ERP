import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { UnauthorizedError, BadRequestError, ConflictError } from '../utils/errors.js';
import jwtUtil from '../utils/jwt.js';
import encryptionUtil from '../utils/encryption.js';
import redisClient from '../config/redis.js';
import logger from '../utils/logger.js';

class AuthService {
  /**
   * Register a new user
   */
  async register(data) {
    console.log('Auth service received data:', data);
    const { email, password, role, profileData, firstName, lastName } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).select('+isDeleted');
    if (existingUser && !existingUser.isDeleted) {
      throw new ConflictError('User with this email already exists');
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName,
      emailVerified: false,
    });

    // Create role-specific profile with minimal required data
    if (role === 'STUDENT') {
      await Student.create({
        user: user._id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        // Add minimal required fields - will be completed later by admin/student
        ...(profileData || {})
      });
    } else if (role === 'FACULTY') {
      await Faculty.create({
        user: user._id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        // Add minimal required fields - will be completed later by admin
        ...(profileData || {})
      });
    }

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // TODO: Send verification email
    logger.info(`Verification token for ${email}: ${verificationToken}`);

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Save refresh token
    user.addRefreshToken(tokens.refreshToken);
    await user.save();

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    // Verify refresh token
    const decoded = jwtUtil.verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
    if (!tokenExists) {
      throw new UnauthorizedError('Refresh token not found');
    }

    // Generate new tokens
    const tokens = this.generateTokens(user);

    // Remove old refresh token and add new one
    user.removeRefreshToken(refreshToken);
    user.addRefreshToken(tokens.refreshToken);
    await user.save();

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Logout user
   */
  async logout(userId, accessToken, refreshToken) {
    const user = await User.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Remove refresh token
    if (refreshToken) {
      user.removeRefreshToken(refreshToken);
      await user.save();
    }

    // Blacklist access token
    const tokenExpiration = jwtUtil.getTokenExpiration(accessToken);
    const ttl = Math.floor((tokenExpiration - new Date()) / 1000);
    
    if (ttl > 0) {
      await redisClient.set(`blacklist:${accessToken}`, 'true', ttl);
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Forgot password - send reset link
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // TODO: Send reset email
    logger.info(`Password reset token for ${email}: ${resetToken}`);

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    const hashedToken = encryptionUtil.hashData(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }

  /**
   * Verify email
   */
  async verifyEmail(token) {
    const hashedToken = encryptionUtil.hashData(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await Student.findOne({ user: userId })
        .populate('department')
        .populate('course');
    } else if (user.role === 'FACULTY') {
      profile = await Faculty.findOne({ user: userId })
        .populate('department');
    }

    return {
      user: user.toJSON(),
      profile,
    };
  }

  /**
   * Helper: Generate access and refresh tokens
   */
  generateTokens(user) {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return jwtUtil.generateTokenPair(payload);
  }
}

export default new AuthService();
