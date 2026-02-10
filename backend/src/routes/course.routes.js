import express from 'express';
import courseController from '../controllers/course.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public (authenticated) routes
router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);

// Admin only routes
router.post(
  '/', 
  authorize('ADMIN', 'SUPER_ADMIN'), 
  courseController.create
);

router.put(
  '/:id', 
  authorize('ADMIN', 'SUPER_ADMIN'), 
  courseController.update
);

router.delete(
  '/:id', 
  authorize('ADMIN', 'SUPER_ADMIN'), 
  courseController.delete
);

export default router;
