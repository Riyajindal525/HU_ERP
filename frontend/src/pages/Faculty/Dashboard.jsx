import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
    Users,
    Calendar,
    Clock,
    CheckSquare,
    FileText,
    MessageSquare,
    Bell,
    Search,
    BookOpen
} from 'lucide-react';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch faculty profile with assigned subjects
    const { data: facultyData, isLoading, error, refetch } = useQuery({
        queryKey: ['facultyProfile'],
        queryFn: async () => {
            const response = await api.get('/faculty/me');
            console.log('Faculty API Response:', response);
            // api service already extracts response.data, so response is the actual data
            return response.data || response;
        },
        onError: (error) => {
            console.error('Faculty API Error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to load faculty profile');
        },
        enabled: true,
        retry: 1,
        refetchOnWindowFocus: false
    });

    const stats = [
        {
            name: 'Total Classes',
            value: isLoading ? '...' : (facultyData?.stats?.totalClasses || '0'),
            period: 'This Week',
            icon: Calendar,
            color: 'primary',
        },
        {
            name: 'Assigned Subjects',
            value: isLoading ? '...' : (facultyData?.allocatedSubjects?.length || '0'),
            period: 'Active',
            icon: BookOpen,
            color: 'success',
        },
        {
            name: 'Pending Tasks',
            value: isLoading ? '...' : (facultyData?.stats?.pendingTasks || '0'),
            period: 'To Review',
            icon: CheckSquare,
            color: 'warning',
        },
        {
            name: 'Teaching Hours',
            value: isLoading ? '...' : (facultyData?.stats?.teachingHours || '0'),
            period: 'This Week',
            icon: Clock,
            color: 'secondary',
        },
    ];

    const handleSubjectClick = (subject, allocation) => {
        // Navigate to attendance marking with subject context
        navigate('/faculty/attendance', {
            state: {
                subject: subject,
                section: allocation.section,
                semester: allocation.semester,
                academicYear: allocation.academicYear
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                                Faculty Dashboard
                            </h1>
                            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                {facultyData?.department?.name || 'Loading...'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex relative">
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary-500 text-sm w-64"
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            </div>
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
                            </button>
                            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                                {facultyData?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Hello, Prof. {facultyData?.firstName || 'Faculty'} {facultyData?.lastName || ''}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {facultyData?.designation?.replace(/_/g, ' ') || 'Faculty Member'} - {facultyData?.department?.name || 'Department'}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.name} className="card hover:shadow-md transition-shadow">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {stat.name}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {stat.period}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                                        <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Quick Actions & Assigned Subjects */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Quick Actions
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Mark Attendance', icon: CheckSquare, color: 'primary', path: '/faculty/attendance' },
                                        { label: 'Create Exam', icon: FileText, color: 'success', path: '/faculty/exams' },
                                        { label: 'Submit Results', icon: MessageSquare, color: 'warning', path: '/faculty/results' },
                                        { label: 'View Students', icon: Users, color: 'secondary', path: '/faculty/students' },
                                        { label: 'My Schedule', icon: Calendar, color: 'primary', path: '/faculty/schedule' },
                                        { label: 'Reports', icon: FileText, color: 'success', path: '/faculty/reports' },
                                    ].map((action, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => navigate(action.path)}
                                            className="card p-4 flex flex-col items-center justify-center gap-3 hover:translate-y-[-2px] transition-transform"
                                        >
                                            <div className={`p-3 rounded-full bg-${action.color}-50 dark:bg-${action.color}-900/20`}>
                                                <action.icon className={`h-6 w-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                                                {action.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Assigned Subjects */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Assigned Subjects
                                </h3>
                            </div>
                            <div className="card-body">
                                {isLoading ? (
                                    <div className="text-center py-8 text-gray-500">Loading subjects...</div>
                                ) : error ? (
                                    <div className="text-center py-8">
                                        <p className="text-red-500">Error loading subjects. Please try refreshing.</p>
                                    </div>
                                ) : facultyData?.allocatedSubjects && facultyData.allocatedSubjects.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {facultyData.allocatedSubjects.map((allocation, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleSubjectClick(allocation.subject, allocation)}
                                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {allocation.subject?.name || 'No Name'}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {allocation.subject?.code || 'No Code'}
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                                Sem {allocation.semester}
                                                            </span>
                                                            {allocation.section && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                                    Section {allocation.section}
                                                                </span>
                                                            )}
                                                            {allocation.subject?.credits && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                                    {allocation.subject.credits} Credits
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <CheckSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No subjects assigned yet. Contact admin to assign subjects.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Profile & Info */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Profile
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Employee ID</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {facultyData?.employeeId || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {facultyData?.email || user?.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {facultyData?.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qualification</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {facultyData?.qualification?.replace(/_/g, '.') || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                            <div className="card-body">
                                <h3 className="font-bold text-lg mb-2">Quick Tip</h3>
                                <p className="text-primary-100 text-sm mb-4">
                                    Click on any assigned subject card to quickly mark attendance for that class.
                                </p>
                                <button 
                                    onClick={() => navigate('/faculty/help')}
                                    className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    View Guide
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
