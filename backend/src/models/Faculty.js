import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
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
    employeeId: {
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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      index: true,
    },
    designation: {
      type: String,
      enum: ['PROFESSOR', 'ASSOCIATE_PROFESSOR', 'ASSISTANT_PROFESSOR', 'LECTURER', 'LAB_ASSISTANT'],
    },
    qualification: {
      type: String,
      enum: ['PHD', 'M_TECH', 'M_SC', 'B_TECH', 'B_SC', 'OTHER'],
    },
    specialization: String,
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    experience: {
      type: Number,
      default: 0,
      comment: 'Experience in years',
    },
    allocatedSubjects: [{
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
      semester: Number,
      academicYear: String,
      section: String,
    }],
    leaveBalance: {
      casual: {
        type: Number,
        default: 12,
      },
      sick: {
        type: Number,
        default: 12,
      },
      earned: {
        type: Number,
        default: 15,
      },
    },
    profilePicture: String,
    documents: [{
      type: {
        type: String,
        enum: ['AADHAR', 'PAN', 'DEGREE', 'CERTIFICATE', 'OTHER'],
      },
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'RETIRED'],
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
// Note: employeeId uses sparse index to allow multiple null values
facultySchema.index({ department: 1, designation: 1 });
facultySchema.index({ firstName: 'text', lastName: 'text' });

// Virtual for full name
facultySchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
facultySchema.virtual('age').get(function () {
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

// Virtual for tenure
facultySchema.virtual('tenure').get(function () {
  if (!this.joiningDate) return 0;
  const today = new Date();
  const joining = new Date(this.joiningDate);
  const years = (today - joining) / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(years);
});

// Soft delete
facultySchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.status = 'INACTIVE';
};

// Query middleware
facultySchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
