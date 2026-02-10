import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

class AttendanceService {
  async markAttendance(attendanceData, facultyId) {
    const { student, subject, date, status, remarks, session } = attendanceData;

    // Verify student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      throw new NotFoundError('Student not found');
    }

    // Verify subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      throw new NotFoundError('Subject not found');
    }

    // Get current academic year (e.g., "2025-2026")
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    // Check if attendance already marked for this date and session
    const existingAttendance = await Attendance.findOne({
      student,
      subject,
      date: new Date(date).setHours(0, 0, 0, 0),
      session: session || 'MORNING',
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.remarks = remarks;
      existingAttendance.faculty = facultyId;
      await existingAttendance.save();
      
      logger.info(`Attendance updated for student ${student} on ${date}`);
      return existingAttendance;
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      student,
      subject,
      faculty: facultyId,
      date,
      status,
      remarks,
      session: session || 'MORNING',
      semester: studentExists.currentSemester || 1,
      academicYear,
    });

    logger.info(`Attendance marked for student ${student} on ${date}`);
    return attendance;
  }

  async bulkMarkAttendance(bulkData, facultyId) {
    const { subject, date, attendanceRecords, session } = bulkData;

    // Verify subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      throw new NotFoundError('Subject not found');
    }

    const results = [];
    const errors = [];

    for (const record of attendanceRecords) {
      try {
        const attendance = await this.markAttendance(
          {
            student: record.student,
            subject,
            date,
            status: record.status,
            remarks: record.remarks,
            session: session || 'MORNING',
          },
          facultyId
        );
        results.push(attendance);
      } catch (error) {
        errors.push({
          student: record.student,
          error: error.message,
        });
      }
    }

    logger.info(`Bulk attendance marked: ${results.length} success, ${errors.length} errors`);
    return { results, errors };
  }

  async getAttendance(filters, pagination) {
    const { student, subject, startDate, endDate, status } = filters;
    const { page = 1, limit = 20 } = pagination;

    const query = {};

    if (student) query.student = student;
    if (subject) query.subject = subject;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [attendance, total] = await Promise.all([
      Attendance.find(query)
        .populate('student', 'firstName lastName enrollmentNumber')
        .populate('subject', 'name code')
        .populate('faculty', 'firstName lastName')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Attendance.countDocuments(query),
    ]);

    return {
      attendance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getAttendancePercentage(studentId, subjectId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const percentage = await Attendance.calculateAttendancePercentage(studentId, subjectId);
    
    return {
      studentId,
      subjectId,
      percentage,
    };
  }

  async getStudentAttendanceSummary(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Get all subjects for the student
    const subjects = await Subject.find({ course: student.course });

    const summary = await Promise.all(
      subjects.map(async (subject) => {
        const percentage = await Attendance.calculateAttendancePercentage(
          studentId,
          subject._id
        );

        const attendanceRecords = await Attendance.find({
          student: studentId,
          subject: subject._id,
        }).countDocuments();

        return {
          subject: {
            id: subject._id,
            name: subject.name,
            code: subject.code,
          },
          percentage,
          totalClasses: attendanceRecords,
        };
      })
    );

    return summary;
  }

  async deleteAttendance(attendanceId) {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }

    await attendance.deleteOne();
    logger.info(`Attendance record ${attendanceId} deleted`);
    
    return { message: 'Attendance record deleted successfully' };
  }

  // Admin methods for attendance management
  async getAdminAttendanceOverview(filters = {}) {
    const { 
      department, 
      course, 
      semester, 
      subject, 
      student,
      faculty,
      status,
      section,
      startDate, 
      endDate,
      academicYear,
      page = 1, 
      limit = 50 
    } = filters;

    const query = {};

    // Build query based on filters
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (faculty) query.faculty = faculty;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    // Build aggregation pipeline
    const pipeline = [
      { $match: query },
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
          from: 'subjects',
          localField: 'subject',
          foreignField: '_id',
          as: 'subjectData'
        }
      },
      { $unwind: '$subjectData' },
      {
        $lookup: {
          from: 'faculties',
          localField: 'faculty',
          foreignField: '_id',
          as: 'facultyData'
        }
      },
      { $unwind: '$facultyData' },
      {
        $lookup: {
          from: 'departments',
          localField: 'studentData.department',
          foreignField: '_id',
          as: 'departmentData'
        }
      },
      { $unwind: { path: '$departmentData', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'courses',
          localField: 'studentData.course',
          foreignField: '_id',
          as: 'courseData'
        }
      },
      { $unwind: { path: '$courseData', preserveNullAndEmptyArrays: true } }
    ];

    // Add additional filters after lookups
    const additionalMatch = {};
    if (department) additionalMatch['departmentData._id'] = new mongoose.Types.ObjectId(department);
    if (course) additionalMatch['courseData._id'] = new mongoose.Types.ObjectId(course);
    if (student) additionalMatch['studentData._id'] = new mongoose.Types.ObjectId(student);
    if (section) additionalMatch['studentData.section'] = section;

    if (Object.keys(additionalMatch).length > 0) {
      pipeline.push({ $match: additionalMatch });
    }

    // Add sorting and pagination
    pipeline.push(
      { $sort: { date: -1, markedAt: -1 } },
      {
        $project: {
          _id: 1,
          date: 1,
          status: 1,
          session: 1,
          period: 1,
          remarks: 1,
          semester: 1,
          academicYear: 1,
          markedAt: 1,
          student: {
            _id: '$studentData._id',
            firstName: '$studentData.firstName',
            lastName: '$studentData.lastName',
            enrollmentNumber: '$studentData.enrollmentNumber',
            email: '$studentData.email',
            section: '$studentData.section'
          },
          subject: {
            _id: '$subjectData._id',
            name: '$subjectData.name',
            code: '$subjectData.code'
          },
          faculty: {
            _id: '$facultyData._id',
            firstName: '$facultyData.firstName',
            lastName: '$facultyData.lastName',
            email: '$facultyData.email'
          },
          department: {
            _id: '$departmentData._id',
            name: '$departmentData.name',
            code: '$departmentData.code'
          },
          course: {
            _id: '$courseData._id',
            name: '$courseData.name',
            code: '$courseData.code'
          }
        }
      }
    );

    // Get total count
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: 'total' });
    const countResult = await Attendance.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    const attendance = await Attendance.aggregate(pipeline);

    // Calculate statistics
    const stats = await this.getAttendanceStatistics(query);

    return {
      attendance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: stats,
    };
  }

  async getAttendanceStatistics(query = {}) {
    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'ABSENT'] }, 1, 0]
            }
          },
          late: {
            $sum: {
              $cond: [{ $eq: ['$status', 'LATE'] }, 1, 0]
            }
          },
          onLeave: {
            $sum: {
              $cond: [{ $eq: ['$status', 'ON_LEAVE'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          present: 1,
          absent: 1,
          late: 1,
          onLeave: 1,
          presentPercentage: {
            $cond: [
              { $eq: ['$total', 0] },
              0,
              { $multiply: [{ $divide: ['$present', '$total'] }, 100] }
            ]
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      onLeave: 0,
      presentPercentage: 0
    };
  }

  async exportAttendanceData(filters = {}) {
    const { 
      department, 
      course, 
      semester, 
      subject, 
      student,
      faculty,
      status,
      section,
      startDate, 
      endDate,
      academicYear
    } = filters;

    const query = {};

    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (faculty) query.faculty = faculty;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Build aggregation pipeline for export
    const pipeline = [
      { $match: query },
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
          from: 'subjects',
          localField: 'subject',
          foreignField: '_id',
          as: 'subjectData'
        }
      },
      { $unwind: '$subjectData' },
      {
        $lookup: {
          from: 'faculties',
          localField: 'faculty',
          foreignField: '_id',
          as: 'facultyData'
        }
      },
      { $unwind: '$facultyData' },
      {
        $lookup: {
          from: 'departments',
          localField: 'studentData.department',
          foreignField: '_id',
          as: 'departmentData'
        }
      },
      { $unwind: { path: '$departmentData', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'courses',
          localField: 'studentData.course',
          foreignField: '_id',
          as: 'courseData'
        }
      },
      { $unwind: { path: '$courseData', preserveNullAndEmptyArrays: true } }
    ];

    // Add additional filters
    const additionalMatch = {};
    if (department) additionalMatch['departmentData._id'] = new mongoose.Types.ObjectId(department);
    if (course) additionalMatch['courseData._id'] = new mongoose.Types.ObjectId(course);
    if (student) additionalMatch['studentData._id'] = new mongoose.Types.ObjectId(student);
    if (section) additionalMatch['studentData.section'] = section;

    if (Object.keys(additionalMatch).length > 0) {
      pipeline.push({ $match: additionalMatch });
    }

    pipeline.push(
      { $sort: { date: -1 } },
      {
        $project: {
          date: 1,
          status: 1,
          session: 1,
          period: 1,
          remarks: 1,
          semester: 1,
          academicYear: 1,
          studentName: { $concat: ['$studentData.firstName', ' ', '$studentData.lastName'] },
          enrollmentNumber: '$studentData.enrollmentNumber',
          studentEmail: '$studentData.email',
          section: '$studentData.section',
          subjectName: '$subjectData.name',
          subjectCode: '$subjectData.code',
          facultyName: { $concat: ['$facultyData.firstName', ' ', '$facultyData.lastName'] },
          departmentName: '$departmentData.name',
          courseName: '$courseData.name',
          markedAt: 1
        }
      }
    );

    const data = await Attendance.aggregate(pipeline);

    logger.info(`Exported ${data.length} attendance records`);
    return data;
  }
}

export default new AttendanceService();
