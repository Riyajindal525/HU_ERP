import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

// Admin/Super Admin can create payment requests
router.post(
  '/', 
  authorize('ADMIN', 'SUPER_ADMIN'), 
  paymentController.create
);

// Admin/Super Admin/Student/Faculty can view payments 
// (Controller/Service should filter to only show own payments for Students)
router.get(
    '/',
    authorize('ADMIN', 'SUPER_ADMIN', 'STUDENT'),
    paymentController.getAll
);

export default router;
