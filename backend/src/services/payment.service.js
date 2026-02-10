import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import Fee from '../models/Fee.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

class PaymentService {
  /**
   * Create a pending fee payment request for a student
   */
  async create(data) {
    const { studentId, feeId, amount, semester, academicYear, remarks } = data;

    // Validate Student
    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Validate Fee Structure
    const fee = await Fee.findById(feeId);
    if (!fee) {
      throw new NotFoundError('Fee structure not found');
    }

    // Check if payment already exists for this fee
    const existingPayment = await Payment.findOne({
      student: studentId,
      fee: feeId,
      semester,
      academicYear,
      status: { $in: ['PENDING', 'SUCCESS'] } // Don't allow duplicates if pending or paid
    });

    if (existingPayment) {
      throw new BadRequestError('Payment request already exists for this fee');
    }

    // Create Payment Record (Pending)
    const payment = await Payment.create({
      student: studentId,
      fee: feeId,
      amount,
      semester,
      academicYear,
      method: 'CASH', // Default placeholder, will be updated on actual payment
      status: 'PENDING',
      remarks: remarks || 'Fee pending request created by Admin',
      // No transaction details yet as it's a request
    });

    return payment;
  }

  /**
   * Get all payments with filtering
   */
  async getAll(query) {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      studentId 
    } = query;

    const filter = {};
    if (status) filter.status = status;
    if (studentId) filter.student = studentId;

    const payments = await Payment.find(filter)
      .populate('student', 'firstName lastName enrollmentNumber')
      .populate('fee', 'components')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(filter);

    return {
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export default new PaymentService();
