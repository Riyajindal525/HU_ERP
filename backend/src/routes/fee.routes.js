import express from 'express';
import * as feeController from '../controllers/fee.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

// Statistics - accessible by admin and fee clerk
router.get('/statistics', authorize('ADMIN', 'SUPER_ADMIN', 'FEE_CLERK'), feeController.getStatistics);

// Pending payments
router.get('/pending', authorize('ADMIN', 'SUPER_ADMIN', 'FEE_CLERK'), feeController.getPendingPayments);

// All payments
router.get('/payments', authorize('ADMIN', 'SUPER_ADMIN', 'FEE_CLERK'), feeController.getAllPayments);

// Record payment
router.post('/payments', authorize('ADMIN', 'SUPER_ADMIN', 'FEE_CLERK'), feeController.recordPayment);

// Student fees
router.get('/students/:studentId', authorize('ADMIN', 'SUPER_ADMIN', 'FEE_CLERK', 'STUDENT'), feeController.getStudentFees);

// Fee structures
router.get('/structures', authorize('ADMIN', 'SUPER_ADMIN', 'FEE_CLERK'), feeController.getAllFeeStructures);
router.post('/structures', authorize('ADMIN', 'SUPER_ADMIN'), feeController.createFeeStructure);
router.put('/structures/:id', authorize('ADMIN', 'SUPER_ADMIN'), feeController.updateFeeStructure);

export default router;
