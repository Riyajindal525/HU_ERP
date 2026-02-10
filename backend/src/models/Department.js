import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    hodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    hodName: {
      type: String,
      trim: true,
    },
    establishedDate: {
      type: Date,
    },
    totalSeats: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
departmentSchema.index({ code: 1, isDeleted: 1 }, { unique: true });
departmentSchema.index({ name: 'text' });

// Query middleware
departmentSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
