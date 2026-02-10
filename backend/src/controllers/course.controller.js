import { asyncHandler } from '../middlewares/errorHandler.js';
import courseService from '../services/course.service.js';

class CourseController {
  /**
   * Create a new course
   * POST /api/v1/courses
   */
  create = asyncHandler(async (req, res) => {
    const course = await courseService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  });

  /**
   * Get all courses
   * GET /api/v1/courses
   */
  getAll = asyncHandler(async (req, res) => {
    const result = await courseService.getAll(req.query);

    res.json({
      success: true,
      data: result,
    });
  });

  /**
   * Get course by ID
   * GET /api/v1/courses/:id
   */
  getById = asyncHandler(async (req, res) => {
    const course = await courseService.getById(req.params.id);

    res.json({
      success: true,
      data: course,
    });
  });

  /**
   * Update course
   * PUT /api/v1/courses/:id
   */
  update = asyncHandler(async (req, res) => {
    const course = await courseService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  });

  /**
   * Delete course
   * DELETE /api/v1/courses/:id
   */
  delete = asyncHandler(async (req, res) => {
    await courseService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  });
}

export default new CourseController();
