import express from 'express';
import facultyController from '../controllers/faculty.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

// Faculty - Get own profile
router.get(
  '/me',
  authorize('FACULTY'),
  facultyController.getMe
);

// Admin only - Create faculty account
router.post(
  '/',
  authorize('ADMIN', 'SUPER_ADMIN'),
  facultyController.create
);

// Admin/Faculty/Student routes (Students can maybe see faculty list?)
router.get(
  '/', 
  authorize('ADMIN', 'SUPER_ADMIN', 'FACULTY', 'STUDENT'), 
  facultyController.getAll
);

router.get(
  '/:id', 
  authorize('ADMIN', 'SUPER_ADMIN', 'FACULTY'), 
  facultyController.getById
);

// Admin only routes
router.put(
  '/:id', 
  authorize('ADMIN', 'SUPER_ADMIN'), 
  facultyController.update
);

router.delete(
  '/:id', 
  authorize('ADMIN', 'SUPER_ADMIN'), 
  facultyController.delete
);

export default router;
