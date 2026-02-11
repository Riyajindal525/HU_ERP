import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, AlertCircle, TrendingUp, Settings, UserPlus, Trash2, X, Award, 
  Clock, CheckCircle, GraduationCap, Home, Bus, FileText, AlertTriangle,
  Wallet, ArrowLeft, Calendar, Download, Filter, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

// Fee Categories
const FEE_CATEGORIES = [
  {
    id: 'academic',
    name: 'Academic Fees',
    icon: GraduationCap,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    darkBgColor: 'from-blue-900/30 to-blue-800/30',
    iconColor: 'text-blue-600',
    description: 'Tuition and examination fees'
  },
  {
    id: 'hostel',
    name: 'Hostel Fees',
    icon: Home,
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    darkBgColor: 'from-green-900/30 to-green-800/30',
    iconColor: 'text-green-600',
    description: 'Accommodation and mess charges'
  },
  {
    id: 'transport',
    name: 'Transport Fees',
    icon: Bus,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    darkBgColor: 'from-purple-900/30 to-purple-800/30',
    iconColor: 'text-purple-600',
    description: 'Bus and transportation services'
  },
  {
    id: 'backpaper',
    name: 'Back Paper Fees',
    icon: FileText,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100',
    darkBgColor: 'from-orange-900/30 to-orange-800/30',
    iconColor: 'text-orange-600',
    description: 'Re-examination and revaluation'
  },
  {
    id: 'fine',
    name: 'Fines & Penalties',
    icon: AlertTriangle,
    color: 'from-red-500 to-red-600',
    bgColor: 'from-red-50 to-red-100',
    darkBgColor: 'from-red-900/30 to-red-800/30',
    iconColor: 'text-red-600',
    description: 'Late fees and penalties'
  },
  {
    id: 'other',
    name: 'Other Fees',
    icon: Wallet,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100',
    darkBgColor: 'from-indigo-900/30 to-indigo-800/30',
    iconColor: 'text-indigo-600',
    description: 'Library, sports, and miscellaneous'
  }
];

