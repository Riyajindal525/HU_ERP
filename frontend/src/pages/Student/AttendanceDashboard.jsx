import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Download,
    Filter,
    RefreshCw,
    BarChart3,
    Eye,
    Target,
    Award,
    Calculator
} from 'lucide-react';

const AttendanceDashboard = () => {
    const navigate = useNavigate();
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [viewMode, setViewMode] = useState('overview');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [refreshing, setRefreshing] = useState(false);
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [calculatorClasses, setCalculatorClasses] = useState('');
    const [calculatorTarget, setCalculatorTarget] = useState(75);
    const [selectedCalculatorSubject, setSelectedCalculatorSubject] = useState('');
    const [selectedDayAttendance, setSelectedDayAttendance] = useState(null);

    const handleRefresh = async () => {
        setRefreshing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    const handleExportData = () => {
        // Sample student details (in real app, this would come from user context/API)
        const studentDetails = {
            name: "John Doe",
            rollNumber: "2024CS101",
            department: "Computer Science",
            semester: "5th Semester",
            academicYear: "2024-2025"
        };

        // Generate PDF content
        const printContent = `
            <html>
                <head>
                    <title>Attendance Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                        .title { font-size: 24px; font-weight: bold; color: #333; }
                        .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
                        .student-info { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px; border-left: 4px solid #007bff; }
                        .student-info h3 { margin: 0 0 15px 0; color: #333; font-size: 18px; }
                        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
                        .info-item { }
                        .info-label { font-size: 12px; color: #666; margin-bottom: 3px; }
                        .info-value { font-size: 14px; font-weight: bold; color: #333; }
                        .section { margin-bottom: 30px; }
                        .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
                        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
                        .stat-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
                        .stat-label { font-size: 12px; color: #666; margin-bottom: 5px; }
                        .stat-value { font-size: 20px; font-weight: bold; color: #333; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        .table th { background-color: #f5f5f5; font-weight: bold; }
                        .eligible { background-color: #d4edda; color: #155724; padding: 4px 8px; border-radius: 3px; font-weight: bold; }
                        .not-eligible { background-color: #f8d7da; color: #721c24; padding: 4px 8px; border-radius: 3px; font-weight: bold; }
                        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; text-align: center; }
                        @media print { body { margin: 10px; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="title">Attendance Report</div>
                        <div class="subtitle">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
                    </div>

                    <div class="student-info">
                        <h3>Student Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Student Name</div>
                                <div class="info-value">${studentDetails.name}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Roll Number</div>
                                <div class="info-value">${studentDetails.rollNumber}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Department</div>
                                <div class="info-value">${studentDetails.department}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Semester</div>
                                <div class="info-value">${studentDetails.semester}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Academic Year</div>
                                <div class="info-value">${studentDetails.academicYear}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Report Period</div>
                                <div class="info-value">${monthNames[selectedMonth]} ${selectedYear}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Overall Attendance Summary</div>
                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-label">Overall Attendance Percentage</div>
                                <div class="stat-value">${courseStats.percentage}%</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Eligibility Status (75% Required)</div>
                                <div class="stat-value">${courseStats.percentage >= 75 ? '<span class="eligible">ELIGIBLE</span>' : '<span class="not-eligible">NOT ELIGIBLE</span>'}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Total Classes Attended</div>
                                <div class="stat-value">${courseStats.present}</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label">Total Classes Missed</div>
                                <div class="stat-value">${courseStats.absent} (Absent) + ${courseStats.late} (Late)</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Subject-wise Attendance Details</div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Total Classes</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Late</th>
                                    <th>Attendance %</th>
                                    <th>Eligibility (75%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${courseWiseStats.map(course => `
                                    <tr>
                                        <td><strong>${course.course}</strong></td>
                                        <td>${course.total}</td>
                                        <td style="color: #28a745; font-weight: bold;">${course.present}</td>
                                        <td style="color: #dc3545; font-weight: bold;">${course.absent}</td>
                                        <td style="color: #ffc107; font-weight: bold;">${course.late}</td>
                                        <td><strong>${course.percentage}%</strong></td>
                                        <td>${course.percentage >= 75 ? '<span class="eligible">ELIGIBLE</span>' : '<span class="not-eligible">NOT ELIGIBLE</span>'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <div class="section-title">Eligibility Summary</div>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                            <p><strong>Eligibility Criteria:</strong> Minimum 75% attendance required for all subjects</p>
                            <p><strong>Overall Status:</strong> ${courseStats.percentage >= 75 ? 
                                '<span style="color: #28a745;">✓ MEETS ELIGIBILITY CRITERIA</span>' : 
                                '<span style="color: #dc3545;">✗ DOES NOT MEET ELIGIBILITY CRITERIA</span>'}</p>
                            <p><strong>Subjects Eligible:</strong> ${courseWiseStats.filter(c => c.percentage >= 75).length} out of ${courseWiseStats.length}</p>
                            <p><strong>Subjects Needing Improvement:</strong> ${courseWiseStats.filter(c => c.percentage < 75).map(c => c.course).join(', ') || 'None'}</p>
                        </div>
                    </div>

                    <div class="footer">
                        <p><strong>Important Note:</strong> This attendance report is official and should be kept for academic records.</p>
                        <p>For any discrepancies, please contact the administration office within 7 days of report generation.</p>
                        <p>Report generated by HuErp Attendance System on ${new Date().toLocaleDateString()}</p>
                    </div>
                </body>
            </html>
        `;

        // Create a new window and print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load, then print
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    };

    const handleSubjectSelection = (subjectName) => {
        setSelectedCalculatorSubject(subjectName);
        const selectedCourse = courseWiseStats.find(course => course.course === subjectName);
        if (selectedCourse) {
            setCalculatorClasses(selectedCourse.total.toString());
        } else {
            setCalculatorClasses('');
        }
    };

    const handleDayClick = (day) => {
        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Find attendance for this specific day
        const dayData = attendanceData.find(item => item.date === dateStr);
        if (dayData && dayData.courses) {
            setSelectedDayAttendance({
                date: dateStr,
                day: dayData.day,
                courses: dayData.courses
            });
        } else {
            setSelectedDayAttendance({
                date: dateStr,
                day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(dateStr).getDay()],
                courses: []
            });
        }
    };

    const getFilteredAttendanceData = () => {
        let filtered = [...attendanceData];
        
        // Apply subject filter if selected
        if (selectedCourse !== 'all') {
            filtered = filtered.map(day => ({
                ...day,
                courses: day.courses.filter(course => course.name === selectedCourse)
            })).filter(day => day.courses.length > 0);
        }
        
        // Apply date filter if selected
        if (selectedDate) {
            filtered = filtered.filter(day => day.date === selectedDate);
        }
        
        return filtered;
    };

    // Sample attendance data
    const attendanceData = [
        {
            date: '2024-01-01',
            day: 'Monday',
            courses: [
                { name: 'Data Structures', time: '09:00 AM', status: 'present', room: 'Lab 101' },
                { name: 'Database Management', time: '11:00 AM', status: 'present', room: 'Room 203' }
            ]
        },
        {
            date: '2024-01-02',
            day: 'Tuesday',
            courses: [
                { name: 'Web Development', time: '09:00 AM', status: 'late', room: 'Lab 102' },
                { name: 'Computer Networks', time: '11:00 AM', status: 'present', room: 'Room 205' }
            ]
        },
        {
            date: '2024-01-03',
            day: 'Wednesday',
            courses: [
                { name: 'Data Structures', time: '09:00 AM', status: 'present', room: 'Lab 101' },
                { name: 'Operating Systems', time: '02:00 PM', status: 'absent', room: 'Room 301' }
            ]
        },
        {
            date: '2024-01-04',
            day: 'Thursday',
            courses: [
                { name: 'Database Management', time: '11:00 AM', status: 'present', room: 'Room 203' },
                { name: 'Web Development', time: '02:00 PM', status: 'present', room: 'Lab 102' }
            ]
        },
        {
            date: '2024-01-05',
            day: 'Friday',
            courses: [
                { name: 'Computer Networks', time: '11:00 AM', status: 'present', room: 'Room 205' },
                { name: 'Operating Systems', time: '02:00 PM', status: 'present', room: 'Room 301' }
            ]
        }
    ];

    const courses = [
        { id: 'all', name: 'All Courses' },
        { id: 'ds', name: 'Data Structures' },
        { id: 'dbms', name: 'Database Management' },
        { id: 'web', name: 'Web Development' },
        { id: 'cn', name: 'Computer Networks' },
        { id: 'os', name: 'Operating Systems' }
    ];

    // Sample course stats
    const courseStats = {
        totalClasses: 45,
        present: 39,
        absent: 4,
        late: 2,
        percentage: 86.7,
        monthlyTrend: '+2.3%',
        weeklyTrend: '-0.5%'
    };

    const courseWiseStats = [
        { course: 'Data Structures', total: 15, present: 14, absent: 1, late: 0, percentage: 93.3 },
        { course: 'Database Management', total: 12, present: 11, absent: 1, late: 0, percentage: 91.7 },
        { course: 'Web Development', total: 10, present: 8, absent: 1, late: 1, percentage: 80.0 },
        { course: 'Computer Networks', total: 8, present: 6, absent: 2, late: 0, percentage: 75.0 },
        { course: 'Operating Systems', total: 8, present: 7, absent: 0, late: 1, percentage: 87.5 }
    ];

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const renderCalendar = () => {
        const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        
        const calendar = [];
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            calendar.push(<div key={`empty-${i}`} className="h-12 sm:h-20"></div>);
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayData = attendanceData.find(item => item.date === dateStr);
            
            calendar.push(
                <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`h-12 sm:h-20 p-1 sm:p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${
                        dayData ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                    }`}
                >
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1">{day}</div>
                    {dayData && dayData.courses.length > 0 ? (
                        <div className="space-y-1">
                            {dayData.courses.slice(0, 1).map((course, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                        course.status === 'present' ? 'bg-green-500' :
                                        course.status === 'absent' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate hidden sm:inline">
                                        {course.name.split(' ')[0]}
                                    </span>
                                </div>
                            ))}
                            {dayData.courses.length > 1 && (
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                    +{dayData.courses.length - 1}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400">No classes</div>
                    )}
                </div>
            );
        }

        return calendar;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/student/dashboard')}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                                        Interactive Attendance Dashboard
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Real-time insights and attendance analytics
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-sm"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                        <span className="hidden sm:inline">Refresh</span>
                                    </button>
                                    <button 
                                        onClick={handleExportData}
                                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span className="hidden sm:inline">Export Data</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* View Mode Tabs */}
                <div className="card mb-6">
                    <div className="card-body">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => setViewMode('overview')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                                        viewMode === 'overview' 
                                            ? 'bg-primary-600 text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <Eye className="h-4 w-4" />
                                    <span className="hidden sm:inline">Overview</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                                        viewMode === 'calendar' 
                                            ? 'bg-primary-600 text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span className="hidden sm:inline">Calendar</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('summary')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                                        viewMode === 'summary' 
                                            ? 'bg-primary-600 text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Summary</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('analytics')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                                        viewMode === 'analytics' 
                                            ? 'bg-primary-600 text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Analytics</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Attendance</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{courseStats.percentage}%</p>
                                    <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp className="h-4 w-4" />
                                        {courseStats.monthlyTrend} this month
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                                    <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Classes Attended</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{courseStats.present}</p>
                                    <p className="mt-2 text-sm text-gray-500">of {courseStats.totalClasses} total</p>
                                </div>
                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Classes Missed</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{courseStats.absent}</p>
                                    <p className="mt-2 text-sm text-gray-500">{courseStats.late} late arrivals</p>
                                </div>
                                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weekly Trend</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{courseStats.weeklyTrend}</p>
                                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                        <TrendingDown className="h-4 w-4" />
                                        vs last week
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                    <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content based on view mode */}
                {viewMode === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Recent Attendance
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {attendanceData.slice(0, 3).map((day, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{day.day}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{day.date}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center gap-1 text-sm text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    {day.courses.filter(c => c.status === 'present').length}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm text-red-600">
                                                    <XCircle className="h-4 w-4" />
                                                    {day.courses.filter(c => c.status === 'absent').length}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Course Performance
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {courseWiseStats.slice(0, 3).map((course, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900 dark:text-white">{course.course}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {course.present}/{course.total} ({course.percentage}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        course.percentage >= 75 ? 'bg-green-500' :
                                                        course.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${course.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'calendar' && (
                    <div className="card">
                        <div className="card-header">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Attendance Calendar
                                    </h2>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Month:</label>
                                            <select
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                            >
                                                {monthNames.map((month, index) => (
                                                    <option key={month} value={index}>{month}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year:</label>
                                            <select
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                            >
                                                <option value={2023}>2023</option>
                                                <option value={2024}>2024</option>
                                                <option value={2025}>2025</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <div className="min-w-max">
                                    <div className="grid grid-cols-7 gap-1 sm:gap-0 mb-2">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 py-1 sm:py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 sm:gap-0">
                                        {renderCalendar()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'summary' && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Course-wise Attendance Summary
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Subject
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Total Classes
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Present
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Absent
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Late
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Attendance %
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {courseWiseStats.map((course, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {course.course}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {course.total}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                                                    {course.present}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">
                                                    {course.absent}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                                    {course.late}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    <span className={`font-semibold ${
                                                        course.percentage >= 75 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                        {course.percentage}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        course.percentage >= 75 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                        {course.percentage >= 75 ? 'Eligible' : 'Not Eligible'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'analytics' && (
                    <div className="space-y-6 relative">
                        {/* Floating Calculator Button */}
                        <button
                            onClick={() => setShowCalculator(!showCalculator)}
                            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                            title="Smart Calculator"
                        >
                            <Calculator className="h-6 w-6" />
                        </button>

                        {/* Calculator Panel */}
                        {showCalculator && (
                            <div className="fixed bottom-20 right-6 z-40 w-96 max-w-[90vw] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Smart Calculator
                                        </h3>
                                        <button
                                            onClick={() => setShowCalculator(false)}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            <XCircle className="h-5 w-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Select Subject
                                            </label>
                                            <select
                                                value={selectedCalculatorSubject}
                                                onChange={(e) => handleSubjectSelection(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="">Choose a subject...</option>
                                                {courseWiseStats.map((course, index) => (
                                                    <option key={index} value={course.course}>
                                                        {course.course}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {selectedCalculatorSubject && (
                                            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Total Classes:</span>
                                                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                                                            {courseWiseStats.find(c => c.course === selectedCalculatorSubject)?.total || 0}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Attended:</span>
                                                        <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                                                            {courseWiseStats.find(c => c.course === selectedCalculatorSubject)?.present || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Target Percentage
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={calculatorTarget}
                                                onChange={(e) => setCalculatorTarget(parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="75"
                                            />
                                        </div>

                                        {selectedCalculatorSubject && calculatorTarget && (
                                            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                        <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                            {Math.ceil((calculatorClasses * calculatorTarget) / 100)}
                                                        </div>
                                                        <div className="text-gray-600 dark:text-gray-400">Required</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                        <div className="text-green-600 dark:text-green-400 font-bold text-lg">
                                                            {Math.max(0, calculatorClasses - Math.ceil((calculatorClasses * calculatorTarget) / 100))}
                                                        </div>
                                                        <div className="text-gray-600 dark:text-gray-400">Can Miss</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                    <div className="text-center">
                                                        <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
                                                            Status: {Math.ceil((calculatorClasses * calculatorTarget) / 100) > (courseWiseStats.find(c => c.course === selectedCalculatorSubject)?.present || 0) ? 'Need Improvement' : 'On Track'}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            Current: {courseWiseStats.find(c => c.course === selectedCalculatorSubject)?.present || 0} / {calculatorClasses} classes
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Analytics Content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Monthly Trend</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">vs last month</p>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {courseStats.monthlyTrend}
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Best Day</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Highest attendance</p>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Monday
                                    </div>
                                    <div className="text-sm text-green-600">92% avg</div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Goal Achievement</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Target: 85%</p>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        102%
                                    </div>
                                    <div className="text-sm text-gray-600">Exceeded target</div>
                                </div>
                            </div>
                        </div>

                        {/* Course Performance Chart */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Course Performance Analysis
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {courseWiseStats.map((course, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900 dark:text-white">{course.course}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {course.present}/{course.total} ({course.percentage}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                <div 
                                                    className={`h-3 rounded-full transition-all duration-300 ${
                                                        course.percentage >= 75 ? 'bg-green-500' :
                                                        course.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${course.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Weekly Pattern */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Weekly Attendance Pattern
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="flex items-center justify-center overflow-x-auto">
                                    <div className="grid grid-cols-7 gap-2 sm:gap-4 min-w-max px-2">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                                            const percentages = [85, 92, 78, 88, 95, 45, 30];
                                            const percentage = percentages[index];
                                            return (
                                                <div key={day} className="text-center group">
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
                                                        {day.substring(0, 3)}
                                                    </div>
                                                    <div className="w-12 h-16 sm:w-16 sm:h-24 rounded-lg bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-end justify-center p-1 sm:p-2 group-hover:shadow-lg transition-all duration-300">
                                                        <div 
                                                            className={`w-full rounded-t transition-all duration-300 group-hover:scale-105 ${
                                                                percentage >= 80 ? 'bg-gradient-to-t from-green-600 to-green-400' :
                                                                percentage >= 60 ? 'bg-gradient-to-t from-yellow-600 to-yellow-400' :
                                                                'bg-gradient-to-t from-red-600 to-red-400'
                                                            }`} 
                                                            style={{ height: `${percentage}%` }} 
                                                        />
                                                    </div>
                                                    <div className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mt-1 sm:mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {percentage}%
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Trend Chart */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Monthly Attendance Trend
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="h-64 sm:h-80 flex items-center justify-center overflow-x-auto">
                                    <div className="flex items-end justify-between gap-2 sm:gap-6 w-full max-w-2xl sm:max-w-4xl px-2 sm:px-4 min-w-max">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                                            const percentages = [65, 70, 75, 82, 88, 92];
                                            const percentage = percentages[index];
                                            const height = percentage;
                                            return (
                                                <div key={month} className="flex-1 flex flex-col items-center group cursor-pointer min-w-[40px] sm:min-w-[60px]">
                                                    <div className="relative w-full flex flex-col items-center">
                                                        <div className="absolute -top-6 sm:-top-8 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-1 sm:px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 whitespace-nowrap">
                                                            {percentage}%
                                                        </div>
                                                        <div 
                                                            className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-lg hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
                                                            style={{ height: `${height * 1.5}px` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 sm:mt-3">{month}</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">{percentage}%</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Distribution */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Attendance Distribution
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="text-center">
                                        <div className="relative inline-flex items-center justify-center w-40 h-40">
                                            <svg className="w-40 h-40 transform -rotate-90">
                                                {/* Present segment - 86.7% */}
                                                <circle
                                                    className="text-green-500 transition-all duration-300 cursor-pointer"
                                                    strokeWidth="20"
                                                    strokeDasharray={`${2 * Math.PI * 70 * 0.867} ${2 * Math.PI * 70}`}
                                                    strokeLinecap="round"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="70"
                                                    cx="80"
                                                    cy="80"
                                                    onMouseEnter={() => setHoveredSegment('present')}
                                                    onMouseLeave={() => setHoveredSegment(null)}
                                                    style={{
                                                        filter: hoveredSegment === 'present' ? 'brightness(1.2) drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))' : 'none',
                                                        strokeWidth: hoveredSegment === 'present' ? '22' : '20'
                                                    }}
                                                />
                                                {/* Absent segment - 8.9% */}
                                                <circle
                                                    className="text-red-500 transition-all duration-300 cursor-pointer"
                                                    strokeWidth="20"
                                                    strokeDasharray={`${2 * Math.PI * 70 * 0.089} ${2 * Math.PI * 70}`}
                                                    strokeDashoffset={`-${2 * Math.PI * 70 * 0.867}`}
                                                    strokeLinecap="round"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="70"
                                                    cx="80"
                                                    cy="80"
                                                    onMouseEnter={() => setHoveredSegment('absent')}
                                                    onMouseLeave={() => setHoveredSegment(null)}
                                                    style={{
                                                        filter: hoveredSegment === 'absent' ? 'brightness(1.2) drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' : 'none',
                                                        strokeWidth: hoveredSegment === 'absent' ? '22' : '20'
                                                    }}
                                                />
                                                {/* Late segment - 4.4% */}
                                                <circle
                                                    className="text-yellow-500 transition-all duration-300 cursor-pointer"
                                                    strokeWidth="20"
                                                    strokeDasharray={`${2 * Math.PI * 70 * 0.044} ${2 * Math.PI * 70}`}
                                                    strokeDashoffset={`-${2 * Math.PI * 70 * (0.867 + 0.089)}`}
                                                    strokeLinecap="round"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="70"
                                                    cx="80"
                                                    cy="80"
                                                    onMouseEnter={() => setHoveredSegment('late')}
                                                    onMouseLeave={() => setHoveredSegment(null)}
                                                    style={{
                                                        filter: hoveredSegment === 'late' ? 'brightness(1.2) drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' : 'none',
                                                        strokeWidth: hoveredSegment === 'late' ? '22' : '20'
                                                    }}
                                                />
                                                {/* Background circle */}
                                                <circle
                                                    className="text-gray-200 dark:text-gray-700"
                                                    strokeWidth="20"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="70"
                                                    cx="80"
                                                    cy="80"
                                                    strokeDasharray={`${2 * Math.PI * 70} ${2 * Math.PI * 70}`}
                                                    strokeDashoffset="0"
                                                    opacity="0.3"
                                                />
                                            </svg>
                                            
                                            {/* Tooltip */}
                                            {/* Removed - no longer showing percentage on hover */}
                                            
                                            <div className="absolute text-center">
                                                <div className="text-3xl font-bold text-gray-900 dark:text-white">86.7%</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Overall</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col justify-center space-y-4 max-w-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Breakdown</h3>
                                        <div className="space-y-2">
                                            <div 
                                                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                                                    hoveredSegment === 'present' 
                                                        ? 'bg-green-100 dark:bg-green-900/40 scale-105 shadow-md' 
                                                        : 'bg-green-50 dark:bg-green-900/20'
                                                }`}
                                                onMouseEnter={() => setHoveredSegment('present')}
                                                onMouseLeave={() => setHoveredSegment(null)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <span className="font-medium text-gray-900 dark:text-white text-sm">Present</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-green-600 text-sm">86.7%</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">39 classes</div>
                                                </div>
                                            </div>
                                            
                                            <div 
                                                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                                                    hoveredSegment === 'absent' 
                                                        ? 'bg-red-100 dark:bg-red-900/40 scale-105 shadow-md' 
                                                        : 'bg-red-50 dark:bg-red-900/20'
                                                }`}
                                                onMouseEnter={() => setHoveredSegment('absent')}
                                                onMouseLeave={() => setHoveredSegment(null)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                    <span className="font-medium text-gray-900 dark:text-white text-sm">Absent</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-red-600 text-sm">8.9%</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">4 classes</div>
                                                </div>
                                            </div>
                                            
                                            <div 
                                                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                                                    hoveredSegment === 'late' 
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/40 scale-105 shadow-md' 
                                                        : 'bg-yellow-50 dark:bg-yellow-900/20'
                                                }`}
                                                onMouseEnter={() => setHoveredSegment('late')}
                                                onMouseLeave={() => setHoveredSegment(null)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                    <span className="font-medium text-gray-900 dark:text-white text-sm">Late</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-yellow-600 text-sm">4.4%</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">2 classes</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Day-wise Attendance Detail Modal */}
            {selectedDayAttendance && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Attendance</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{courseStats.percentage}%</p>
                                </div>
                                <button
                                    onClick={() => setSelectedDayAttendance(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            </div>

                            {selectedDayAttendance.courses.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedDayAttendance.courses.map((course, index) => (
                                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {course.name}
                                                    </h4>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <span>{course.time}</span>
                                                        <span>{course.room}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        course.status === 'present' 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                            : course.status === 'absent'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                                    </span>
                                                    {course.status === 'present' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                                    {course.status === 'absent' && <XCircle className="h-5 w-5 text-red-500" />}
                                                    {course.status === 'late' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <Calendar className="h-12 w-12 mx-auto" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No classes scheduled for this day
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceDashboard;