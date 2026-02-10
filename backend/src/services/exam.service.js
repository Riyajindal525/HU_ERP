import Exam from '../models/Exam.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

class ExamService {
  async createExam(examData) {
    const { course, subject, passingMarks, totalMarks } = examData;

    // Verify course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      throw new NotFoundError('Course not found');
    }

    // Verify subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      throw new NotFoundError('Subject not found');
    }

    // Validate passing marks
    if (passingMarks > totalMarks) {
      throw new ValidationError('Passing marks cannot exceed total marks');
    }

    const exam = await Exam.create(examData);
    logger.info(`Exam created: ${exam.name} (${exam._id})`);
    
    return exam;
  }

  async getAllExams(filters, pagination) {
    const { course, subject, semester, type, status } = filters;
    const { page = 1, limit = 20 } = pagination;

    const query = {};

    if (course) query.course = course;
    if (subject) query.subject = subject;
    if (semester) query.semester = semester;
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [exams, total] = await Promise.all([
      Exam.find(query)
        .populate('subject', 'name code')
        .populate('course', 'name code')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Exam.countDocuments(query),
    ]);

    return {
      exams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getExamById(examId) {
    const exam = await Exam.findById(examId)
      .populate('subject', 'name code credits')
      .populate('course', 'name code duration')
      .lean();

    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    return exam;
  }

  async updateExam(examId, updateData) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    // Validate passing marks if being updated
    if (updateData.passingMarks || updateData.totalMarks) {
      const passingMarks = updateData.passingMarks || exam.passingMarks;
      const totalMarks = updateData.totalMarks || exam.totalMarks;
      
      if (passingMarks > totalMarks) {
        throw new ValidationError('Passing marks cannot exceed total marks');
      }
    }

    Object.assign(exam, updateData);
    await exam.save();

    logger.info(`Exam updated: ${examId}`);
    return exam;
  }

  async deleteExam(examId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    // Check if exam has results
    const Result = (await import('../models/Result.js')).default;
    const hasResults = await Result.exists({ exam: examId });
    
    if (hasResults) {
      throw new ValidationError('Cannot delete exam with existing results');
    }

    await exam.deleteOne();
    logger.info(`Exam deleted: ${examId}`);
    
    return { message: 'Exam deleted successfully' };
  }

  async publishExam(examId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    exam.status = 'SCHEDULED';
    await exam.save();

    logger.info(`Exam published: ${examId}`);
    return exam;
  }

  async getUpcomingExams(courseId, semester) {
    const query = {
      course: courseId,
      status: 'SCHEDULED',
      date: { $gte: new Date() },
    };

    if (semester) {
      query.semester = semester;
    }

    const exams = await Exam.find(query)
      .populate('subject', 'name code')
      .sort({ date: 1 })
      .limit(10)
      .lean();

    return exams;
  }
}

export default new ExamService();
