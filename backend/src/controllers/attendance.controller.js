import attendanceService from '../services/attendance.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const markAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.markAttendance(req.body, req.user.profileId);

  res.status(201).json({
    success: true,
    message: 'Attendance marked successfully',
    data: attendance,
  });
});

export const bulkMarkAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.bulkMarkAttendance(req.body, req.user.profileId);

  res.status(201).json({
    success: true,
    message: 'Bulk attendance marked',
    data: result,
  });
});

export const getAttendance = asyncHandler(async (req, res) => {
  const filters = {
    student: req.query.student,
    subject: req.query.subject,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    status: req.query.status,
  };

  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
  };

  const result = await attendanceService.getAttendance(filters, pagination);

  res.json({
    success: true,
    data: result,
  });
});

export const getAttendancePercentage = asyncHandler(async (req, res) => {
  const { studentId, subjectId } = req.params;

  const result = await attendanceService.getAttendancePercentage(studentId, subjectId);

  res.json({
    success: true,
    data: result,
  });
});

export const getStudentAttendanceSummary = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const summary = await attendanceService.getStudentAttendanceSummary(studentId);

  res.json({
    success: true,
    data: summary,
  });
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await attendanceService.deleteAttendance(id);

  res.json({
    success: true,
    message: result.message,
  });
});

// Admin attendance management endpoints
export const getAdminAttendanceOverview = asyncHandler(async (req, res) => {
  const filters = {
    department: req.query.department,
    course: req.query.course,
    semester: req.query.semester ? parseInt(req.query.semester) : undefined,
    subject: req.query.subject,
    student: req.query.student,
    faculty: req.query.faculty,
    status: req.query.status,
    section: req.query.section,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    academicYear: req.query.academicYear,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 50,
  };

  const result = await attendanceService.getAdminAttendanceOverview(filters);

  res.json({
    success: true,
    data: result,
  });
});

export const exportAttendance = asyncHandler(async (req, res) => {
  const filters = {
    department: req.query.department,
    course: req.query.course,
    semester: req.query.semester ? parseInt(req.query.semester) : undefined,
    subject: req.query.subject,
    student: req.query.student,
    faculty: req.query.faculty,
    status: req.query.status,
    section: req.query.section,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    academicYear: req.query.academicYear,
  };

  const data = await attendanceService.exportAttendanceData(filters);

  res.json({
    success: true,
    data: data,
    count: data.length,
  });
});
