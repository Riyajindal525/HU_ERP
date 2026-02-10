import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
      index: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 10,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
    },
    components: {
      tuitionFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      labFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      libraryFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      examFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      developmentFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      otherFees: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    lateFinePerDay: {
      type: Number,
      default: 10,
      min: 0,
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
feeSchema.index({ course: 1, semester: 1, academicYear: 1 }, { unique: true });

// Virtual for total fee
feeSchema.virtual('totalAmount').get(function () {
  const { tuitionFee, labFee, libraryFee, examFee, developmentFee, otherFees } = this.components;
  return tuitionFee + labFee + libraryFee + examFee + developmentFee + otherFees;
});

// Calculate late fine
feeSchema.methods.calculateLateFine = function () {
  if (!this.dueDate) return 0;
  
  const today = new Date();
  const due = new Date(this.dueDate);
  
  if (today <= due) return 0;
  
  const daysLate = Math.floor((today - due) / (1000 * 60 * 60 * 24));
  return daysLate * this.lateFinePerDay;
};

// Query middleware
feeSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Fee = mongoose.model('Fee', feeSchema);

export default Fee;
