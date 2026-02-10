import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService, courseService, departmentService, paymentService, feeService } from '../../services';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    BookOpen,
    CreditCard,
    Trash2,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentManagement = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // Fetch Students with auto-refresh
    const { data: studentsData, isLoading, refetch } = useQuery({
        queryKey: ['students', search],
        queryFn: () => studentService.getAll({ search }),
        refetchOnWindowFocus: true,
        staleTime: 0, // Always fetch fresh data
    });

    // Fetch Courses (for dropdown)
    const { data: coursesData, isLoading: coursesLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: () => courseService.getAll({ limit: 100 }),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    // Fetch Departments (for dropdown)
    const { data: departmentsData } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getAll(),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    console.log('📚 Courses Data:', coursesData);
    console.log('🏢 Departments Data:', departmentsData);

    // Mutation: Create Student
    const createStudentMutation = useMutation({
        mutationFn: (data) => studentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            toast.success('Student account created successfully');
            setShowAddStudentModal(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to create student')
    });

    // Mutation: Update Student (Assign Course)
    const updateStudentMutation = useMutation({
        mutationFn: ({ id, data }) => studentService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            toast.success('Student updated successfully');
            setShowCourseModal(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Update failed')
    });

    // Mutation: Create Fee Request
    const createFeeMutation = useMutation({
        mutationFn: (data) => paymentService.create(data),
        onSuccess: () => {
            toast.success('Fee request created successfully');
            setShowFeeModal(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to create fee request')
    });

    // Mutation: Delete Student
    const deleteStudentMutation = useMutation({
        mutationFn: (id) => studentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            toast.success('Student deleted successfully');
        },
        onError: (error) => toast.error('Failed to delete student')
    });

    // Fetch Fees (for dropdown)
    const { data: feesData } = useQuery({
        queryKey: ['fees'],
        queryFn: () => feeService.getAll()
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
                    <p className="text-sm text-gray-500">Manage students, assign courses, and pending fees</p>
                </div>
                <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="btn btn-primary"
                >
                    <Users className="h-5 w-5 mr-2" />
                    Add Student
                </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or enrollment number..."
                        className="input pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="btn btn-secondary">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                </button>
            </div>

            {/* Students Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
                            ) : studentsData?.data?.students?.map((student) => (
                                <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                {student.firstName[0]}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {student.firstName} {student.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{student.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.course ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {student.course?.name || 'Not Enrolled'}
                                        </span>
                                        {student.course && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {student.batch ? `Batch: ${student.batch}` : ''}
                                                {student.batch && student.section ? ' • ' : ''}
                                                {student.section ? `Sec: ${student.section}` : ''}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                title="Assign Course"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowCourseModal(true);
                                                }}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <BookOpen className="h-5 w-5" />
                                            </button>
                                            <button
                                                title="Create Fee Request"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowFeeModal(true);
                                                }}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            >
                                                <CreditCard className="h-5 w-5" />
                                            </button>
                                            <button
                                                title="Delete Student"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this student?')) {
                                                        deleteStudentMutation.mutate(student._id);
                                                    }
                                                }}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Assign Course */}
            {showCourseModal && selectedStudent && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowCourseModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                Assign Course to {selectedStudent.firstName} {selectedStudent.lastName}
                            </h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const departmentId = formData.get('departmentId');
                                const courseId = formData.get('courseId');
                                
                                updateStudentMutation.mutate({
                                    id: selectedStudent._id,
                                    data: {
                                        enrollmentNumber: formData.get('enrollmentNumber'),
                                        department: departmentId,
                                        course: courseId,
                                        batch: formData.get('batch'),
                                        section: formData.get('section'),
                                        currentSemester: Number(formData.get('semester')) || 1
                                    }
                                });
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            University Roll Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="enrollmentNumber"
                                            type="text"
                                            className="input mt-1 w-full"
                                            placeholder="2024CS001"
                                            defaultValue={selectedStudent.enrollmentNumber || ''}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            This is the official university roll number for the student
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Department</label>
                                        <select 
                                            name="departmentId" 
                                            className="input mt-1 w-full" 
                                            required 
                                            defaultValue={selectedStudent.department?._id || ''}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                        >
                                            <option value="">Select a department...</option>
                                            {departmentsData?.data?.map(dept => (
                                                <option key={dept._id} value={dept._id}>
                                                    {dept.name} ({dept.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Course</label>
                                        <select name="courseId" className="input mt-1 w-full" required defaultValue={selectedStudent.course?._id || ''}>
                                            <option value="">Select a course...</option>
                                            {coursesLoading ? (
                                                <option disabled>Loading courses...</option>
                                            ) : coursesData?.data?.courses?.length > 0 ? (
                                                coursesData.data.courses
                                                    .filter(course => !selectedDepartment || course.department?._id === selectedDepartment)
                                                    .map(course => (
                                                        <option key={course._id} value={course._id}>
                                                            {course.name} ({course.code}) - {course.degree}
                                                        </option>
                                                    ))
                                            ) : (
                                                <option disabled>No courses available</option>
                                            )}
                                        </select>
                                        {coursesData?.data?.courses?.length === 0 && (
                                            <p className="text-xs text-red-500 mt-1">
                                                No courses found. Please create courses first in Course Management.
                                            </p>
                                        )}
                                        {selectedDepartment && coursesData?.data?.courses?.filter(c => c.department?._id === selectedDepartment).length === 0 && (
                                            <p className="text-xs text-yellow-600 mt-1">
                                                No courses in this department. Please add courses to this department first.
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch</label>
                                            <input
                                                name="batch"
                                                type="text"
                                                className="input mt-1 w-full"
                                                placeholder="e.g., 2023-2027"
                                                defaultValue={selectedStudent.batch || ''}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
                                            <input
                                                name="section"
                                                type="text"
                                                className="input mt-1 w-full"
                                                placeholder="e.g., A"
                                                defaultValue={selectedStudent.section || ''}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                                        <input
                                            name="semester"
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="input mt-1 w-full"
                                            placeholder="1"
                                            defaultValue={selectedStudent.currentSemester || 1}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setShowCourseModal(false)} className="btn btn-secondary">Cancel</button>
                                        <button type="submit" className="btn btn-primary">Assign Course</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Fee Request */}
            {showFeeModal && selectedStudent && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowFeeModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                Create Pending Fee Request
                            </h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                createFeeMutation.mutate({
                                    studentId: selectedStudent._id,
                                    feeId: formData.get('feeId'),
                                    amount: Number(formData.get('amount')),
                                    semester: Number(formData.get('semester')),
                                    academicYear: '2025-26', // Keep hardcoded or make input if needed
                                    remarks: 'Pending Fee Request'
                                });
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Fee Structure</label>
                                        <select name="feeId" className="input mt-1 w-full" required>
                                            <option value="">Select Fee Structure...</option>
                                            {feesData?.data?.data?.map(fee => (
                                                <option key={fee._id} value={fee._id}>
                                                    Sem {fee.semester} ({fee.academicYear}) - ₹{(fee.totalAmount || 0).toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                                        <input name="amount" type="number" className="input mt-1 w-full" required placeholder="50000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                                        <input name="semester" type="number" min="1" max="8" className="input mt-1 w-full" required defaultValue="1" />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setShowFeeModal(false)} className="btn btn-secondary">Cancel</button>
                                        <button type="submit" className="btn btn-primary">Create Request</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Add Student */}
            {showAddStudentModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 py-8">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddStudentModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Add New Student - Complete Registration
                            </h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                createStudentMutation.mutate({
                                    firstName: formData.get('firstName'),
                                    lastName: formData.get('lastName'),
                                    email: formData.get('email'),
                                    role: 'STUDENT',
                                    enrollmentNumber: formData.get('enrollmentNumber'),
                                    dateOfBirth: formData.get('dateOfBirth'),
                                    gender: formData.get('gender'),
                                    phone: formData.get('phone'),
                                    guardianName: formData.get('guardianName'),
                                    guardianPhone: formData.get('guardianPhone'),
                                    guardianRelation: formData.get('guardianRelation'),
                                    bloodGroup: formData.get('bloodGroup'),
                                    category: formData.get('category'),
                                    address: {
                                        street: formData.get('street'),
                                        city: formData.get('city'),
                                        state: formData.get('state'),
                                        pincode: formData.get('pincode'),
                                        country: formData.get('country') || 'India'
                                    }
                                });
                            }}>
                                <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                                            Personal Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    First Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="firstName"
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="John"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Last Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="lastName"
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="Doe"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    University Roll Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="enrollmentNumber"
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="2024CS001"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    className="input w-full"
                                                    placeholder="student@university.ac.in"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Date of Birth <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="dateOfBirth"
                                                    type="date"
                                                    className="input w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Gender <span className="text-red-500">*</span>
                                                </label>
                                                <select name="gender" className="input w-full" required>
                                                    <option value="">Select Gender</option>
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Phone Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    pattern="[0-9]{10}"
                                                    className="input w-full"
                                                    placeholder="9876543210"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Blood Group
                                                </label>
                                                <select name="bloodGroup" className="input w-full">
                                                    <option value="">Select Blood Group</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Category
                                                </label>
                                                <select name="category" className="input w-full">
                                                    <option value="">Select Category</option>
                                                    <option value="GENERAL">General</option>
                                                    <option value="OBC">OBC</option>
                                                    <option value="SC">SC</option>
                                                    <option value="ST">ST</option>
                                                    <option value="EWS">EWS</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guardian Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                                            Guardian/Parent Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Father's/Guardian's Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="guardianName"
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="Mr. John Doe Sr."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Guardian's Phone <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="guardianPhone"
                                                    type="tel"
                                                    pattern="[0-9]{10}"
                                                    className="input w-full"
                                                    placeholder="9876543210"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Relation <span className="text-red-500">*</span>
                                                </label>
                                                <select name="guardianRelation" className="input w-full" required>
                                                    <option value="">Select Relation</option>
                                                    <option value="FATHER">Father</option>
                                                    <option value="MOTHER">Mother</option>
                                                    <option value="GUARDIAN">Guardian</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                                            Address Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Street Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="street"
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="House No., Street Name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="city"
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="Mumbai"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    State <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="state"
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="Maharashtra"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Pincode <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    name="pincode"
                                                    type="text"
                                                    pattern="[0-9]{6}"
                                                    className="input w-full"
                                                    placeholder="400001"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Country
                                                </label>
                                                <input
                                                    name="country"
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="India"
                                                    defaultValue="India"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                            <span>
                                                A temporary password will be generated and sent to the student's email. 
                                                The student should use OTP login for security. After creating the student, 
                                                you can assign them to a course and department.
                                            </span>
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowAddStudentModal(false)} 
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={createStudentMutation.isLoading}
                                        >
                                            {createStudentMutation.isLoading ? 'Creating...' : 'Create Student'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
