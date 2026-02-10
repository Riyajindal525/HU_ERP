import Department from '../models/Department.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { NotFoundError } from '../utils/errors.js';

class DepartmentService {
  async getAll() {
    return Department.find().sort({ name: 1 });
  }

  async getById(id) {
    const department = await Department.findById(id);
    if (!department) throw new NotFoundError('Department not found');
    return department;
  }

  async create(data) {
    return Department.create(data);
  }

  async update(id, data) {
    const department = await Department.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!department) throw new NotFoundError('Department not found');
    return department;
  }

  async delete(id) {
    const department = await Department.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
    if (!department) throw new NotFoundError('Department not found');
    return department;
  }

  async getStatistics(id) {
    const department = await Department.findById(id);
    if (!department) throw new NotFoundError('Department not found');

    // Get all courses in this department
    const courses = await Course.find({ department: id, isActive: true });
    const courseIds = courses.map(c => c._id);

    // Get all students in this department
    const students = await Student.find({ 
      department: id,
      status: 'ACTIVE'
    })
    .populate('course', 'name code')
    .select('firstName lastName enrollmentNumber currentSemester section course batch email phone')
    .sort({ currentSemester: 1, section: 1, lastName: 1 });

    // Group students by semester and section
    const studentsBySemester = {};
    const studentsBySection = {};
    const semesterSectionMatrix = {};

    students.forEach(student => {
      const semester = student.currentSemester || 1;
      const section = student.section || 'Unassigned';
      
      // By semester
      if (!studentsBySemester[semester]) {
        studentsBySemester[semester] = [];
      }
      studentsBySemester[semester].push(student);

      // By section
      if (!studentsBySection[section]) {
        studentsBySection[section] = [];
      }
      studentsBySection[section].push(student);

      // By semester and section
      const key = `${semester}-${section}`;
      if (!semesterSectionMatrix[key]) {
        semesterSectionMatrix[key] = {
          semester,
          section,
          students: []
        };
      }
      semesterSectionMatrix[key].students.push(student);
    });

    // Calculate statistics
    const totalStudents = students.length;
    const totalCourses = courses.length;
    
    // Get unique semesters and sections
    const semesters = [...new Set(students.map(s => s.currentSemester || 1))].sort((a, b) => a - b);
    const sections = [...new Set(students.map(s => s.section || 'Unassigned'))].sort();

    return {
      department: {
        _id: department._id,
        name: department.name,
        code: department.code,
        hodName: department.hodName,
        description: department.description
      },
      totalStudents,
      totalCourses,
      courses: courses.map(c => ({
        _id: c._id,
        name: c.name,
        code: c.code,
        degree: c.degree
      })),
      semesters,
      sections,
      studentsBySemester: Object.keys(studentsBySemester).map(sem => ({
        semester: parseInt(sem),
        count: studentsBySemester[sem].length,
        students: studentsBySemester[sem]
      })).sort((a, b) => a.semester - b.semester),
      studentsBySection: Object.keys(studentsBySection).map(sec => ({
        section: sec,
        count: studentsBySection[sec].length,
        students: studentsBySection[sec]
      })).sort((a, b) => a.section.localeCompare(b.section)),
      semesterSectionMatrix: Object.values(semesterSectionMatrix).sort((a, b) => {
        if (a.semester !== b.semester) return a.semester - b.semester;
        return a.section.localeCompare(b.section);
      })
    };
  }
}

export default new DepartmentService();
