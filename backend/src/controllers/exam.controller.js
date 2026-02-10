import examService from '../services/exam.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const createExam = asyncHandler(async (req, res) => {
  const exam = await examService.createExam(req.body);

  res.status(201).json({
    success: true,
    message: 'Exam created successfully',
    data: exam,
  });
});

export const getAllExams = asyncHandler(async (req, res) => {
  const filters = {
    course: req.query.course,
    subject: req.query.subject,
    semester: req.query.semester ? parseInt(req.query.semester) : undefined,
    type: req.query.type,
    status: req.query.status,
  };

  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
  };

  const result = await examService.getAllExams(filters, pagination);

  res.json({
    success: true,
    data: result,
  });
});

export const getExamById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exam = await examService.getExamById(id);

  res.json({
    success: true,
    data: exam,
  });
});

export const updateExam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exam = await examService.updateExam(id, req.body);

  res.json({
    success: true,
    message: 'Exam updated successfully',
    data: exam,
  });
});

export const deleteExam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await examService.deleteExam(id);

  res.json({
    success: true,
    message: result.message,
  });
});

export const publishExam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exam = await examService.publishExam(id);

  res.json({
    success: true,
    message: 'Exam published successfully',
    data: exam,
  });
});

export const getUpcomingExams = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const semester = req.query.semester ? parseInt(req.query.semester) : undefined;

  const exams = await examService.getUpcomingExams(courseId, semester);

  res.json({
    success: true,
    data: exams,
  });
});
