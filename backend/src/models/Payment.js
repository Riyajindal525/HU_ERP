import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true,
    },
    fee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fee',
      required: [true, 'Fee is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    lateFine: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    method: {
      type: String,
      enum: ['ONLINE', 'CASH', 'CHEQUE', 'DD', 'UPI'],
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    chequeNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    upiId: {
      type: String,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
paymentSchema.index({ student: 1, fee: 1 });
paymentSchema.index({ student: 1, semester: 1, academicYear: 1 });
paymentSchema.index({ paymentDate: 1, status: 1 });

// Virtual for total amount (amount + late fine - discount)
paymentSchema.virtual('totalAmount').get(function () {
  return this.amount + (this.lateFine || 0) - (this.discount || 0);
});

// Generate receipt number before saving
paymentSchema.pre('save', async function (next) {
  if (!this.receiptNumber && this.status === 'SUCCESS') {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31),
      },
    });
    
    this.receiptNumber = `RCP${year}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Query middleware
paymentSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
