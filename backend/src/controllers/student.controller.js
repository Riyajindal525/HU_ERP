import { asyncHandler } from '../middlewares/errorHandler.js';
import studentService from '../services/student.service.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import encryptionUtil from '../utils/encryption.js';

class StudentController {
  /**
   * Create student account (Admin only)
   * POST /api/v1/students
   */
  create = asyncHandler(async (req, res) => {
    const { 
      firstName, 
      lastName, 
      email, 
      role,
      enrollmentNumber,
      dateOfBirth,
      gender,
      phone,
      guardianName,
      guardianPhone,
      guardianRelation,
      bloodGroup,
      category,
      address
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Check if enrollment number already exists
    if (enrollmentNumber) {
      const existingEnrollment = await Student.findOne({ enrollmentNumber });
      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: 'Student with this enrollment number already exists',
        });
      }
    }

    // Generate temporary password (6 digits)
    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user account
    const user = await User.create({
      email,
      password: tempPassword,
      role: role || 'STUDENT',
      firstName,
      lastName,
      emailVerified: false,
    });

    // Create student profile with all details
    const student = await Student.create({
      user: user._id,
      firstName,
      lastName,
      email,
      enrollmentNumber,
      dateOfBirth,
      gender,
      phone,
      guardianName,
      guardianPhone,
      guardianRelation,
      bloodGroup,
      category,
      address: address || {},
      status: 'ACTIVE'
    });

    // Log the temporary password (in production, send via email)
    console.log('##################################################');
    console.log(`# Student Account Created`);
    console.log(`# Name: ${firstName} ${lastName}`);
    console.log(`# Email: ${email}`);
    console.log(`# Enrollment Number: ${enrollmentNumber || 'Not provided'}`);
    console.log(`# Temporary Password: ${tempPassword}`);
    console.log(`# User should login with OTP instead`);
    console.log('##################################################');

    res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      data: {
        user: user.toJSON(),
        student,
        tempPassword, // Send in response for admin to share
      },
    });
  });

  /**
   * Get all students
   * GET /api/v1/students
   */
  getAll = asyncHandler(async (req, res) => {
    const result = await studentService.getAll(req.query);

    res.json({
      success: true,
      data: result,
    });
  });

  /**
   * Get student by ID
   * GET /api/v1/students/:id
   */
  getById = asyncHandler(async (req, res) => {
    const student = await studentService.getById(req.params.id);

    res.json({
      success: true,
      data: student,
    });
  });

  /**
   * Update student
   * PUT /api/v1/students/:id
   */
  update = asyncHandler(async (req, res) => {
    const student = await studentService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  });

  /**
   * Delete student
   * DELETE /api/v1/students/:id
   */
  delete = asyncHandler(async (req, res) => {
    await studentService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  });
}

export default new StudentController();
