import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { courseService, departmentService } from '../../services';
import {
    BookOpen,
    Search,
    Plus,
    Trash2,
    Edit2,
    MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseManagement = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [preSelectedDepartment, setPreSelectedDepartment] = useState(null);

    // Check if we came from department page with pre-selected department
    useEffect(() => {
        if (location.state?.departmentId) {
            setPreSelectedDepartment({
                id: location.state.departmentId,
                name: location.state.departmentName,
                code: location.state.departmentCode
            });
            // Auto-open the modal to add course
            setShowModal(true);
        }
    }, [location.state]);

    // Fetch Courses
    const { data: coursesData, isLoading } = useQuery({
        queryKey: ['courses', search],
        queryFn: () => courseService.getAll({ search, limit: 100 })
    });

    // Mutation: Create/Update Course
    const saveCourseMutation = useMutation({
        mutationFn: (data) => {
            if (editingCourse) {
                return courseService.update(editingCourse._id, data);
            }
            return courseService.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['courses']);
            toast.success(`Course ${editingCourse ? 'updated' : 'created'} successfully`);
            setShowModal(false);
            setEditingCourse(null);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Operation failed')
    });

    // Mutation: Delete Course
    const deleteCourseMutation = useMutation({
        mutationFn: (id) => courseService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['courses']);
            toast.success('Course deleted successfully');
        },
        onError: (error) => toast.error('Failed to delete course')
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            code: formData.get('code'),
            degree: formData.get('degree'),
            duration: {
                years: Number(formData.get('years')),
                semesters: Number(formData.get('semesters'))
            },
            totalSeats: Number(formData.get('totalSeats')),
            department: formData.get('department')
        };
        saveCourseMutation.mutate(data);
    };

    // Fetch Departments (for dropdown)
    const { data: deptData } = useQuery({
        queryKey: ['departments'],
        queryFn: () => departmentService.getAll()
    });

    return (
        <div>
            {/* Department Context Banner */}
            {preSelectedDepartment && (
                <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary-600" />
                            <div>
                                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                                    Adding course to: <span className="font-bold">{preSelectedDepartment.name}</span> ({preSelectedDepartment.code})
                                </p>
                                <p className="text-xs text-primary-700 dark:text-primary-300">
                                    The department is pre-selected in the form below
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPreSelectedDepartment(null)}
                            className="text-primary-600 hover:text-primary-800 text-sm underline"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Management</h1>
                    <p className="text-sm text-gray-500">Add, edit, and manage academic courses</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCourse(null);
                        setShowModal(true);
                    }}
                    className="btn btn-primary"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Course
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="input pl-10 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p>Loading...</p>
                ) : coursesData?.data?.courses?.map((course) => (
                    <div key={course._id} className="card hover:shadow-lg transition-all">
                        <div className="card-body">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingCourse(course);
                                            setShowModal(true);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete this course?')) {
                                                deleteCourseMutation.mutate(course._id);
                                            }
                                        }}
                                        className="p-1 hover:bg-red-50 rounded text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{course.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{course.code}</p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Degree</span>
                                    <span className="font-medium">{course.degree}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Duration</span>
                                    <span className="font-medium">{course.duration?.years} Years</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Seats</span>
                                    <span className="font-medium">{course.totalSeats}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                {editingCourse ? 'Edit Course' : 'Add New Course'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Course Name</label>
                                    <input name="name" defaultValue={editingCourse?.name} className="input w-full" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Course Code</label>
                                    <input name="code" defaultValue={editingCourse?.code} className="input w-full" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Degree</label>
                                    <select name="degree" defaultValue={editingCourse?.degree || 'B_TECH'} className="input w-full">
                                        <option value="B_TECH">B.Tech</option>
                                        <option value="M_TECH">M.Tech</option>
                                        <option value="BCA">BCA</option>
                                        <option value="MCA">MCA</option>
                                        <option value="MBA">MBA</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Years</label>
                                        <input name="years" type="number" defaultValue={editingCourse?.duration?.years || 4} className="input w-full" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Semesters</label>
                                        <input name="semesters" type="number" defaultValue={editingCourse?.duration?.semesters || 8} className="input w-full" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Seats</label>
                                    <input name="totalSeats" type="number" defaultValue={editingCourse?.totalSeats || 60} className="input w-full" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Department</label>
                                    <select 
                                        name="department" 
                                        defaultValue={editingCourse?.department?._id || preSelectedDepartment?.id || ''} 
                                        className="input w-full" 
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {deptData?.data?.map(dept => (
                                            <option key={dept._id} value={dept._id}>
                                                {dept.name} ({dept.code})
                                            </option>
                                        ))}
                                    </select>
                                    {preSelectedDepartment && (
                                        <p className="text-xs text-primary-600 mt-1">
                                            Pre-selected: {preSelectedDepartment.name}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingCourse ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
