import express from 'express';
import * as examController from '../controllers/exam.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { createExamSchema, updateExamSchema } from '../validators/exam.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all exams
router.get('/', examController.getAllExams);

// Get exam by ID
router.get('/:id', examController.getExamById);

// Get upcoming exams for a course
router.get('/upcoming/:courseId', examController.getUpcomingExams);

// Create exam (Admin/Faculty/Super Admin only)
router.post(
  '/',
  authorize('ADMIN', 'FACULTY', 'SUPER_ADMIN'),
  validate(createExamSchema),
  examController.createExam
);

// Update exam (Admin/Faculty/Super Admin only)
router.put(
  '/:id',
  authorize('ADMIN', 'FACULTY', 'SUPER_ADMIN'),
  validate(updateExamSchema),
  examController.updateExam
);

// Publish exam (Admin/Super Admin only)
router.patch(
  '/:id/publish',
  authorize('ADMIN', 'SUPER_ADMIN'),
  examController.publishExam
);

// Delete exam (Admin/Super Admin only)
router.delete(
  '/:id',
  authorize('ADMIN', 'SUPER_ADMIN'),
  examController.deleteExam
);

export default router;
