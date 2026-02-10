import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    enrollmentNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined values
      uppercase: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    guardianName: {
      type: String,
    },
    guardianPhone: {
      type: String,
      match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    guardianRelation: {
      type: String,
      enum: ['FATHER', 'MOTHER', 'GUARDIAN'],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    currentSemester: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    enrolledSubjects: [{
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
      semester: Number,
      academicYear: String,
    }],
    section: {
      type: String,
      trim: true,
    },
    batch: {
      type: String, // e.g., "2023-2027"
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    category: {
      type: String,
      enum: ['GENERAL', 'OBC', 'SC', 'ST', 'EWS'],
    },
    profilePicture: String,
    documents: [{
      type: {
        type: String,
        enum: ['AADHAR', 'PAN', 'MARKSHEET', 'CERTIFICATE', 'OTHER'],
      },
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'GRADUATED', 'DROPPED'],
      default: 'ACTIVE',
      index: true,
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
// Note: enrollmentNumber uses sparse index to allow multiple null values
studentSchema.index({ department: 1, course: 1, currentSemester: 1 });
studentSchema.index({ firstName: 'text', lastName: 'text' });

// Virtual for full name
studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
studentSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Soft delete
studentSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.status = 'INACTIVE';
};

// Query middleware
studentSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
