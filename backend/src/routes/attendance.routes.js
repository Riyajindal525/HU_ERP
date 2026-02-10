import express from 'express';
import * as attendanceController from '../controllers/attendance.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { markAttendanceSchema, bulkAttendanceSchema, getAttendanceSchema } from '../validators/attendance.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Mark attendance (Faculty/Admin/Super Admin only)
router.post(
  '/',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  validate(markAttendanceSchema),
  attendanceController.markAttendance
);

// Bulk mark attendance (Faculty/Admin/Super Admin only)
router.post(
  '/bulk',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  validate(bulkAttendanceSchema),
  attendanceController.bulkMarkAttendance
);

// Get attendance records
router.get(
  '/',
  validate(getAttendanceSchema),
  attendanceController.getAttendance
);

// Get attendance percentage
router.get(
  '/percentage/:studentId/:subjectId',
  attendanceController.getAttendancePercentage
);

// Get student attendance summary
router.get(
  '/summary/:studentId',
  attendanceController.getStudentAttendanceSummary
);

// Delete attendance record (Admin/Faculty/Super Admin only)
router.delete(
  '/:id',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  attendanceController.deleteAttendance
);

// Admin attendance management routes
router.get(
  '/admin/overview',
  authorize('ADMIN', 'SUPER_ADMIN'),
  attendanceController.getAdminAttendanceOverview
);

router.get(
  '/admin/export',
  authorize('ADMIN', 'SUPER_ADMIN'),
  attendanceController.exportAttendance
);

export default router;
