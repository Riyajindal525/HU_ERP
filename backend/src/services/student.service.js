import Student from '../models/Student.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

class StudentService {
  /**
   * Get all students with pagination and filtering
   */
  async getAll(query) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      department,
      course,
      semester 
    } = query;

    const filter = {};
    if (department) filter.department = department;
    if (course) filter.course = course;
    if (semester) filter.currentSemester = semester;
    
    // Search by name or enrollment number
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(filter)
      .populate('user', 'email role isActive')
      .populate('department', 'name')
      .populate('course', 'name code')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filter);

    return {
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get student by ID
   */
  async getById(id) {
    const student = await Student.findById(id)
      .populate('user', 'email role isActive')
      .populate('department', 'name')
      .populate('course', 'name code');
      
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    return student;
  }

  /**
   * Update student (e.g., assign course, promote semester)
   */
  async update(id, data) {
    const student = await Student.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // If updating course, validate it exists
    if (data.course) {
      const courseExists = await Course.findById(data.course);
      if (!courseExists) {
        throw new BadRequestError('Invalid course ID');
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
    .populate('user', 'email role isActive')
    .populate('department', 'name')
    .populate('course', 'name code');

    return updatedStudent;
  }

  /**
   * Delete student (soft delete user and profile)
   */
  async delete(id) {
    const student = await Student.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Soft delete student profile
    student.softDelete();
    await student.save();

    // Soft delete associated user
    const user = await User.findById(student.user);
    if (user) {
      user.softDelete();
      await user.save();
    }

    return { message: 'Student and associated user deleted successfully' };
  }
}

export default new StudentService();
