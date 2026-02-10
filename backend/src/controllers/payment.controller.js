import { asyncHandler } from '../middlewares/errorHandler.js';
import paymentService from '../services/payment.service.js';

class PaymentController {
  /**
   * Create a payment request (Fee pending)
   * POST /api/v1/payments
   */
  create = asyncHandler(async (req, res) => {
    const payment = await paymentService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Payment request created successfully',
      data: payment,
    });
  });

  /**
   * Get all payments
   * GET /api/v1/payments
   */
  getAll = asyncHandler(async (req, res) => {
    const result = await paymentService.getAll(req.query);

    res.json({
      success: true,
      data: result,
    });
  });
}

export default new PaymentController();
