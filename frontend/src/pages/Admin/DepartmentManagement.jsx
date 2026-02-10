import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { departmentService, courseService } from '../../services';
import {
    Building2,
    Plus,
    Edit2,
    Trash2,
    BookOpen,
    Users,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

const DepartmentManagement = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);

    // Debug: Log when selected department changes
    useEffect(() => {
        console.log('🏢 Selected Department Changed:', selectedDept);
    }, [selectedDept]);

    // Fetch Departments
    const { data: deptData, isLoading, error } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getAll(),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    console.log('🔍 Department Query Debug:', {
        deptData,
        isLoading,
        error,
        departments: deptData?.data
    });

    // Fetch Courses for selected department
    const { data: coursesData } = useQuery({
        queryKey: ['courses', selectedDept?._id],
        queryFn: () => courseService.getAll({ department: selectedDept?._id }),
        enabled: !!selectedDept,
    });

    // Fetch Department Statistics
    const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
        queryKey: ['department-stats', selectedDept?._id],
        queryFn: async () => {
            console.log('🔄 Fetching statistics for department:', selectedDept?._id);
            try {
                const result = await departmentService.getStatistics(selectedDept?._id);
                console.log('✅ Statistics fetched successfully:', result);
                return result;
            } catch (error) {
                console.error('❌ Error fetching statistics:', error);
                console.error('Error response:', error.response?.data);
                throw error;
            }
        },
        enabled: !!selectedDept,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    console.log('📊 Statistics Data:', {
        selectedDept: selectedDept?._id,
        statsData,
        statsLoading,
        statsError,
        totalStudents: statsData?.data?.totalStudents,
        totalCourses: statsData?.data?.totalCourses,
        rawData: statsData
    });

    // Create Department
    const createMutation = useMutation({
        mutationFn: (data) => departmentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            toast.success('Department created successfully');
            setShowModal(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to create department')
    });

    // Update Department
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => departmentService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            toast.success('Department updated successfully');
            setShowModal(false);
            setEditingDept(null);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to update department')
    });

    // Delete Department
    const deleteMutation = useMutation({
        mutationFn: (id) => departmentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            toast.success('Department deleted successfully');
        },
        onError: (error) => toast.error('Failed to delete department')
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            code: formData.get('code'),
            description: formData.get('description'),
            hodName: formData.get('hodName'),
        };

        if (editingDept) {
            updateMutation.mutate({ id: editingDept._id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const departments = deptData?.data || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Department Management</h1>
                    <p className="text-sm text-gray-500">Manage departments and their courses</p>
                </div>
                <button
                    onClick={() => {
                        setEditingDept(null);
                        setShowModal(true);
                    }}
                    className="btn btn-primary"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Department
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Departments List */}
                <div className="lg:col-span-1">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold">Departments</h2>
                        </div>
                        <div className="card-body p-0">
                            {isLoading ? (
                                <div className="p-4 text-center">Loading...</div>
                            ) : error ? (
                                <div className="p-4 text-center text-red-500">
                                    Error: {error.message}
                                    <br />
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        className="mt-2 text-sm underline"
                                    >
                                        Reload Page
                                    </button>
                                </div>
                            ) : departments.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No departments yet</div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {departments.map((dept) => (
                                        <div
                                            key={dept._id}
                                            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                                selectedDept?._id === dept._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                                            }`}
                                            onClick={() => setSelectedDept(dept)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-5 w-5 text-primary-600" />
                                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                                            {dept.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">{dept.code}</p>
                                                    {dept.hodName && (
                                                        <p className="text-xs text-gray-400 mt-1">HOD: {dept.hodName}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingDept(dept);
                                                            setShowModal(true);
                                                        }}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Delete this department?')) {
                                                                deleteMutation.mutate(dept._id);
                                                            }
                                                        }}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Department Details & Statistics */}
                <div className="lg:col-span-2">
                    {selectedDept ? (
                        <div className="space-y-6">
                            {/* Department Info */}
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="text-lg font-semibold">{selectedDept.name}</h2>
                                </div>
                                <div className="card-body">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Department Code</p>
                                            <p className="font-medium">{selectedDept.code}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">HOD</p>
                                            <p className="font-medium">{selectedDept.hodName || 'Not assigned'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Students</p>
                                            <p className="font-medium text-primary-600">{statsData?.data?.totalStudents || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Courses</p>
                                            <p className="font-medium text-primary-600">{statsData?.data?.totalCourses || 0}</p>
                                        </div>
                                        {selectedDept.description && (
                                            <div className="col-span-2 md:col-span-4">
                                                <p className="text-sm text-gray-500">Description</p>
                                                <p className="text-sm">{selectedDept.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Student Statistics by Semester & Section */}
                            {statsLoading ? (
                                <div className="card">
                                    <div className="card-body text-center py-8">
                                        <p className="text-gray-500">Loading statistics...</p>
                                        <p className="text-xs text-gray-400 mt-2">Department ID: {selectedDept._id}</p>
                                    </div>
                                </div>
                            ) : statsError ? (
                                <div className="card">
                                    <div className="card-body text-center py-8">
                                        <p className="text-red-500">Error loading statistics</p>
                                        <p className="text-xs text-gray-500 mt-2">{statsError.message}</p>
                                        <button 
                                            onClick={() => queryClient.invalidateQueries(['department-stats', selectedDept._id])}
                                            className="mt-4 btn btn-sm btn-primary"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            ) : statsData?.data?.totalStudents > 0 ? (
                                <div className="card">
                                    <div className="card-header">
                                        <h2 className="text-lg font-semibold">Students by Semester & Section</h2>
                                    </div>
                                    <div className="card-body">
                                        <div className="space-y-6">
                                            {statsData?.data?.semesterSectionMatrix?.map((group) => (
                                                <div key={`${group.semester}-${group.section}`} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                                            Semester {group.semester} - Section {group.section}
                                                        </h3>
                                                        <span className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm font-medium">
                                                            {group.students.length} Students
                                                        </span>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Enrollment No</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                                {group.students.map((student) => (
                                                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                                            {student.enrollmentNumber || 'N/A'}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                                            {student.firstName} {student.lastName}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                                            {student.course?.code || 'N/A'}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                                            {student.batch || 'N/A'}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                                            {student.email || student.phone || 'N/A'}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="card">
                                    <div className="card-body text-center py-8">
                                        <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                        <p className="text-gray-500">No students enrolled in this department</p>
                                    </div>
                                </div>
                            )}

                            {/* Courses in Department */}
                            <div className="card">
                                <div className="card-header flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Courses</h2>
                                    <button
                                        onClick={() => navigate('/admin/courses', { 
                                            state: { 
                                                departmentId: selectedDept._id,
                                                departmentName: selectedDept.name,
                                                departmentCode: selectedDept.code
                                            } 
                                        })}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Course
                                    </button>
                                </div>
                                <div className="card-body">
                                    {coursesData?.data?.courses?.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>No courses in this department</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {coursesData?.data?.courses?.map((course) => (
                                                <div
                                                    key={course._id}
                                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                                {course.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">{course.code}</p>
                                                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                                <span>Duration: {course.duration?.years || 0} years</span>
                                                                <span>Semesters: {course.duration?.semesters || 0}</span>
                                                                <span>Degree: {course.degree}</span>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            course.isActive 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {course.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-body text-center py-12">
                                <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">Select a department to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {editingDept ? 'Edit Department' : 'Add Department'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Department Name *
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            className="input w-full"
                                            placeholder="Computer Science"
                                            defaultValue={editingDept?.name}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Department Code *
                                        </label>
                                        <input
                                            name="code"
                                            type="text"
                                            className="input w-full"
                                            placeholder="CSE"
                                            defaultValue={editingDept?.code}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            HOD Name
                                        </label>
                                        <input
                                            name="hodName"
                                            type="text"
                                            className="input w-full"
                                            placeholder="Dr. John Doe"
                                            defaultValue={editingDept?.hodName}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            className="input w-full"
                                            rows="3"
                                            placeholder="Department description..."
                                            defaultValue={editingDept?.description}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {editingDept ? 'Update' : 'Create'}
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

export default DepartmentManagement;
