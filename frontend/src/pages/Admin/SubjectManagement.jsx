import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { subjectService, departmentService, courseService } from '../../services';
import {
    BookOpen,
    Plus,
    Edit2,
    Trash2,
    Filter,
    X,
    Search,
    UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

const SubjectManagement = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [selectedDeptInForm, setSelectedDeptInForm] = useState('');
    const [filters, setFilters] = useState({
        department: '',
        course: '',
        semester: ''
    });

    // Fetch Departments
    const { data: deptData, isLoading: isDeptLoading, error: deptError } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getAll()
    });

    // Fetch Courses - load all courses initially
    const { data: coursesData, isLoading: isCoursesLoading } = useQuery({
        queryKey: ['courses', filters.department],
        queryFn: () => courseService.getAll({ 
            department: filters.department || undefined,
            limit: 100 
        })
    });

    // Fetch Subjects
    const { data: subjectsData, isLoading } = useQuery({
        queryKey: ['subjects', filters],
        queryFn: () => subjectService.getAll(filters),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    // Create Subject
    const createMutation = useMutation({
        mutationFn: (data) => subjectService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
            toast.success('Subject created successfully');
            setShowModal(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to create subject')
    });

    // Update Subject
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => subjectService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
            toast.success('Subject updated successfully');
            setShowModal(false);
            setEditingSubject(null);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to update subject')
    });

    // Delete Subject
    const deleteMutation = useMutation({
        mutationFn: (id) => subjectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
            toast.success('Subject deleted successfully');
        },
        onError: (error) => toast.error('Failed to delete subject')
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            code: formData.get('code'),
            department: formData.get('department'),
            course: formData.get('course'),
            semester: parseInt(formData.get('semester')),
            credits: parseInt(formData.get('credits')),
            type: formData.get('type'),
            description: formData.get('description'),
        };

        if (editingSubject) {
            updateMutation.mutate({ id: editingSubject._id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    // Extract data from API responses
    // API interceptor returns response.data, so:
    // Backend: { success: true, data: [...] } -> Frontend gets: { success: true, data: [...] }
    const subjects = subjectsData?.data || [];
    const departments = deptData?.data || [];
    const allCourses = coursesData?.data?.courses || [];

    // Debug logging
    console.log('=== API Response Debug ===');
    console.log('deptData:', deptData);
    console.log('Departments extracted:', departments);
    console.log('coursesData:', coursesData);
    console.log('Courses extracted:', allCourses);
    console.log('subjectsData:', subjectsData);
    console.log('Subjects extracted:', subjects);
    console.log('Filters:', filters);
    console.log('========================');

    // Filter courses based on selected department in form
    const filteredCoursesForForm = selectedDeptInForm 
        ? allCourses.filter(c => {
            const deptId = c.department?._id || c.department;
            return deptId === selectedDeptInForm;
        })
        : allCourses;

    // Reset form department selection when modal closes
    useEffect(() => {
        if (!showModal) {
            setSelectedDeptInForm('');
        } else if (editingSubject?.department?._id) {
            setSelectedDeptInForm(editingSubject.department._id);
        }
    }, [showModal, editingSubject]);

    // Debug effect
    useEffect(() => {
        if (deptError) {
            console.error('Department loading error:', deptError);
            toast.error('Failed to load departments');
        }
    }, [deptError]);

    useEffect(() => {
        if (departments.length > 0) {
            console.log('Departments loaded successfully:', departments.length);
        }
    }, [departments]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subject Management</h1>
                    <p className="text-sm text-gray-500">Manage subjects across departments and courses</p>
                </div>
                <button
                    onClick={() => {
                        setEditingSubject(null);
                        setShowModal(true);
                    }}
                    className="btn btn-primary"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Subject
                </button>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Department
                            </label>
                            <select
                                className="input w-full"
                                value={filters.department || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilters({ 
                                        department: value, 
                                        course: '', 
                                        semester: filters.semester 
                                    });
                                }}
                            >
                                <option value="">All Departments</option>
                                {departments && departments.length > 0 ? (
                                    departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>
                                            {dept.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Loading departments...</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Course
                            </label>
                            <select
                                className="input w-full"
                                value={filters.course || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilters({ ...filters, course: value });
                                }}
                            >
                                <option value="">All Courses</option>
                                {allCourses && allCourses.length > 0 ? (
                                    (filters.department 
                                        ? allCourses.filter(c => {
                                            const deptId = c.department?._id || c.department;
                                            return deptId === filters.department;
                                        })
                                        : allCourses
                                    ).map(course => (
                                        <option key={course._id} value={course._id}>
                                            {course.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>
                                        {filters.department ? 'No courses in this department' : 'Loading courses...'}
                                    </option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Semester
                            </label>
                            <select
                                className="input w-full"
                                value={filters.semester || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilters({ ...filters, semester: value });
                                }}
                            >
                                <option value="">All Semesters</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ department: '', course: '', semester: '' })}
                                className="btn btn-secondary w-full"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr><td colSpan="8" className="text-center py-8">Loading...</td></tr>
                            ) : subjects.length === 0 ? (
                                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No subjects found</td></tr>
                            ) : subjects.map((subject) => (
                                <tr key={subject._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {subject.name}
                                            </div>
                                            <div className="text-sm text-gray-500">{subject.code}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {subject.department?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {subject.course?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        Sem {subject.semester}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {subject.credits}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            subject.type === 'THEORY' 
                                                ? 'bg-blue-100 text-blue-800'
                                                : subject.type === 'PRACTICAL'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {subject.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {subject.facultyAssigned && subject.facultyAssigned.length > 0 ? (
                                                subject.facultyAssigned.map((fa, idx) => (
                                                    <span key={idx} className="text-xs text-gray-600 dark:text-gray-300">
                                                        {fa.faculty ? `${fa.faculty.firstName} ${fa.faculty.lastName}` : 'N/A'}
                                                        {fa.section && ` (${fa.section})`}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400">No faculty assigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    // Navigate to Faculty Management with subject info
                                                    navigate('/admin/faculty', { 
                                                        state: { 
                                                            assignSubject: true,
                                                            subjectId: subject._id,
                                                            subjectName: subject.name,
                                                            subjectCode: subject.code,
                                                            courseId: subject.course?._id,
                                                            semester: subject.semester
                                                        } 
                                                    });
                                                }}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                title="Assign Faculty"
                                            >
                                                <UserPlus className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingSubject(subject);
                                                    setShowModal(true);
                                                }}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Delete this subject?')) {
                                                        deleteMutation.mutate(subject._id);
                                                    }
                                                }}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {editingSubject ? 'Edit Subject' : 'Add Subject'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Subject Name *
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            className="input w-full"
                                            placeholder="Data Structures"
                                            defaultValue={editingSubject?.name}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Subject Code *
                                        </label>
                                        <input
                                            name="code"
                                            type="text"
                                            className="input w-full"
                                            placeholder="CS201"
                                            defaultValue={editingSubject?.code}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Department *
                                        </label>
                                        <select
                                            name="department"
                                            className="input w-full"
                                            value={selectedDeptInForm}
                                            onChange={(e) => setSelectedDeptInForm(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Course *
                                        </label>
                                        <select
                                            name="course"
                                            className="input w-full"
                                            defaultValue={editingSubject?.course?._id}
                                            disabled={!selectedDeptInForm}
                                            required
                                        >
                                            <option value="">Select Course</option>
                                            {filteredCoursesForForm.map(course => (
                                                <option key={course._id} value={course._id}>{course.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Semester *
                                        </label>
                                        <select
                                            name="semester"
                                            className="input w-full"
                                            defaultValue={editingSubject?.semester}
                                            required
                                        >
                                            <option value="">Select Semester</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                                <option key={sem} value={sem}>Semester {sem}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Credits *
                                        </label>
                                        <input
                                            name="credits"
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="input w-full"
                                            placeholder="4"
                                            defaultValue={editingSubject?.credits}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Type *
                                        </label>
                                        <select
                                            name="type"
                                            className="input w-full"
                                            defaultValue={editingSubject?.type}
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="THEORY">Theory</option>
                                            <option value="PRACTICAL">Practical</option>
                                            <option value="BOTH">Both</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            className="input w-full"
                                            rows="3"
                                            placeholder="Subject description..."
                                            defaultValue={editingSubject?.description}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingSubject ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectManagement;
