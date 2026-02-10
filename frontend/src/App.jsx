import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import store from './store/store';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyEmail from './pages/Auth/VerifyEmail';
import Landing from './pages/Landing';
import StudentDashboard from './pages/Student/Dashboard';
import ViewCourses from './pages/Courses/ViweCourses';
import AttendanceDashboard from './pages/Student/AttendanceDashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import StudentManagement from './pages/Admin/StudentManagement';
import CourseManagement from './pages/Admin/CourseManagement';
import DepartmentManagement from './pages/Admin/DepartmentManagement';
import SubjectManagement from './pages/Admin/SubjectManagement';
import FacultyManagement from './pages/Admin/FacultyManagement';
import Settings from './pages/Admin/Settings';
import AttendanceManagement from './pages/Admin/AttendanceManagement';
import FeesManagement from './pages/Admin/FeesManagement';
import AdminLayout from './components/AdminLayout';
import FacultyDashboard from './pages/Faculty/Dashboard';
import MarkAttendance from './pages/Faculty/MarkAttendance';
import FacultySchedule from './pages/Faculty/Schedule';
import FacultyStudents from './pages/Faculty/Students';
import FacultyExams from './pages/Faculty/Exams';
import FacultyReports from './pages/Faculty/Reports';
import FacultyResults from './pages/Faculty/Results';
import LibraryDashboard from './pages/Library/LibraryDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Assignment from './pages/Assignment/Assignment';
import DetailsAssignment from "./pages/DetalisAssignment/DetailsAssignment";
import DetailsQuiz from './pages/DetailsQuiz/DetailsQuiz';
import CourseDetails from "./pages/CourseDetails/CourseDetails";

// Create query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />

                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />

                        {/* Student Routes */}
                        <Route
                            path="/student/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />
{/* View Courses */}
                        <Route
                            path="/student/courses"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <ViewCourses />
                                </ProtectedRoute>
                            }
                        />
                        {/* Assignment */}
                        <Route
                            path="/assignment/:id"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <Assignment />
                                </ProtectedRoute>
                            }
                        />
                        {/* Details Assignment */}
                        <Route
                            path="/assignment/details/:id"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <DetailsAssignment />
                                </ProtectedRoute>
                            }
                        />
                        {/* Details Quiz */}
                        <Route
                            path="/quiz/details/:id"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <DetailsQuiz />
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Course Details */}
                        <Route
                            path="/course/details/:id"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <CourseDetails />
                                </ProtectedRoute>
                            }
                        />
                           <Route path="/student/attendance"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <AttendanceDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Faculty Routes */}
                        <Route
                            path="/faculty/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['FACULTY']}>
                                    <FacultyDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculty/attendance"
                            element={
                                <ProtectedRoute allowedRoles={['FACULTY']}>
                                    <MarkAttendance />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculty/schedule"
                            element={
                                <ProtectedRoute allowedRoles={['FACULTY']}>
                                    <FacultySchedule />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculty/students"
                            element={
                                <ProtectedRoute allowedRoles={['FACULTY']}>
                                    <FacultyStudents />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculty/exams"
                            element={
                                <ProtectedRoute allowedRoles={['FACULTY']}>
                                    <FacultyExams />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculty/reports"
                            element={
                                <ProtectedRoute allowedRoles={['FACULTY']}>
                                    <FacultyReports />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/faculty/results"
                            element={
                                <ProtectedRoute allowedRoles={['FACULTY']}>
                                    <FacultyResults />
                                </ProtectedRoute>
                            }
                        />

                        {/* Library Routes */}
                        <Route
                            path="/library/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN', 'SUPER_ADMIN']}>
                                    <LibraryDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fees Routes */}
                        <Route
                            path="/fees/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['FEE_CLERK', 'ADMIN', 'SUPER_ADMIN']}>
                                    <FeesManagement />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                                    <AdminLayout>
                                        <Routes>
                                            <Route path="/dashboard" element={<AdminDashboard />} />
                                            <Route path="/students" element={<StudentManagement />} />
                                            <Route path="/faculty" element={<FacultyManagement />} />
                                            <Route path="/departments" element={<DepartmentManagement />} />
                                            <Route path="/courses" element={<CourseManagement />} />
                                            <Route path="/subjects" element={<SubjectManagement />} />
                                            <Route path="/attendance" element={<AttendanceManagement />} />
                                            <Route path="/fees" element={<FeesManagement />} />
                                            <Route path="/settings" element={<Settings />} />
                                        </Routes>
                                    </AdminLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 Not Found */}
                        <Route
                            path="*"
                            element={
                                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                                    <div className="text-center">
                                        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
                                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                                            Page not found
                                        </p>
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
