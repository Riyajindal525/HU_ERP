import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services';
import {
    Users,
    BookOpen,
    Calendar,
    UserCheck,
    ClipboardList,
    RefreshCw,
    Building2,
    BookMarked
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch Dashboard Stats with auto-refresh every 30 seconds
    const { data: statsData, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: () => dashboardService.getStats(),
        refetchInterval: 30000, // Auto-refresh every 30 seconds
        refetchOnWindowFocus: true, // Refresh when user returns to tab
        staleTime: 0, // Always consider data stale to get fresh counts
    });

    const stats = [
        {
            name: 'Total Students',
            value: isLoading ? '...' : statsData?.data?.totalStudents || 0,
            change: '', // Real change % requires historical data we don't have yet
            icon: Users,
            color: 'primary',
        },
        {
            name: 'Faculty Members',
            value: isLoading ? '...' : statsData?.data?.totalFaculty || 0,
            change: '',
            icon: UserCheck,
            color: 'success',
        },
        {
            name: 'Active Courses',
            value: isLoading ? '...' : statsData?.data?.activeCourses || 0,
            change: '',
            icon: BookOpen,
            color: 'secondary',
        },
        {
            name: 'Attendance Rate',
            value: isLoading ? '...' : (statsData?.data?.attendanceRate || '0%'),
            change: '',
            icon: Calendar,
            color: 'warning',
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            System Overview & Management {isFetching && '• Updating...'}
                        </p>
                    </div>
                    <button 
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Refresh dashboard data"
                    >
                        <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-medium">Refresh</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="card animate-fade-in">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.name}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                    <p className={`mt-2 text-sm text-${stat.color}-600 font-medium`}>
                                        {stat.change}
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

                {/* Management Actions - Only keep this, remove dummy charts/activities for now */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Quick Management
                        </h2>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Manage Students', icon: Users, color: 'primary', path: '/admin/students' },
                                { label: 'Manage Faculty', icon: UserCheck, color: 'success', path: '/admin/faculty' },
                                { label: 'Departments', icon: Building2, color: 'purple', path: '/admin/departments' },
                                { label: 'Courses', icon: BookOpen, color: 'secondary', path: '/admin/courses' },
                                { label: 'Subjects', icon: BookMarked, color: 'indigo', path: '/admin/subjects' },
                                { label: 'View Reports', icon: ClipboardList, color: 'warning', path: '/admin/reports' },
                            ].map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                                >
                                    <div className={`p-4 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 group-hover:scale-110 transition-transform`}>
                                        <action.icon className={`h-8 w-8 text-${action.color}-600 dark:text-${action.color}-400`} />
                                    </div>
                                    <span className="mt-3 text-sm font-medium text-gray-900 dark:text-white text-center">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default AdminDashboard;
