import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  Download, 
  Filter, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Search,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AttendanceManagement = () => {
  const [filters, setFilters] = useState({
    department: '',
    course: '',
    semester: '',
    subject: '',
    student: '',
    faculty: '',
    status: '',
    section: '',
    startDate: '',
    endDate: '',
    academicYear: '',
    page: 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch departments
  const { data: departmentsData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments'),
  });

  // Fetch courses based on selected department
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', filters.department],
    queryFn: async () => {
      console.log('Fetching courses for department:', filters.department);
      if (filters.department) {
        const response = await api.get(`/courses?department=${filters.department}`);
        console.log('Courses response (filtered):', response);
        return response;
      }
      const response = await api.get('/courses');
      console.log('Courses response (all):', response);
      return response;
    },
  });

  // Fetch subjects based on selected course
  const { data: subjectsData } = useQuery({
    queryKey: ['subjects', filters.course],
    queryFn: async () => {
      if (filters.course) {
        return api.get(`/subjects?course=${filters.course}`);
      }
      return api.get('/subjects');
    },
  });

  // Fetch students
  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get('/students'),
  });

  // Fetch faculty
  const { data: facultyData } = useQuery({
    queryKey: ['faculty'],
    queryFn: () => api.get('/faculty'),
  });

  // Fetch attendance data
  const { data: attendanceData, isLoading, refetch } = useQuery({
    queryKey: ['admin-attendance', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return api.get(`/attendance/admin/overview?${params.toString()}`);
    },
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value, page: 1 };
      
      // Cascading filters: when department changes to a specific value, reset course and subject
      if (key === 'department' && value !== '') {
        newFilters.course = '';
        newFilters.subject = '';
      }
      
      // When course changes to a specific value, reset subject
      if (key === 'course' && value !== '') {
        newFilters.subject = '';
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      course: '',
      semester: '',
      subject: '',
      student: '',
      faculty: '',
      status: '',
      section: '',
      startDate: '',
      endDate: '',
      academicYear: '',
      page: 1,
    });
  };

  const handleExport = async (format = 'csv') => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'page') params.append(key, value);
      });

      const response = await api.get(`/attendance/admin/export?${params.toString()}`);
      const data = response.data.data;

      if (format === 'csv') {
        exportToCSV(data);
      } else if (format === 'json') {
        exportToJSON(data);
      }

      toast.success(`Attendance data exported successfully`);
    } catch (error) {
      toast.error('Failed to export attendance data');
    }
  };

  const exportToCSV = (data) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'Date',
      'Student Name',
      'Enrollment Number',
      'Section',
      'Student Email',
      'Subject Name',
      'Subject Code',
      'Faculty Name',
      'Department',
      'Course',
      'Semester',
      'Academic Year',
      'Status',
      'Session',
      'Period',
      'Remarks',
      'Marked At'
    ];

    const csvRows = [headers.join(',')];

    data.forEach(record => {
      const row = [
        new Date(record.date).toLocaleDateString(),
        record.studentName || '',
        record.enrollmentNumber || '',
        record.section || '',
        record.studentEmail || '',
        record.subjectName || '',
        record.subjectCode || '',
        record.facultyName || '',
        record.departmentName || '',
        record.courseName || '',
        record.semester || '',
        record.academicYear || '',
        record.status || '',
        record.session || '',
        record.period || '',
        record.remarks || '',
        new Date(record.markedAt).toLocaleString()
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const attendance = attendanceData?.data?.attendance || [];
  const statistics = attendanceData?.data?.statistics || {};
  const pagination = attendanceData?.data?.pagination || {};

  // Extract and validate data arrays
  const departments = Array.isArray(departmentsData?.data) ? departmentsData.data : [];
  
  // Courses data structure: {courses: [...], pagination: {...}}
  const courses = Array.isArray(coursesData?.data?.courses) 
    ? coursesData.data.courses 
    : Array.isArray(coursesData?.data) 
    ? coursesData.data 
    : [];
  
  // Subjects data might have similar structure
  const subjects = Array.isArray(subjectsData?.data?.subjects)
    ? subjectsData.data.subjects
    : Array.isArray(subjectsData?.data) 
    ? subjectsData.data 
    : [];
  
  const students = Array.isArray(studentsData?.data) ? studentsData.data : [];
  const faculty = Array.isArray(facultyData?.data) ? facultyData.data : [];

  // Debug logging
  console.log('=== ATTENDANCE MANAGEMENT DEBUG ===');
  console.log('Departments data:', departments);
  console.log('Courses raw data:', coursesData?.data);
  console.log('Courses extracted:', courses);
  console.log('Courses loading:', coursesLoading);
  console.log('Subjects data:', subjects);
  console.log('Current filters:', filters);
  console.log('===================================');

  const statusColors = {
    PRESENT: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    ABSENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    LATE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    ON_LEAVE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const statusIcons = {
    PRESENT: CheckCircle,
    ABSENT: XCircle,
    LATE: Clock,
    ON_LEAVE: FileText,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-8 w-8 mr-3" />
          Attendance Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage student attendance records
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statistics.total || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {statistics.present || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {statistics.absent || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance %</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {statistics.presentPercentage?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="btn btn-primary flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Export JSON
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}{dept.code ? ` (${dept.code})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course {coursesLoading && <span className="text-xs text-gray-500">(Loading...)</span>}
                  </label>
                  <select
                    value={filters.course}
                    onChange={(e) => handleFilterChange('course', e.target.value)}
                    className="input w-full"
                    disabled={coursesLoading}
                  >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name}{course.code ? ` (${course.code})` : ''}
                      </option>
                    ))}
                  </select>
                  {courses.length === 0 && !coursesLoading && filters.department && (
                    <p className="text-xs text-orange-500 mt-1">No courses for this department. Try selecting "All Departments".</p>
                  )}
                </div>

                {/* Semester Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={filters.semester}
                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                {/* Section Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Section
                  </label>
                  <select
                    value={filters.section}
                    onChange={(e) => handleFilterChange('section', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Sections</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}{subject.code ? ` (${subject.code})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Faculty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Faculty
                  </label>
                  <select
                    value={filters.faculty}
                    onChange={(e) => handleFilterChange('faculty', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Faculty</option>
                    {faculty.map(fac => (
                      <option key={fac._id} value={fac._id}>
                        {fac.firstName} {fac.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Student
                  </label>
                  <select
                    value={filters.student}
                    onChange={(e) => handleFilterChange('student', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Students</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.firstName} {student.lastName} ({student.enrollmentNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">All Status</option>
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="input w-full"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="input w-full"
                  />
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={filters.academicYear}
                    onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                    placeholder="e.g., 2025-2026"
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Attendance Records
          </h2>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading attendance records...</p>
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No attendance records found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {attendance.map((record) => {
                    const StatusIcon = statusIcons[record.status] || CheckCircle;
                    return (
                      <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.student?.firstName} {record.student?.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {record.student?.enrollmentNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {record.subject?.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {record.subject?.code}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {record.faculty?.firstName} {record.faculty?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[record.status]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {record.session || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {record.remarks || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="card-footer flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={filters.page === 1}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={filters.page >= pagination.pages}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;
