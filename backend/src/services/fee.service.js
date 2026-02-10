import Fee from '../models/Fee.js';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import logger from '../utils/logger.js';

class FeeService {
  // Get fee statistics
  async getStatistics() {
    const [
      totalStudents,
      paidCount,
      pendingCount,
      totalRevenue,
      pendingAmount
    ] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Payment.countDocuments({ status: 'SUCCESS' }),
      Payment.countDocuments({ status: 'PENDING' }),
      Payment.aggregate([
        { $match: { status: 'SUCCESS' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'PENDING' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    return {
      totalStudents,
      feesPaid: paidCount,
      pendingFees: pendingCount,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0
    };
  }

  // Get pending fee payments with student details
  async getPendingPayments(filters = {}) {
    const { page = 1, limit = 20, department, semester } = filters;
    const skip = (page - 1) * limit;

    const matchStage = { status: 'PENDING' };
    if (semester) matchStage.semester = parseInt(semester);

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentData'
        }
      },
      { $unwind: '$studentData' },
      {
        $lookup: {
          from: 'departments',
          localField: 'studentData.department',
          foreignField: '_id',
          as: 'departmentData'
        }
      },
      { $unwind: { path: '$departmentData', preserveNullAndEmptyArrays: true } }
    ];

    if (department) {
      pipeline.push({
        $match: { 'departmentData.name': { $regex: department, $options: 'i' } }
      });
    }

    pipeline.push(
      {
        $project: {
          rollNumber: '$studentData.enrollmentNumber',
          studentName: {
            $concat: ['$studentData.firstName', ' ', '$studentData.lastName']
          },
          department: '$departmentData.name',
          semester: 1,
          amount: 1,
          lateFine: 1,
          dueDate: '$fee.dueDate',
          academicYear: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const [payments, total] = await Promise.all([
      Payment.aggregate(pipeline),
      Payment.countDocuments(matchStage)
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get all payments with filters
  async getAllPayments(filters = {}) {
    const { page = 1, limit = 20, status, semester, search } = filters;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (semester) query.semester = parseInt(semester);

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('student', 'firstName lastName enrollmentNumber')
        .populate('fee')
        .populate('processedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(query)
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Record a payment
  async recordPayment(paymentData, userId) {
    const { studentId, feeId, amount, method, transactionId, remarks } = paymentData;

    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      throw new NotFoundError('Fee structure not found');
    }

    const lateFine = fee.calculateLateFine();

    const payment = await Payment.create({
      student: studentId,
      fee: feeId,
      amount,
      lateFine,
      method,
      status: 'SUCCESS',
      transactionId,
      semester: fee.semester,
      academicYear: fee.academicYear,
      remarks,
      processedBy: userId,
      paymentDate: new Date()
    });

    await payment.populate([
      { path: 'student', select: 'firstName lastName enrollmentNumber' },
      { path: 'fee' },
      { path: 'processedBy', select: 'firstName lastName' }
    ]);

    logger.info(`Payment recorded: ${payment.receiptNumber} for student ${student.enrollmentNumber}`);
    return payment;
  }

  // Get student fee details
  async getStudentFees(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const payments = await Payment.find({ student: studentId })
      .populate('fee')
      .sort({ createdAt: -1 })
      .lean();

    const paidPayments = payments.filter(p => p.status === 'SUCCESS');
    const pendingPayments = payments.filter(p => p.status === 'PENDING');

    const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      student: {
        name: `${student.firstName} ${student.lastName}`,
        enrollmentNumber: student.enrollmentNumber,
        department: student.department
      },
      summary: {
        totalPaid,
        totalPending,
        paidCount: paidPayments.length,
        pendingCount: pendingPayments.length
      },
      payments: {
        paid: paidPayments,
        pending: pendingPayments
      }
    };
  }

  // Create fee structure
  async createFeeStructure(feeData, userId) {
    const existing = await Fee.findOne({
      course: feeData.course,
      semester: feeData.semester,
      academicYear: feeData.academicYear
    });

    if (existing) {
      throw new BadRequestError('Fee structure already exists for this course, semester, and academic year');
    }

    const fee = await Fee.create(feeData);
    logger.info(`Fee structure created for course ${feeData.course}, semester ${feeData.semester}`);
    return fee;
  }

  // Update fee structure
  async updateFeeStructure(feeId, updateData) {
    const fee = await Fee.findByIdAndUpdate(
      feeId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!fee) {
      throw new NotFoundError('Fee structure not found');
    }

    logger.info(`Fee structure updated: ${feeId}`);
    return fee;
  }

  // Get all fee structures
  async getAllFeeStructures(filters = {}) {
    const { page = 1, limit = 20, course, semester } = filters;
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    if (course) query.course = course;
    if (semester) query.semester = parseInt(semester);

    const [fees, total] = await Promise.all([
      Fee.find(query)
        .populate('course', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Fee.countDocuments(query)
    ]);

    return {
      fees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

export default new FeeService();
