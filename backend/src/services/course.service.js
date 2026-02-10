import Course from '../models/Course.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

class CourseService {
  /**
   * Create a new course
   */
  async create(data) {
    const existingCourse = await Course.findOne({ code: data.code });
    if (existingCourse) {
      throw new BadRequestError('Course with this code already exists');
    }

    const course = await Course.create(data);
    return course;
  }

  /**
   * Get all courses with pagination and filtering
   */
  async getAll(query) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      department,
      degree 
    } = query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (degree) filter.degree = degree;

    const courses = await Course.find(filter)
      .populate('department', 'name code')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    return {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get course by ID
   */
  async getById(id) {
    const course = await Course.findById(id).populate('department', 'name code');
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course;
  }

  /**
   * Update course
   */
  async update(id, data) {
    const course = await Course.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('department', 'name code');

    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course;
  }

  /**
   * Delete course (soft delete)
   */
  async delete(id) {
    const course = await Course.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    course.isDeleted = true;
    course.isActive = false;
    await course.save();

    return { message: 'Course deleted successfully' };
  }
}

export default new CourseService();
