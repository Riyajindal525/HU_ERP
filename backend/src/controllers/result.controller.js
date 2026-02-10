import resultService from '../services/result.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const submitResult = asyncHandler(async (req, res) => {
  const result = await resultService.submitResult(req.body);

  res.status(201).json({
    success: true,
    message: 'Result submitted successfully',
    data: result,
  });
});

export const bulkSubmitResults = asyncHandler(async (req, res) => {
  const result = await resultService.bulkSubmitResults(req.body);

  res.status(201).json({
    success: true,
    message: 'Bulk results submitted',
    data: result,
  });
});

export const publishResults = asyncHandler(async (req, res) => {
  const { examId } = req.body;

  const result = await resultService.publishResults(examId);

  res.json({
    success: true,
    message: result.message,
    data: { count: result.count },
  });
});

export const getStudentResults = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  
  const filters = {
    exam: req.query.exam,
    subject: req.query.subject,
    semester: req.query.semester ? parseInt(req.query.semester) : undefined,
  };

  const results = await resultService.getStudentResults(studentId, filters);

  res.json({
    success: true,
    data: results,
  });
});

export const calculateSGPA = asyncHandler(async (req, res) => {
  const { studentId, semester } = req.params;

  const result = await resultService.calculateSGPA(studentId, parseInt(semester));

  res.json({
    success: true,
    data: result,
  });
});

export const calculateCGPA = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const result = await resultService.calculateCGPA(studentId);

  res.json({
    success: true,
    data: result,
  });
});

export const getExamResults = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  const result = await resultService.getExamResults(examId);

  res.json({
    success: true,
    data: result,
  });
});

export const deleteResult = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await resultService.deleteResult(id);

  res.json({
    success: true,
    message: result.message,
  });
});
