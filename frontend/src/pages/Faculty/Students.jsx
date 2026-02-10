import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
    Users, 
    ArrowLeft, 
    Filter, 
    Search,
    CheckCircle,
    XCircle,
    Calendar,
    BookOpen
} from 'lucide-react';

const Students = () => {
    const navigate = useNavigate();
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(true);

    // Fetch faculty profile to get assigned subjects
    const { data: facultyData } = useQuery({
        queryKey: ['facultyProfile'],
        queryFn: async () => {
            const response = await api.get('/faculty/me');
            return response.data || response;
        }
    });

    // Fetch students based on filters
    const { data: studentsData, isLoading: loadingStudents } = useQuery({
        queryKey: ['facultyStudents', selectedSemester, selectedSection, searchQuery],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (selectedSemester) params.append('semester', selectedSemester);
            if (selectedSection) params.append('section', selectedSection);
            if (searchQuery) params.append('search', searchQuery);
            params.append('limit', '100');
            
            const response = await api.get(`/students?${params}`);
            return response.data?.students || response.students || [];
        },
        enabled: !!(selectedSemester && selectedSection)
    });

    // Fetch attendance records for filtered students
    const { data: attendanceData, isLoading: loadingAttendance, error: attendanceError } = useQuery({
        queryKey: ['studentAttendance', selectedSubject, selectedSemester, selectedSection],
        queryFn: async () => {
            if (!selectedSubject) {
                console.log('No subject selected, skipping attendance fetch');
                return [];
            }
            
            console.log('=== Fetching Attendance ===');
            console.log('Subject ID:', selectedSubject);
            console.log('Semester:', selectedSemester);
            console.log('Section:', selectedSection);
            
            try {
                const params = new URLSearchParams();
                params.append('subject', selectedSubject);
                params.append('limit', '1000');
                
                const url = `/attendance?${params}`;
                console.log('Request URL:', url);
                
                const response = await api.get(url);
                const records = response.data?.attendance || response.attendance || [];
                
                console.log('Total records fetched:', records.length);
                console.log('Sample records:', records.slice(0, 2).map(r => ({
                    student: r.student?._id || r.student,
                    subject: r.subject?._id || r.subject,
                    status: r.status,
                    date: r.date
                })));
                
                // Filter by subject to be absolutely sure
                const filtered = records.filter(r => {
                    const subjectId = r.subject?._id || r.subject;
                    return subjectId.toString() === selectedSubject.toString();
                });
                
                console.log('Filtered records for this subject:', filtered.length);
                
                return filtered;
            } catch (error) {
                console.error('Error fetching attendance:', error);
                throw error;
            }
        },
        enabled: !!selectedSubject,
        staleTime: 0,
        cacheTime: 0
    });

    // Calculate attendance statistics for each student
    const getStudentAttendance = (studentId) => {
        if (!attendanceData || !selectedSubject) {
            return { present: 0, absent: 0, total: 0, percentage: 0 };
        }
        
        // Filter records for this specific student AND subject
        const studentRecords = attendanceData.filter(record => {
            const recordStudentId = record.student?._id || record.student;
            const recordSubjectId = record.subject?._id || record.subject;
            
            return recordStudentId.toString() === studentId.toString() &&
                   recordSubjectId.toString() === selectedSubject.toString();
        });
        
        const present = studentRecords.filter(r => r.status === 'PRESENT').length;
        const absent = studentRecords.filter(r => r.status === 'ABSENT').length;
        const total = studentRecords.length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
        
        return { present, absent, total, percentage };
    };

    // Get unique sections and semesters from allocated subjects
    const sections = [...new Set(facultyData?.allocatedSubjects?.map(a => a.section).filter(Boolean))];
    const semesters = [...new Set(facultyData?.allocatedSubjects?.map(a => a.semester).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/faculty/dashboard')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                                    My Students
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    View students and their attendance records
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn btn-secondary flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                {showFilters && (
                    <div className="card mb-6">
                        <div className="card-body">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Filter Students
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Semester
                                    </label>
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="">Select Semester</option>
                                        {semesters.map(sem => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Section
                                    </label>
                                    <select
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="">Select Section</option>
                                        {sections.map(sec => (
                                            <option key={sec} value={sec}>Section {sec.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subject (for attendance)
                                    </label>
                                    <select
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="">All Subjects</option>
                                        {facultyData?.allocatedSubjects
                                            ?.filter(a => 
                                                (!selectedSemester || a.semester == selectedSemester) &&
                                                (!selectedSection || a.section === selectedSection)
                                            )
                                            .map(allocation => (
                                                <option key={allocation.subject._id} value={allocation.subject._id}>
                                                    {allocation.subject.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="input w-full pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Students List */}
                {!selectedSemester || !selectedSection ? (
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Select Filters
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Please select semester and section to view students
                            </p>
                        </div>
                    </div>
                ) : attendanceError ? (
                    <div className="card mb-6">
                        <div className="card-body">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-red-800 dark:text-red-300">
                                    Error loading attendance: {attendanceError.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : loadingStudents ? (
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading students...</p>
                        </div>
                    </div>
                ) : studentsData?.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Students Found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                No students found for the selected filters
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Students List ({studentsData.length})
                            </h3>
                        </div>
                        <div className="card-body p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Roll No
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Student Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Section
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            {selectedSubject && (
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Attendance
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {studentsData.map((student) => {
                                            const attendance = getStudentAttendance(student._id);
                                            const attendanceColor = 
                                                attendance.percentage >= 75 ? 'text-green-600' :
                                                attendance.percentage >= 60 ? 'text-yellow-600' :
                                                'text-red-600';
                                            
                                            return (
                                                <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {student.enrollmentNumber || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                                                {student.firstName[0]}{student.lastName[0]}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {student.firstName} {student.lastName}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {student.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {student.section || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {student.phone || 'N/A'}
                                                    </td>
                                                    {selectedSubject && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            {loadingAttendance ? (
                                                                <div className="text-sm text-gray-500">Loading...</div>
                                                            ) : attendance.total === 0 ? (
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="text-sm text-gray-500">No Records</span>
                                                                    <p className="text-xs text-gray-400">
                                                                        Mark attendance first
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className={`text-2xl font-bold ${attendanceColor}`}>
                                                                        {attendance.percentage}%
                                                                    </span>
                                                                    <div className="flex items-center gap-3 text-xs">
                                                                        <span className="flex items-center gap-1 text-green-600">
                                                                            <CheckCircle className="h-3 w-3" />
                                                                            {attendance.present}
                                                                        </span>
                                                                        <span className="flex items-center gap-1 text-red-600">
                                                                            <XCircle className="h-3 w-3" />
                                                                            {attendance.absent}
                                                                        </span>
                                                                        <span className="text-gray-500">
                                                                            / {attendance.total}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Students;
