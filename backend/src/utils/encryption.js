import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class EncryptionUtil {
  /**
   * Hash password using bcrypt
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate random OTP (6 digits)
   */
  generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Hash data using SHA256
   */
  hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Compare data with hash
   */
  compareData(data, hash) {
    return this.hashData(data) === hash;
  }

  /**
   * Generate a unique verification token
   */
  generateVerificationToken() {
    return this.generateSecureToken(32);
  }

  /**
   * Generate password reset token
   */
  generateResetToken() {
    const token = this.generateSecureToken(32);
    const hashedToken = this.hashData(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    return {
      token,
      hashedToken,
      expiresAt,
    };
  }

  /**
   * Encrypt sensitive data (e.g., for database storage)
   */
  encrypt(text, key) {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
    };
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData, iv, key) {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex')
    );
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

export default new EncryptionUtil();
