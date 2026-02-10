import { asyncHandler } from '../middlewares/errorHandler.js';
import feeService from '../services/fee.service.js';

export const getStatistics = asyncHandler(async (req, res) => {
  const stats = await feeService.getStatistics();
  res.json({ success: true, data: stats });
});

export const getPendingPayments = asyncHandler(async (req, res) => {
  const result = await feeService.getPendingPayments(req.query);
  res.json({ success: true, data: result });
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const result = await feeService.getAllPayments(req.query);
  res.json({ success: true, data: result });
});

export const recordPayment = asyncHandler(async (req, res) => {
  const payment = await feeService.recordPayment(req.body, req.user.id);
  res.status(201).json({ success: true, data: payment });
});

export const getStudentFees = asyncHandler(async (req, res) => {
  const result = await feeService.getStudentFees(req.params.studentId);
  res.json({ success: true, data: result });
});

export const createFeeStructure = asyncHandler(async (req, res) => {
  const fee = await feeService.createFeeStructure(req.body, req.user.id);
  res.status(201).json({ success: true, data: fee });
});

export const updateFeeStructure = asyncHandler(async (req, res) => {
  const fee = await feeService.updateFeeStructure(req.params.id, req.body);
  res.json({ success: true, data: fee });
});

export const getAllFeeStructures = asyncHandler(async (req, res) => {
  const result = await feeService.getAllFeeStructures(req.query);
  res.json({ success: true, data: result });
});
