import Faculty from '../models/Faculty.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

class FacultyService {
  /**
   * Create new faculty member
   */
  async create(data) {
    const { firstName, lastName, email, password, department, designation, phone } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    // Create user account
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: password || 'TempPass@123', // Temporary password
      role: 'FACULTY',
      emailVerified: true
    });

    // Create faculty profile
    const faculty = await Faculty.create({
      user: user._id,
      firstName,
      lastName,
      email,
      department,
      designation: designation || 'ASSISTANT_PROFESSOR',
      phone,
      status: 'ACTIVE'
    });

    await faculty.populate('user', 'email role isActive');
    await faculty.populate('department', 'name');

    return faculty;
  }

  /**
   * Get all faculty with pagination and filtering
   */
  async getAll(query) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      department,
      designation 
    } = query;

    const filter = {};
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    
    // Search by name or employee ID
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const faculty = await Faculty.find(filter)
      .populate('user', 'email role isActive')
      .populate('department', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Faculty.countDocuments(filter);

    return {
      faculty,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get faculty by ID
   */
  async getById(id) {
    const faculty = await Faculty.findById(id)
      .populate('user', 'email role isActive')
      .populate('department', 'name')
      .populate('allocatedSubjects.subject', 'name code');
      
    if (!faculty) {
      throw new NotFoundError('Faculty not found');
    }
    return faculty;
  }

  /**
   * Update faculty (e.g., allocate subjects)
   */
  async update(id, data) {
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      throw new NotFoundError('Faculty not found');
    }

    // Logic for subject allocation validation could go here if needed

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
    .populate('user', 'email role isActive')
    .populate('department', 'name');

    return updatedFaculty;
  }

  /**
   * Delete faculty (soft delete user and profile)
   */
  async delete(id) {
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      throw new NotFoundError('Faculty not found');
    }

    // Soft delete faculty profile
    faculty.softDelete();
    await faculty.save();

    // Soft delete associated user
    const user = await User.findById(faculty.user);
    if (user) {
      user.softDelete();
      await user.save();
    }

    return { message: 'Faculty and associated user deleted successfully' };
  }
}

export default new FacultyService();
