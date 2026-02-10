import Subject from '../models/Subject.js';
import Faculty from '../models/Faculty.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

const subjectController = {
  // Get all subjects with optional filters
  getAll: async (req, res, next) => {
    try {
      const { search, course, semester, department } = req.query;
      const query = { isDeleted: false };

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      if (course) {
        query.course = course;
      }
      
      if (semester) {
        query.semester = semester;
      }

      if (department) {
        query.department = department;
      }

      const subjects = await Subject.find(query)
        .populate('course', 'name code')
        .populate('department', 'name code')
        .populate('facultyAssigned.faculty', 'firstName lastName email employeeId department')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get subject by ID
  getById: async (req, res, next) => {
    try {
      const subject = await Subject.findById(req.params.id)
        .populate('course', 'name code')
        .populate('department', 'name code')
        .populate('facultyAssigned.faculty', 'firstName lastName email employeeId department');

      if (!subject) {
        throw new NotFoundError('Subject not found');
      }

      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new subject
  create: async (req, res, next) => {
    try {
        const subject = await Subject.create(req.body);
        
        res.status(201).json({
            success: true,
            data: subject
        });
    } catch (error) {
        next(error);
    }
  },

  // Update subject
  update: async (req, res, next) => {
      try {
          const subject = await Subject.findByIdAndUpdate(
              req.params.id,
              req.body,
              { new: true, runValidators: true }
          );

          if (!subject) {
              throw new NotFoundError('Subject not found');
          }

          res.status(200).json({
              success: true,
              data: subject
          });
      } catch (error) {
          next(error);
      }
  },

  // Delete subject
  delete: async (req, res, next) => {
      try {
          const subject = await Subject.findById(req.params.id);

          if (!subject) {
              throw new NotFoundError('Subject not found');
          }

          // Soft delete
          subject.isDeleted = true;
          await subject.save();

          res.status(200).json({
              success: true,
              message: 'Subject deleted successfully'
          });
      } catch (error) {
          next(error);
      }
  },

  // Assign faculty to subject
  assignFaculty: async (req, res, next) => {
      try {
          const { facultyId, section, academicYear } = req.body;
          const subject = await Subject.findById(req.params.id);

          if (!subject) {
              throw new NotFoundError('Subject not found');
          }

          // Check if faculty exists
          const faculty = await Faculty.findById(facultyId);
          if (!faculty) {
              throw new NotFoundError('Faculty not found');
          }

          // Check if faculty is already assigned
          const existingAssignment = subject.facultyAssigned.find(
              fa => fa.faculty.toString() === facultyId && fa.section === section
          );

          if (existingAssignment) {
              throw new BadRequestError('Faculty already assigned to this section');
          }

          const currentAcademicYear = academicYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);

          // Add faculty assignment to subject
          subject.facultyAssigned.push({
              faculty: facultyId,
              section: section || '',
              academicYear: currentAcademicYear
          });

          await subject.save();

          // Also update Faculty's allocatedSubjects array
          const existingFacultySubject = faculty.allocatedSubjects.find(
              sub => sub.subject.toString() === subject._id.toString() && sub.section === section
          );

          if (!existingFacultySubject) {
              faculty.allocatedSubjects.push({
                  subject: subject._id,
                  semester: subject.semester,
                  academicYear: currentAcademicYear,
                  section: section || ''
              });
              await faculty.save();
          }

          // Populate and return
          await subject.populate('facultyAssigned.faculty', 'firstName lastName email department');

          res.status(200).json({
              success: true,
              data: subject
          });
      } catch (error) {
          next(error);
      }
  },

  // Unassign faculty from subject
  unassignFaculty: async (req, res, next) => {
      try {
          const { facultyId } = req.params;
          const subject = await Subject.findById(req.params.id);

          if (!subject) {
              throw new NotFoundError('Subject not found');
          }

          // Remove faculty assignment from subject
          subject.facultyAssigned = subject.facultyAssigned.filter(
              fa => fa.faculty.toString() !== facultyId
          );

          await subject.save();

          // Also remove from Faculty's allocatedSubjects
          const faculty = await Faculty.findById(facultyId);
          if (faculty) {
              faculty.allocatedSubjects = faculty.allocatedSubjects.filter(
                  sub => sub.subject.toString() !== subject._id.toString()
              );
              await faculty.save();
          }

          res.status(200).json({
              success: true,
              data: subject
          });
      } catch (error) {
          next(error);
      }
  }
};

export default subjectController;
