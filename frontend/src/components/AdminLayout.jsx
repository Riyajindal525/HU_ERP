import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Building2,
    BookOpen,
    BookMarked,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Calendar,
    Library,
    DollarSign
} from 'lucide-react';
import NotificationManagement from '../pages/Admin/NotificationManagement';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Students',
            path: '/admin/students',
            icon: Users,
        },
        {
            name: 'Faculty',
            path: '/admin/faculty',
            icon: GraduationCap,
        },
        {
            name: 'Departments',
            path: '/admin/departments',
            icon: Building2,
        },
        {
            name: 'Courses',
            path: '/admin/courses',
            icon: BookOpen,
        },
        {
            name: 'Subjects',
            path: '/admin/subjects',
            icon: BookMarked,
        },
        {
            name: 'Attendance',
            path: '/admin/attendance',
            icon: Calendar,
        },
        {
            name: 'Fees',
            path: '/admin/fees',
            icon: DollarSign,
        },
        {
            name: 'Library',
            path: '/library/dashboard',
            icon: Library,
        },
        {
            name: 'Settings',
            path: '/admin/settings',
            icon: Settings,
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Overlay for mobile when sidebar is open */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 shadow-lg`}
            >
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Logo/Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                                    ERP Admin
                                </h1>
                                <p className="text-xs text-gray-500">Management Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                                active
                                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 lg:ml-64 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Top Bar */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {sidebarOpen ? (
                                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            ) : (
                                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>

                        <div className="flex items-center gap-4">
                            {/* Notification Bell Icon */}
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Bell clicked - opening modal');
                                    setShowNotificationModal(true);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                                title="Manage Notifications"
                            >
                                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 min-h-screen">
                    {children}
                </main>
            </div>

            {/* Notification Management Modal */}
            {showNotificationModal && (
                <div className="fixed inset-0 z-[60] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowNotificationModal(false);
                            }}
                        ></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full shadow-xl z-50 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <Bell className="h-6 w-6 mr-2" />
                                    Notification Management
                                </h2>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowNotificationModal(false);
                                    }}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                            <div className="p-6">
                                <NotificationManagement />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
