import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
      index: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE'],
      required: [true, 'Status is required'],
    },
    session: {
      type: String,
      enum: ['MORNING', 'AFTERNOON', 'EVENING'],
      default: 'MORNING',
    },
    period: {
      type: Number,
      min: 1,
      max: 10,
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
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
attendanceSchema.index({ student: 1, subject: 1, date: 1 });
attendanceSchema.index({ subject: 1, date: 1 });
attendanceSchema.index({ student: 1, semester: 1, academicYear: 1 });
attendanceSchema.index({ date: 1, status: 1 });

// Unique constraint to prevent duplicate attendance for same student, subject, date
attendanceSchema.index(
  { student: 1, subject: 1, date: 1, session: 1 },
  { unique: true }
);

// Static method to calculate attendance percentage
attendanceSchema.statics.calculateAttendancePercentage = async function (studentId, subjectId, semester, academicYear) {
  const result = await this.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
        subject: new mongoose.Types.ObjectId(subjectId),
        semester,
        academicYear,
      },
    },
    {
      $facet: {
        total: [{ $count: 'count' }],
        present: [
          {
            $match: {
              $or: [{ status: 'PRESENT' }, { status: 'LATE' }],
            },
          },
          { $count: 'count' },
        ],
      },
    },
    {
      $project: {
        total: { $arrayElemAt: ['$total.count', 0] },
        present: { $arrayElemAt: ['$present.count', 0] },
      },
    },
    {
      $project: {
        total: { $ifNull: ['$total', 0] },
        present: { $ifNull: ['$present', 0] },
        percentage: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            {
              $multiply: [
                { $divide: [{ $ifNull: ['$present', 0] }, '$total'] },
                100,
              ],
            },
          ],
        },
      },
    },
  ]);

  return result[0] || { total: 0, present: 0, percentage: 0 };
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