// Static Data for Each Category
const STATIC_FEE_DATA = {
  academic: {
    totalStudents: 1247,
    totalCollected: 15250000,
    pending: 285,
    pendingAmount: 6840000,
    payments: [
      { _id: '1', rollNumber: 'CSE2024001', studentName: 'Aarav Sharma', department: 'Computer Science', semester: 'III', amount: 45000, dueDate: '2024-03-15', status: 'overdue', type: 'Semester Fee' },
      { _id: '2', rollNumber: 'ECE2024015', studentName: 'Diya Patel', department: 'Electronics', semester: 'V', amount: 45000, dueDate: '2024-03-20', status: 'pending', type: 'Semester Fee' },
      { _id: '3', rollNumber: 'ME2024032', studentName: 'Arjun Kumar', department: 'Mechanical', semester: 'I', amount: 48000, dueDate: '2024-03-18', status: 'pending', type: 'Admission Fee' },
      { _id: '4', rollNumber: 'CSE2024089', studentName: 'Priya Singh', department: 'Computer Science', semester: 'VII', amount: 45000, dueDate: '2024-03-10', status: 'overdue', type: 'Semester Fee' },
      { _id: '5', rollNumber: 'CE2024045', studentName: 'Rohan Verma', department: 'Civil Engineering', semester: 'III', amount: 45000, dueDate: '2024-03-22', status: 'pending', type: 'Exam Fee' },
    ]
  },
  hostel: {
    totalStudents: 856,
    totalCollected: 5140000,
    pending: 142,
    pendingAmount: 1704000,
    payments: [
      { _id: '1', rollNumber: 'CSE2024001', studentName: 'Aarav Sharma', hostelName: 'Krishna Hostel', roomNo: 'A-201', amount: 12000, dueDate: '2024-03-15', status: 'overdue', type: 'Room Rent' },
      { _id: '2', rollNumber: 'ECE2024015', studentName: 'Diya Patel', hostelName: 'Radha Hostel', roomNo: 'B-105', amount: 12000, dueDate: '2024-03-20', status: 'pending', type: 'Room Rent' },
      { _id: '3', rollNumber: 'ME2024032', studentName: 'Arjun Kumar', hostelName: 'Shiva Hostel', roomNo: 'C-304', amount: 15000, dueDate: '2024-03-18', status: 'pending', type: 'Mess Fee' },
      { _id: '4', rollNumber: 'IT2024056', studentName: 'Ananya Reddy', hostelName: 'Lakshmi Hostel', roomNo: 'D-102', amount: 12000, dueDate: '2024-03-12', status: 'overdue', type: 'Room Rent' },
    ]
  },
  transport: {
    totalStudents: 423,
    totalCollected: 1015200,
    pending: 67,
    pendingAmount: 201000,
    payments: [
      { _id: '1', rollNumber: 'CSE2024001', studentName: 'Aarav Sharma', route: 'Route 1 - Saharanpur', distance: '25 km', amount: 3000, dueDate: '2024-03-15', status: 'overdue', type: 'Monthly Pass' },
      { _id: '2', rollNumber: 'ECE2024015', studentName: 'Diya Patel', route: 'Route 3 - Muzaffarnagar', distance: '35 km', amount: 3500, dueDate: '2024-03-20', status: 'pending', type: 'Monthly Pass' },
      { _id: '3', rollNumber: 'ME2024032', studentName: 'Arjun Kumar', route: 'Route 2 - Hardwar', distance: '30 km', amount: 3200, dueDate: '2024-03-18', status: 'pending', type: 'Quarterly Pass' },
      { _id: '4', rollNumber: 'CE2024045', studentName: 'Rohan Verma', route: 'Route 1 - Saharanpur', distance: '25 km', amount: 3000, dueDate: '2024-03-12', status: 'overdue', type: 'Monthly Pass' },
    ]
  },
  backpaper: {
    totalStudents: 156,
    totalCollected: 468000,
    pending: 45,
    pendingAmount: 135000,
    payments: [
      { _id: '1', rollNumber: 'CSE2023045', studentName: 'Vikram Malhotra', department: 'Computer Science', subjects: 'Data Structures, DBMS', amount: 3000, dueDate: '2024-03-15', status: 'overdue', type: 'Re-exam Fee' },
      { _id: '2', rollNumber: 'ECE2023067', studentName: 'Neha Kapoor', department: 'Electronics', subjects: 'Digital Electronics', amount: 1500, dueDate: '2024-03-20', status: 'pending', type: 'Re-exam Fee' },
      { _id: '3', rollNumber: 'ME2023034', studentName: 'Rahul Yadav', department: 'Mechanical', subjects: 'Thermodynamics', amount: 1500, dueDate: '2024-03-18', status: 'pending', type: 'Revaluation' },
      { _id: '4', rollNumber: 'IT2023089', studentName: 'Simran Gill', department: 'Information Tech', subjects: 'Java, Web Tech', amount: 3000, dueDate: '2024-03-10', status: 'overdue', type: 'Re-exam Fee' },
    ]
  },
  fine: {
    totalStudents: 234,
    totalCollected: 234000,
    pending: 89,
    pendingAmount: 89000,
    payments: [
      { _id: '1', rollNumber: 'CSE2024001', studentName: 'Aarav Sharma', reason: 'Late Fee Payment', amount: 1000, dueDate: '2024-03-15', status: 'overdue', type: 'Late Fee Fine' },
      { _id: '2', rollNumber: 'ECE2024015', studentName: 'Diya Patel', reason: 'Library Book Fine', amount: 500, dueDate: '2024-03-20', status: 'pending', type: 'Library Fine' },
      { _id: '3', rollNumber: 'ME2024032', studentName: 'Arjun Kumar', reason: 'Hostel Damage', amount: 2000, dueDate: '2024-03-18', status: 'pending', type: 'Damage Fine' },
      { _id: '4', rollNumber: 'CE2024045', studentName: 'Rohan Verma', reason: 'Late Submission', amount: 500, dueDate: '2024-03-12', status: 'overdue', type: 'Academic Fine' },
    ]
  },
  other: {
    totalStudents: 1247,
    totalCollected: 2494000,
    pending: 178,
    pendingAmount: 356000,
    payments: [
      { _id: '1', rollNumber: 'CSE2024001', studentName: 'Aarav Sharma', category: 'Library', amount: 2000, dueDate: '2024-03-15', status: 'overdue', type: 'Annual Fee' },
      { _id: '2', rollNumber: 'ECE2024015', studentName: 'Diya Patel', category: 'Sports', amount: 1500, dueDate: '2024-03-20', status: 'pending', type: 'Annual Fee' },
      { _id: '3', rollNumber: 'ME2024032', studentName: 'Arjun Kumar', category: 'Cultural', amount: 1000, dueDate: '2024-03-18', status: 'pending', type: 'Event Fee' },
      { _id: '4', rollNumber: 'IT2024056', studentName: 'Ananya Reddy', category: 'Lab Equipment', amount: 3000, dueDate: '2024-03-12', status: 'overdue', type: 'Deposit' },
    ]
  }
};

