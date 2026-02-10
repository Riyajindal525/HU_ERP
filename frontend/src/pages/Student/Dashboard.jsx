import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudentDashboard } from '../../services/dashboard.service';
import {
    BookOpen,
    Calendar,
    DollarSign,
    Award,
    TrendingUp,
    Users,
    FileText,
    Bell
} from 'lucide-react';

const StudentDashboard = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const {
  data,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['student-dashboard'],
  queryFn: getStudentDashboard,
});


    if (isLoading) {
  return <div className="p-8">Loading dashboard...</div>;
}

if (isError) {
  return <div className="p-8 text-red-500">Failed to load dashboard</div>;
}

const stats = [
  {
    name: 'Attendance',
    value: `${data.attendance}%`,
    change: '',
    icon: Calendar,
    color: 'primary',
  },
  {
    name: 'CGPA',
    value: data.cgpa,
    change: '',
    icon: Award,
    color: 'success',
  },
  {
    name: 'Pending Fees',
    value: `₹${data.pendingFees}`,
    change: '',
    icon: DollarSign,
    color: 'warning',
  },
  {
    name: 'Courses',
    value: data.activeCourses,
    change: 'Active',
    icon: BookOpen,
    color: 'secondary',
  },
];


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
  Welcome back,{' '}
  {profile?.firstName ||
    user?.email
      ?.split("@")[0]      
      .split(".")[0]      
      .replace(/^(.{4})(.*)$/, (_, first, last) =>
        first.charAt(0).toUpperCase() +
        first.slice(1) +
        " " +
        last.charAt(0).toUpperCase() +
        last.slice(1)
      )}! 👋
</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {profile?.enrollmentNumber && `Enrollment: ${profile.enrollmentNumber}`}
                            </p>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Classes */}
                    <div className="lg:col-span-2 card">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Today's Schedule
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="space-y-4">
                                {[
                                    { time: '09:00 AM', subject: 'Data Structures', room: 'Lab 101', type: 'Practical' },
                                    { time: '11:00 AM', subject: 'Database Management', room: 'Room 203', type: 'Theory' },
                                    { time: '02:00 PM', subject: 'Web Development', room: 'Lab 102', type: 'Practical' },
                                ].map((class_, index) => (
                                    <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                                                <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {class_.subject}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {class_.room} • {class_.type}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                            {class_.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Quick Actions
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="space-y-3">
                                {[
                                    { icon: Calendar, label: 'View Attendance', color: 'primary', path: '/student/attendance' },
                                    { icon: FileText, label: 'Check Results', color: 'success' },
                                    { icon: DollarSign, label: 'Pay Fees', color: 'warning' },
                                    { icon: Users, label: 'My Courses', color: 'secondary', path: '/student/courses' },
                                ].map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => action.path && navigate(action.path)}
                                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                                            {action.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Grades */}
                <div className="mt-6 card">
                    <div className="card-header flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Exam Results
                        </h2>
                        <button 
                            onClick={() => navigate('/student/results')}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="card-body">
                        {data.recentResults && data.recentResults.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead className="table-header">
                                        <tr>
                                            <th className="table-cell font-semibold text-left">Subject</th>
                                            <th className="table-cell font-semibold text-left">Exam Type</th>
                                            <th className="table-cell font-semibold text-left">Marks</th>
                                            <th className="table-cell font-semibold text-left">Grade</th>
                                            <th className="table-cell font-semibold text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {data.recentResults.map((result, index) => (
                                            <tr key={index} className="table-row">
                                                <td className="table-cell font-medium">{result.subject?.name || 'N/A'}</td>
                                                <td className="table-cell text-gray-500">{result.exam?.type?.replace('_', ' ') || 'N/A'}</td>
                                                <td className="table-cell">{result.marksObtained}/{result.totalMarks}</td>
                                                <td className="table-cell">
                                                    <span className="badge badge-primary">{result.grade}</span>
                                                </td>
                                                <td className="table-cell">
                                                    <span className={`badge ${result.status === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                                                        {result.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No exam results available yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
