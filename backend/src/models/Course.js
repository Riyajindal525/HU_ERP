import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      years: {
        type: Number,
        required: true,
      },
      semesters: {
        type: Number,
        required: true,
      },
    },
    degree: {
      type: String,
      enum: ['B_TECH', 'M_TECH', 'B_SC', 'M_SC', 'BBA', 'MBA', 'BCA', 'MCA', 'BA', 'MA', 'B_COM', 'M_COM', 'PHD'],
      required: true,
    },
    eligibility: {
      type: String,
      trim: true,
    },
    totalSeats: {
      type: Number,
      default: 60,
    },
    feeStructure: {
      tuitionFee: {
        type: Number,
        default: 0,
      },
      labFee: {
        type: Number,
        default: 0,
      },
      libraryFee: {
        type: Number,
        default: 0,
      },
      otherFees: {
        type: Number,
        default: 0,
      },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
courseSchema.index({ code: 1, isDeleted: 1 });
courseSchema.index({ department: 1, isActive: 1 });
courseSchema.index({ name: 'text' });

// Virtual for total fee
courseSchema.virtual('totalFee').get(function () {
  const { tuitionFee, labFee, libraryFee, otherFees } = this.feeStructure;
  return (tuitionFee || 0) + (labFee || 0) + (libraryFee || 0) + (otherFees || 0);
});

// Query middleware
courseSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
