import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
      index: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
      index: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 10,
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 1,
      max: 10,
    },
    type: {
      type: String,
      enum: ['THEORY', 'PRACTICAL', 'BOTH'],
      default: 'THEORY',
    },
    isElective: {
      type: Boolean,
      default: false,
    },
    facultyAssigned: [{
      faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
      },
      section: String,
      academicYear: String,
    }],
    syllabus: {
      type: String,
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
subjectSchema.index({ code: 1, isDeleted: 1 });
subjectSchema.index({ course: 1, semester: 1 });
subjectSchema.index({ department: 1, semester: 1 });
subjectSchema.index({ name: 'text' });

// Query middleware
subjectSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
