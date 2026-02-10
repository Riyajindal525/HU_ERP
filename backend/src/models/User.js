import mongoose from 'mongoose';
import encryptionUtil from '../utils/encryption.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN', 'LIBRARIAN', 'FEE_CLERK'],
      required: [true, 'Role is required'],
      index: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    loginOtp: String,
    loginOtpExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    permissions: [{
      type: String,
    }],
    refreshTokens: [{
      token: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: Date,
    }],
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        delete ret.loginOtp;
        delete ret.loginOtpExpires;
        delete ret.isDeleted;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1, isDeleted: 1 });
userSchema.index({ role: 1, isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  this.password = await encryptionUtil.hashPassword(this.password);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return encryptionUtil.comparePassword(candidatePassword, this.password);
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const { token, hashedToken, expiresAt } = encryptionUtil.generateResetToken();
  
  this.passwordResetToken = hashedToken;
  this.passwordResetExpires = expiresAt;
  
  return token;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const token = encryptionUtil.generateVerificationToken();
  
  this.emailVerificationToken = encryptionUtil.hashData(token);
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return token;
};

// Add refresh token
userSchema.methods.addRefreshToken = function (token, expiresIn = '7d') {
  const expiresAt = new Date();
  
  // Parse expiresIn (e.g., "7d" -> 7 days)
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's':
        expiresAt.setSeconds(expiresAt.getSeconds() + value);
        break;
      case 'm':
        expiresAt.setMinutes(expiresAt.getMinutes() + value);
        break;
      case 'h':
        expiresAt.setHours(expiresAt.getHours() + value);
        break;
      case 'd':
        expiresAt.setDate(expiresAt.getDate() + value);
        break;
    }
  }
  
  this.refreshTokens.push({ token, expiresAt });
  
  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
};

// Remove refresh token
userSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
};

// Soft delete
userSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive = false;
};

// Query middleware to exclude soft deleted documents
userSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
