import jwt from 'jsonwebtoken';
import env from '../config/env.js';

class JWTUtil {
  /**
   * Generate access token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: 'haridwar-erp',
      audience: 'haridwar-erp-users',
    });
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'haridwar-erp',
      audience: 'haridwar-erp-users',
    });
  }

  /**
   * Generate both access and refresh tokens
   */
  generateTokenPair(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, env.JWT_SECRET, {
        issuer: 'haridwar-erp',
        audience: 'haridwar-erp-users',
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        issuer: 'haridwar-erp',
        audience: 'haridwar-erp-users',
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  decode(token) {
    return jwt.decode(token);
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token) {
    const decoded = this.decode(token);
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    const expiration = this.getTokenExpiration(token);
    return expiration ? expiration < new Date() : true;
  }
}

export default new JWTUtil();
