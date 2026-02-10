import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

//Admin dashboard stats
router.get('/stats', authorize('ADMIN', 'SUPER_ADMIN'), dashboardController.getStats);
// Student dashboard summary
router.get(
  '/student',
  authorize('STUDENT'),
  dashboardController.getStudentDashboard
);

export default router;
