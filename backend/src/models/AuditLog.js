import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT'],
      index: true,
    },
    resource: {
      type: String,
      required: [true, 'Resource is required'],
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    changes: {
      old: {
        type: mongoose.Schema.Types.Mixed,
      },
      new: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
    endpoint: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    errorMessage: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, resource: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

// Static method to log action
auditLogSchema.statics.logAction = async function (data) {
  try {
    await this.create(data);
  } catch (error) {
    // Silently fail to prevent audit logging from breaking the application
    console.error('Failed to create audit log:', error.message);
  }
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
