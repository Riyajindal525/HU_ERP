import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Calendar,
    Users,
    CheckCircle,
    XCircle,
    Save,
    BookOpen
} from 'lucide-react';

const MarkAttendance = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSubject, setSelectedSubject] = useState(location.state?.subject || null);
    const [selectedSection, setSelectedSection] = useState(location.state?.section || '');
    const [selectedSemester, setSelectedSemester] = useState(location.state?.semester || '');
    const [attendanceData, setAttendanceData] = useState({});
    const [session, setSession] = useState('MORNING');
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [savedAttendance, setSavedAttendance] = useState(null);

    // Fetch faculty profile to get assigned subjects
    const { data: facultyData } = useQuery({
        queryKey: ['facultyProfile'],
        queryFn: async () => {
            const response = await api.get('/faculty/me');
            return response.data || response;
        }
    });

    // Fetch students for the selected subject and section
    const { data: studentsData, isLoading: loadingStudents } = useQuery({
        queryKey: ['students', selectedSubject?._id, selectedSection, selectedSemester],
        queryFn: async () => {
            if (!selectedSubject) return [];
            
            console.log('Fetching students for:', {
                subject: selectedSubject.name,
                semester: selectedSemester,
                section: selectedSection
            });
            
            const params = new URLSearchParams();
            if (selectedSemester) params.append('semester', selectedSemester);
            if (selectedSection) params.append('section', selectedSection);
            params.append('limit', '100');
            
            const response = await api.get(`/students?${params}`);
            console.log('Students API response:', response);
            
            const students = response.data?.students || response.students || [];
            console.log('Found students:', students.length, students);
            
            return students;
        },
        enabled: !!selectedSubject
    });

    // Check if attendance already marked for this date, subject, and session
    const { data: existingAttendance, isLoading: checkingAttendance } = useQuery({
        queryKey: ['checkAttendance', selectedSubject?._id, selectedDate, session],
        queryFn: async () => {
            if (!selectedSubject || !selectedDate) return null;
            
            const params = new URLSearchParams({
                subject: selectedSubject._id,
                startDate: selectedDate,
                endDate: selectedDate,
                limit: 1
            });
            
            const response = await api.get(`/attendance?${params}`);
            const records = response.data?.attendance || response.attendance || [];
            
            // Check if any record exists for this date and session
            return records.length > 0 ? records : null;
        },
        enabled: !!selectedSubject && !!selectedDate
    });

    const isAttendanceMarked = existingAttendance && existingAttendance.length > 0;

    // Mark attendance mutation
    const markAttendanceMutation = useMutation({
        mutationFn: async (data) => {
            return api.post('/attendance/bulk', data);
        },
        onSuccess: (response) => {
            toast.success('Attendance marked successfully!');
            
            // Prepare summary data
            const summary = {
                date: selectedDate,
                subject: selectedSubject,
                session,
                present: studentsData.filter(s => attendanceData[s._id] === 'PRESENT'),
                absent: studentsData.filter(s => attendanceData[s._id] === 'ABSENT'),
                total: Object.keys(attendanceData).length
            };
            
            setSavedAttendance(summary);
            setShowSummaryModal(true);
            
            queryClient.invalidateQueries(['attendance']);
            setAttendanceData({});
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to mark attendance');
        }
    });

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleMarkAll = (status) => {
        const newData = {};
        studentsData?.forEach(student => {
            newData[student._id] = status;
        });
        setAttendanceData(newData);
    };

    const handleSubmit = () => {
        if (!selectedSubject) {
            toast.error('Please select a subject');
            return;
        }

        const attendanceRecords = Object.entries(attendanceData).map(([studentId, status]) => ({
            student: studentId,
            status
        }));

        if (attendanceRecords.length === 0) {
            toast.error('Please mark attendance for at least one student');
            return;
        }

        const payload = {
            subject: selectedSubject._id,
            date: selectedDate,
            session,
            attendanceRecords
        };

        console.log('Submitting attendance:', payload);

        markAttendanceMutation.mutate(payload);
    };

    const stats = {
        total: studentsData?.length || 0,
        present: Object.values(attendanceData).filter(s => s === 'PRESENT').length,
        absent: Object.values(attendanceData).filter(s => s === 'ABSENT').length
    };

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
                            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                                Mark Attendance
                            </h1>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={markAttendanceMutation.isLoading || Object.keys(attendanceData).length === 0 || isAttendanceMarked}
                            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {markAttendanceMutation.isLoading ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="card mb-6">
                    <div className="card-body">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={selectedSubject?._id || ''}
                                    onChange={(e) => {
                                        const subject = facultyData?.allocatedSubjects?.find(
                                            a => a.subject._id === e.target.value
                                        );
                                        setSelectedSubject(subject?.subject);
                                        setSelectedSection(subject?.section || '');
                                        setSelectedSemester(subject?.semester || '');
                                    }}
                                    className="input w-full"
                                >
                                    <option value="">Select Subject</option>
                                    {facultyData?.allocatedSubjects?.map((allocation) => (
                                        <option key={allocation.subject._id} value={allocation.subject._id}>
                                            {allocation.subject.name} - Sem {allocation.semester} {allocation.section ? `(${allocation.section})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="input w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Session
                                </label>
                                <select
                                    value={session}
                                    onChange={(e) => setSession(e.target.value)}
                                    className="input w-full"
                                >
                                    <option value="MORNING">Morning</option>
                                    <option value="AFTERNOON">Afternoon</option>
                                    <option value="EVENING">Evening</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Quick Actions
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleMarkAll('PRESENT')}
                                        className="btn btn-sm btn-success flex-1"
                                        disabled={!studentsData?.length || isAttendanceMarked}
                                    >
                                        All Present
                                    </button>
                                    <button
                                        onClick={() => handleMarkAll('ABSENT')}
                                        className="btn btn-sm btn-danger flex-1"
                                        disabled={!studentsData?.length || isAttendanceMarked}
                                    >
                                        All Absent
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Total Students</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Present</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Absent</p>
                        </div>
                    </div>
                </div>

                {/* Already Marked Warning */}
                {isAttendanceMarked && (
                    <div className="card mb-6 border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="card-body">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                                        Attendance Already Marked
                                    </h3>
                                    <p className="text-yellow-700 dark:text-yellow-400 mb-3">
                                        Attendance for this subject, date, and session has already been marked. 
                                        You cannot edit previously marked attendance. Please select a different date or session.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate('/faculty/dashboard')}
                                            className="btn btn-sm bg-yellow-600 hover:bg-yellow-700 text-white"
                                        >
                                            Back to Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedDate(new Date().toISOString().split('T')[0]);
                                                setSession('MORNING');
                                            }}
                                            className="btn btn-sm btn-secondary"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Students List */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Students List
                        </h3>
                    </div>
                    <div className="card-body">
                        {!selectedSubject ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Please select a subject to view students
                                </p>
                            </div>
                        ) : loadingStudents ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading students...</p>
                            </div>
                        ) : studentsData?.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No students found for this subject and section
                                </p>
                            </div>
                        ) : (
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
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Attendance Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {studentsData.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {student.enrollmentNumber || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {student.firstName} {student.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {student.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {student.section || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {isAttendanceMarked ? (
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                            Already marked
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                const currentStatus = attendanceData[student._id];
                                                                const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';
                                                                handleAttendanceChange(student._id, newStatus);
                                                            }}
                                                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                                                                attendanceData[student._id] === 'PRESENT'
                                                                    ? 'bg-green-600'
                                                                    : attendanceData[student._id] === 'ABSENT'
                                                                    ? 'bg-red-600'
                                                                    : 'bg-gray-300 dark:bg-gray-600'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                                                    attendanceData[student._id] === 'PRESENT' ? 'translate-x-9' : 'translate-x-1'
                                                                }`}
                                                            />
                                                            <span className={`absolute text-xs font-medium text-white ${
                                                                attendanceData[student._id] === 'PRESENT' ? 'left-2' : 'right-2'
                                                            }`}>
                                                                {attendanceData[student._id] === 'PRESENT' ? 'P' : attendanceData[student._id] === 'ABSENT' ? 'A' : '-'}
                                                            </span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Modal */}
                {showSummaryModal && savedAttendance && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Attendance Summary
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowSummaryModal(false);
                                            navigate('/faculty/dashboard');
                                        }}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <XCircle className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Summary Info */}
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Subject</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {savedAttendance.subject?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {new Date(savedAttendance.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Session</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {savedAttendance.session}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Marked</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {savedAttendance.total} students
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                            <div>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {savedAttendance.present.length}
                                                </p>
                                                <p className="text-sm text-green-700 dark:text-green-400">Present</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <XCircle className="h-8 w-8 text-red-600" />
                                            <div>
                                                <p className="text-2xl font-bold text-red-600">
                                                    {savedAttendance.absent.length}
                                                </p>
                                                <p className="text-sm text-red-700 dark:text-red-400">Absent</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Present Students */}
                                {savedAttendance.present.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Present Students ({savedAttendance.present.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {savedAttendance.present.map((student) => (
                                                <div
                                                    key={student._id}
                                                    className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {student.firstName} {student.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {student.enrollmentNumber}
                                                        </p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                                                        Present
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Absent Students */}
                                {savedAttendance.absent.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                                            <XCircle className="h-5 w-5" />
                                            Absent Students ({savedAttendance.absent.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {savedAttendance.absent.map((student) => (
                                                <div
                                                    key={student._id}
                                                    className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {student.firstName} {student.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {student.enrollmentNumber}
                                                        </p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                                                        Absent
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowSummaryModal(false);
                                            navigate('/faculty/dashboard');
                                        }}
                                        className="flex-1 btn btn-primary"
                                    >
                                        Back to Dashboard
                                    </button>
                                    <button
                                        onClick={() => setShowSummaryModal(false)}
                                        className="flex-1 btn btn-secondary"
                                    >
                                        Mark More Attendance
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarkAttendance;
