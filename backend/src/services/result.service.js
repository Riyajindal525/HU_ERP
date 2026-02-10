import Result from '../models/Result.js';
import Exam from '../models/Exam.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

class ResultService {
  async submitResult(resultData) {
    const { student, exam, subject, marksObtained, totalMarks } = resultData;

    // Verify student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      throw new NotFoundError('Student not found');
    }

    // Verify exam exists
    const examExists = await Exam.findById(exam);
    if (!examExists) {
      throw new NotFoundError('Exam not found');
    }

    // Verify subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      throw new NotFoundError('Subject not found');
    }

    // Validate marks
    if (marksObtained > totalMarks) {
      throw new ValidationError('Marks obtained cannot exceed total marks');
    }

    // Check if result already exists
    const existingResult = await Result.findOne({ student, exam, subject });
    if (existingResult) {
      // Update existing result
      existingResult.marksObtained = marksObtained;
      existingResult.totalMarks = totalMarks;
      existingResult.remarks = resultData.remarks;
      await existingResult.save();
      
      logger.info(`Result updated for student ${student} in exam ${exam}`);
      return existingResult;
    }

    // Create new result
    const result = await Result.create(resultData);
    logger.info(`Result submitted for student ${student} in exam ${exam}`);
    
    return result;
  }

  async bulkSubmitResults(bulkData) {
    const { exam, results } = bulkData;

    // Verify exam exists
    const examExists = await Exam.findById(exam);
    if (!examExists) {
      throw new NotFoundError('Exam not found');
    }

    const submittedResults = [];
    const errors = [];

    for (const resultData of results) {
      try {
        const result = await this.submitResult({
          ...resultData,
          exam,
        });
        submittedResults.push(result);
      } catch (error) {
        errors.push({
          student: resultData.student,
          error: error.message,
        });
      }
    }

    logger.info(`Bulk results submitted: ${submittedResults.length} success, ${errors.length} errors`);
    return { results: submittedResults, errors };
  }

  async publishResults(examId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    // Update all results for this exam to published
    const updateResult = await Result.updateMany(
      { exam: examId },
      { isPublished: true, publishedAt: new Date() }
    );

    logger.info(`Results published for exam ${examId}: ${updateResult.modifiedCount} results`);
    
    return {
      message: 'Results published successfully',
      count: updateResult.modifiedCount,
    };
  }

  async getStudentResults(studentId, filters = {}) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const query = { student: studentId };
    
    if (filters.exam) query.exam = filters.exam;
    if (filters.subject) query.subject = filters.subject;
    if (filters.semester) {
      const exams = await Exam.find({ semester: filters.semester }).select('_id');
      query.exam = { $in: exams.map(e => e._id) };
    }

    const results = await Result.find(query)
      .populate('exam', 'name type date totalMarks passingMarks')
      .populate('subject', 'name code credits')
      .sort({ 'exam.date': -1 })
      .lean();

    return results;
  }

  async calculateSGPA(studentId, semester) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const sgpa = await Result.calculateSGPA(studentId, semester);
    
    return {
      studentId,
      semester,
      sgpa,
    };
  }

  async calculateCGPA(studentId) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const cgpa = await Result.calculateCGPA(studentId);
    
    return {
      studentId,
      cgpa,
    };
  }

  async getExamResults(examId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    const results = await Result.find({ exam: examId })
      .populate('student', 'firstName lastName enrollmentNumber')
      .populate('subject', 'name code')
      .sort({ marksObtained: -1 })
      .lean();

    // Calculate statistics
    const totalStudents = results.length;
    const passed = results.filter(r => r.grade !== 'F').length;
    const failed = totalStudents - passed;
    const averageMarks = totalStudents > 0
      ? results.reduce((sum, r) => sum + r.marksObtained, 0) / totalStudents
      : 0;

    return {
      exam,
      results,
      statistics: {
        totalStudents,
        passed,
        failed,
        passPercentage: totalStudents > 0 ? (passed / totalStudents) * 100 : 0,
        averageMarks: averageMarks.toFixed(2),
      },
    };
  }

  async deleteResult(resultId) {
    const result = await Result.findById(resultId);
    if (!result) {
      throw new NotFoundError('Result not found');
    }

    if (result.isPublished) {
      throw new ValidationError('Cannot delete published result');
    }

    await result.deleteOne();
    logger.info(`Result deleted: ${resultId}`);
    
    return { message: 'Result deleted successfully' };
  }
}

export default new ResultService();
