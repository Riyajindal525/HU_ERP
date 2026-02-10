import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam is required'],
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
      index: true,
    },
    marksObtained: {
      type: Number,
      required: [true, 'Marks obtained is required'],
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
    },
    grade: {
      type: String,
      enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'],
    },
    gradePoint: {
      type: Number,
      min: 0,
      max: 10,
    },
    status: {
      type: String,
      enum: ['PASS', 'FAIL', 'ABSENT'],
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    remarks: {
      type: String,
    },
    semester: {
      type: Number,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
resultSchema.index({ student: 1, exam: 1 }, { unique: true });
resultSchema.index({ student: 1, subject: 1, semester: 1, academicYear: 1 });
resultSchema.index({ exam: 1, isPublished: 1 });

// Calculate grade before saving
resultSchema.pre('save', function (next) {
  const percentage = (this.marksObtained / this.totalMarks) * 100;

  if (this.status === 'ABSENT') {
    this.grade = 'F';
    this.gradePoint = 0;
  } else {
    if (percentage >= 90) {
      this.grade = 'O';
      this.gradePoint = 10;
    } else if (percentage >= 80) {
      this.grade = 'A+';
      this.gradePoint = 9;
    } else if (percentage >= 70) {
      this.grade = 'A';
      this.gradePoint = 8;
    } else if (percentage >= 60) {
      this.grade = 'B+';
      this.gradePoint = 7;
    } else if (percentage >= 50) {
      this.grade = 'B';
      this.gradePoint = 6;
    } else if (percentage >= 40) {
      this.grade = 'C';
      this.gradePoint = 5;
    } else if (percentage >= 33) {
      this.grade = 'D';
      this.gradePoint = 4;
    } else {
      this.grade = 'F';
      this.gradePoint = 0;
      this.status = 'FAIL';
    }

    // Set status based on grade
    if (this.grade === 'F') {
      this.status = 'FAIL';
    } else {
      this.status = 'PASS';
    }
  }

  next();
});

// Static method to calculate SGPA
resultSchema.statics.calculateSGPA = async function (studentId, semester, academicYear) {
  const results = await this.find({
    student: studentId,
    semester,
    academicYear,
    isPublished: true,
    status: { $ne: 'ABSENT' },
  }).populate('subject', 'credits');

  if (results.length === 0) {
    return { sgpa: 0, totalCredits: 0 };
  }

  let totalCredits = 0;
  let weightedSum = 0;

  results.forEach((result) => {
    const credits = result.subject.credits;
    totalCredits += credits;
    weightedSum += result.gradePoint * credits;
  });

  const sgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

  return { sgpa: parseFloat(sgpa), totalCredits };
};

// Static method to calculate CGPA
resultSchema.statics.calculateCGPA = async function (studentId, academicYear) {
  const results = await this.find({
    student: studentId,
    academicYear,
    isPublished: true,
    status: { $ne: 'ABSENT' },
  }).populate('subject', 'credits');

  if (results.length === 0) {
    return { cgpa: 0, totalCredits: 0 };
  }

  let totalCredits = 0;
  let weightedSum = 0;

  results.forEach((result) => {
    const credits = result.subject.credits;
    totalCredits += credits;
    weightedSum += result.gradePoint * credits;
  });

  const cgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

  return { cgpa: parseFloat(cgpa), totalCredits };
};

const Result = mongoose.model('Result', resultSchema);

export default Result;
