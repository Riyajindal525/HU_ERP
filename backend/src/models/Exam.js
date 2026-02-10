import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['MID_TERM', 'END_TERM', 'INTERNAL', 'ASSIGNMENT', 'QUIZ'],
      required: [true, 'Exam type is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
      index: true,
    },
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
    date: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: 1,
    },
    passingMarks: {
      type: Number,
      required: [true, 'Passing marks is required'],
      min: 0,
    },
    room: {
      type: String,
    },
    instructions: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    resultsPublishedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
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
examSchema.index({ subject: 1, semester: 1, academicYear: 1 });
examSchema.index({ course: 1, semester: 1, type: 1 });
examSchema.index({ date: 1 });

// Validation: passing marks should be less than total marks
examSchema.pre('save', function (next) {
  if (this.passingMarks >= this.totalMarks) {
    next(new Error('Passing marks must be less than total marks'));
  }
  next();
});

// Query middleware
examSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