const FeesDashboard = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFeeClerkModal, setShowFeeClerkModal] = useState(false);
  const [showAddFeeClerkModal, setShowAddFeeClerkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // Get fee clerks (only for admins)
  const { data: feeClerksData } = useQuery({
    queryKey: ['fee-clerks'],
    queryFn: () => api.get('/auth/users?role=FEE_CLERK'),
    enabled: isAdmin && showFeeClerkModal,
  });

  // Create fee clerk mutation
  const createFeeClerkMutation = useMutation({
    mutationFn: (data) => api.post('/auth/register', { ...data, role: 'FEE_CLERK' }),
    onSuccess: () => {
      toast.success('Fee clerk created successfully');
      setShowAddFeeClerkModal(false);
      queryClient.invalidateQueries(['fee-clerks']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create fee clerk');
    },
  });

  // Delete fee clerk mutation
  const deleteFeeClerkMutation = useMutation({
    mutationFn: (id) => api.delete(`/auth/users/${id}`),
    onSuccess: () => {
      toast.success('Fee clerk removed successfully');
      queryClient.invalidateQueries(['fee-clerks']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove fee clerk');
    },
  });

  const handleCreateFeeClerk = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createFeeClerkMutation.mutate({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
    });
  };

  const handleDeleteFeeClerk = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      deleteFeeClerkMutation.mutate(id);
    }
  };

  const feeClerks = feeClerksData?.data?.users || [];

  // Calculate overall statistics
  const overallStats = {
    totalRevenue: Object.values(STATIC_FEE_DATA).reduce((sum, cat) => sum + cat.totalCollected, 0),
    totalPending: Object.values(STATIC_FEE_DATA).reduce((sum, cat) => sum + cat.pendingAmount, 0),
    totalStudents: 1247,
    collectionRate: 72.5
  };

  // Get current category data
  const currentCategoryData = selectedCategory ? STATIC_FEE_DATA[selectedCategory] : null;
  const filteredPayments = currentCategoryData?.payments.filter(payment => 
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Main Dashboard View
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Fees Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Comprehensive fee management system
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowFeeClerkModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Settings className="h-5 w-5" />
                Manage Fee Clerks
              </button>
            )}
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">₹{(overallStats.totalRevenue / 10000000).toFixed(2)}Cr</p>
              </div>
              <div className="h-12 w-12 text-white font-bold text-3xl flex items-center justify-center bg-white/20 rounded-xl">₹</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Collection Rate</p>
                <p className="text-3xl font-bold">{overallStats.collectionRate}%</p>
              </div>
              <CheckCircle className="h-12 w-12" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm mb-1">Pending Amount</p>
                <p className="text-3xl font-bold">₹{(overallStats.totalPending / 10000000).toFixed(2)}Cr</p>
              </div>
              <AlertCircle className="h-12 w-12" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold">{overallStats.totalStudents}</p>
              </div>
              <Users className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Fee Categories Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fee Categories</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEE_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            const categoryData = STATIC_FEE_DATA[category.id];
            
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-indigo-500 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.bgColor} dark:bg-gradient-to-br dark:${category.darkBgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-8 w-8 ${category.iconColor} dark:${category.iconColor}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {category.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Collected:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ₹{(categoryData.totalCollected / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Pending:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      ₹{(categoryData.pendingAmount / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Students:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {categoryData.totalStudents}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      View Details
                    </span>
                    <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                      <span className="text-white text-lg">→</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manage Fee Clerks Modal */}
        {showFeeClerkModal && isAdmin && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl transform animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-6 w-6 text-indigo-600" />
                  Manage Fee Clerks
                </h3>
                <button 
                  onClick={() => setShowFeeClerkModal(false)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <button
                  onClick={() => setShowAddFeeClerkModal(true)}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <UserPlus className="h-5 w-5" />
                  Add New Fee Clerk
                </button>
              </div>

              {feeClerks.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No fee clerks found</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {feeClerks.map((clerk) => (
                        <tr key={clerk._id} className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {clerk.firstName} {clerk.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {clerk.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs rounded-full font-semibold flex items-center gap-1 w-fit ${
                              clerk.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              <span className={`h-2 w-2 rounded-full ${clerk.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {clerk.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleDeleteFeeClerk(clerk._id, `${clerk.firstName} ${clerk.lastName}`)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
                              disabled={deleteFeeClerkMutation.isLoading}
                              title="Remove Fee Clerk"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Fee Clerk Modal */}
        {showAddFeeClerkModal && isAdmin && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Fee Clerk</h3>
                <button 
                  onClick={() => setShowAddFeeClerkModal(false)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleCreateFeeClerk} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input 
                    name="firstName" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all" 
                    placeholder="John" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input 
                    name="lastName" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all" 
                    placeholder="Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all" 
                    placeholder="feeclerk@huroorkee.ac.in" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <input 
                    name="password" 
                    type="password" 
                    required 
                    minLength={8} 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all" 
                    placeholder="Minimum 8 characters" 
                  />
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>The fee clerk will have access to fees management features only.</span>
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    type="button" 
                    onClick={() => setShowAddFeeClerkModal(false)} 
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                    disabled={createFeeClerkMutation.isLoading}
                  >
                    {createFeeClerkMutation.isLoading ? 'Creating...' : 'Create Fee Clerk'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Category Detail View
  const category = FEE_CATEGORIES.find(cat => cat.id === selectedCategory);
  const Icon = category.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className="mb-4 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 shadow-lg transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${category.bgColor} dark:bg-gradient-to-br dark:${category.darkBgColor} rounded-2xl flex items-center justify-center`}>
            <Icon className={`h-8 w-8 ${category.iconColor}`} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentCategoryData.totalStudents}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Collected</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{(currentCategoryData.totalCollected / 100000).toFixed(1)}L</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-red-500">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Count</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{currentCategoryData.pending}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Amount</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">₹{(currentCategoryData.pendingAmount / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-indigo-900/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Pending Payments
            </h2>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                      <p className="text-gray-500 font-medium">No pending payments found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {payment.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {payment.department || payment.hostelName || payment.route || payment.subjects || payment.reason || payment.category}
                      {payment.roomNo && ` - ${payment.roomNo}`}
                      {payment.distance && ` (${payment.distance})`}
                      {payment.semester && ` - Sem ${payment.semester}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                        {payment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      ₹{payment.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'overdue'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {payment.status === 'overdue' ? '⚠️ Overdue' : '⏰ Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FeesDashboard;
