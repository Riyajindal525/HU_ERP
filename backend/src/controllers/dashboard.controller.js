import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

class DashboardController {
  getStats = asyncHandler(async (req, res) => {
    const [
      totalStudents,
      totalFaculty,
      activeCourses,
      payments
    ] = await Promise.all([
      Student.countDocuments({ isDeleted: false }),
      Faculty.countDocuments({ isDeleted: false }),
      Course.countDocuments({ isDeleted: false, isActive: true }),
      Payment.find({ status: 'SUCCESS' }).select('amount') // Simple implementation for total revenue or similar if needed. Or just count.
    ]);

    // Calculate something like attendance rate or revenue?
    // For now, let's just return the counts requested by the UI.
    // UI has: Total Students, Faculty Members, Active Courses, Attendance Rate (Mock for now or 0)

    res.json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        activeCourses,
        attendanceRate: 0, // Placeholder as we don't have attendance module yet
      }
    });
  });
    getStudentDashboard = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    // Get student profile
    const student = await Student.findOne({ user: userId })
      .populate('course')
      .populate('department');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Calculate attendance percentage
    const Attendance = (await import('../models/Attendance.js')).default;
    const attendanceRecords = await Attendance.find({ student: student._id });
    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter(
      (record) => record.status === 'PRESENT' || record.status === 'LATE'
    ).length;
    const attendancePercentage = totalClasses > 0 
      ? Math.round((presentClasses / totalClasses) * 100) 
      : 0;

    // Calculate CGPA
    const Result = (await import('../models/Result.js')).default;
    const results = await Result.find({ 
      student: student._id,
      isPublished: true 
    }).populate('subject', 'credits');

    let totalCredits = 0;
    let weightedSum = 0;
    results.forEach((result) => {
      const credits = result.subject?.credits || 0;
      totalCredits += credits;
      weightedSum += result.gradePoint * credits;
    });
    const cgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

    // Get recent results (last 5)
    const recentResults = await Result.find({
      student: student._id,
      isPublished: true,
    })
      .populate('subject', 'name code')
      .populate('exam', 'name type')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get pending fees
    const Fee = (await import('../models/Fee.js')).default;
    const Payment = (await import('../models/Payment.js')).default;
    
    const fees = await Fee.find({
      course: student.course,
      semester: student.currentSemester,
    });
    
    const payments = await Payment.find({
      student: student._id,
      status: 'COMPLETED',
    });
    
    const totalFees = fees.reduce((sum, fee) => sum + fee.totalAmount, 0);
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingFees = Math.max(0, totalFees - totalPaid);

    // Get active courses count
    const Subject = (await import('../models/Subject.js')).default;
    const activeSubjects = await Subject.countDocuments({
      course: student.course,
      semester: student.currentSemester,
    });

    res.status(200).json({
      success: true,
      data: {
        attendance: attendancePercentage,
        cgpa: parseFloat(cgpa),
        pendingFees: pendingFees,
        activeCourses: activeSubjects,
        recentResults: recentResults,
      },
    });
  });

}

export default new DashboardController();
