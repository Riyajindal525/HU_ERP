import express from 'express';
import * as resultController from '../controllers/result.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { submitResultSchema, bulkResultSchema, publishResultSchema } from '../validators/result.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Submit result (Faculty/Admin/Super Admin only)
router.post(
  '/',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  validate(submitResultSchema),
  resultController.submitResult
);

// Bulk submit results (Faculty/Admin/Super Admin only)
router.post(
  '/bulk',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  validate(bulkResultSchema),
  resultController.bulkSubmitResults
);

// Publish results (Admin/Super Admin only)
router.post(
  '/publish',
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(publishResultSchema),
  resultController.publishResults
);

// Get student results
router.get(
  '/student/:studentId',
  resultController.getStudentResults
);

// Calculate SGPA
router.get(
  '/sgpa/:studentId/:semester',
  resultController.calculateSGPA
);

// Calculate CGPA
router.get(
  '/cgpa/:studentId',
  resultController.calculateCGPA
);

// Get exam results
router.get(
  '/exam/:examId',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  resultController.getExamResults
);

// Delete result (Admin/Super Admin only)
router.delete(
  '/:id',
  authorize('ADMIN', 'SUPER_ADMIN'),
  resultController.deleteResult
);

export default router;
