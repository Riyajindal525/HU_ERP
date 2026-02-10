import express from 'express';
import studentController from '../controllers/student.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only - Create student account
router.post(
  '/',
  authorize('ADMIN', 'SUPER_ADMIN'),
  studentController.create
);

// Admin/Faculty routes
router.get(
  '/', 
  authorize('ADMIN', 'SUPER_ADMIN', 'FACULTY'), 
  studentController.getAll
);

router.get(
  '/:id', 
  authorize('ADMIN', 'SUPER_ADMIN', 'FACULTY'), 
  studentController.getById
);

// Admin only routes
router.put(
  '/:id', 
  authorize('ADMIN', 'SUPER_ADMIN'), 
  studentController.update
);

router.delete(
  '/:id', 
  authorize('ADMIN', 'SUPER_ADMIN'), 
  studentController.delete
);

export default router;
