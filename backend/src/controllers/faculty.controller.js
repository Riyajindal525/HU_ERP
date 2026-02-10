import { asyncHandler } from '../middlewares/errorHandler.js';
import facultyService from '../services/faculty.service.js';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';
import { NotFoundError } from '../utils/errors.js';

class FacultyController {
  /**
   * Create faculty account (Admin only)
   * POST /api/v1/faculty
   */
  create = asyncHandler(async (req, res) => {
    const faculty = await facultyService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Faculty account created successfully. Temporary password: TempPass@123 (Faculty should use OTP login)',
      data: faculty,
    });
  });

  /**
   * Get all faculty
   * GET /api/v1/faculty
   */
  getAll = asyncHandler(async (req, res) => {
    const result = await facultyService.getAll(req.query);

    res.json({
      success: true,
      data: result,
    });
  });

  /**
   * Get faculty by ID
   * GET /api/v1/faculty/:id
   */
  getById = asyncHandler(async (req, res) => {
    const faculty = await facultyService.getById(req.params.id);

    res.json({
      success: true,
      data: faculty,
    });
  });

  /**
   * Update faculty
   * PUT /api/v1/faculty/:id
   */
  update = asyncHandler(async (req, res) => {
    const faculty = await facultyService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Faculty updated successfully',
      data: faculty,
    });
  });

  /**
   * Delete faculty
   * DELETE /api/v1/faculty/:id
   */
  delete = asyncHandler(async (req, res) => {
    await facultyService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Faculty deleted successfully',
    });
  });

  /**
   * Get current faculty profile with assigned subjects
   * GET /api/v1/faculty/me
   */
  getMe = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    console.log('getMe called for user:', userId);

    // Find faculty profile by user ID
    const faculty = await Faculty.findOne({ user: userId })
      .populate('department', 'name code')
      .populate({
        path: 'allocatedSubjects.subject',
        select: 'name code semester credits type'
      })
      .lean();

    if (!faculty) {
      console.log('Faculty profile not found for user:', userId);
      throw new NotFoundError('Faculty profile not found');
    }

    console.log('Faculty found:', faculty._id);
    console.log('Allocated subjects count:', faculty.allocatedSubjects?.length || 0);

    // Calculate teaching hours (assuming each subject = 4 hours/week)
    const teachingHours = faculty.allocatedSubjects?.length * 4 || 0;

    // Get total classes this week (mock data for now)
    const totalClasses = faculty.allocatedSubjects?.length * 3 || 0;

    const responseData = {
      ...faculty,
      stats: {
        totalClasses,
        teachingHours,
        pendingTasks: 5, // TODO: Calculate from actual data
      }
    };

    console.log('Sending response with', responseData.allocatedSubjects?.length || 0, 'subjects');

    res.json({
      success: true,
      data: responseData
    });
  });
}

export default new FacultyController();
