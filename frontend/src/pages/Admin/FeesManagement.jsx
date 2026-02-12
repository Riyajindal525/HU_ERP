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
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    accentColor: 'text-blue-600',
    description: 'Tuition and examination fees'
  },
  {
    id: 'hostel',
    name: 'Hostel Fees',
    icon: Home,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    accentColor: 'text-green-600',
    description: 'Accommodation and mess charges'
  },
  {
    id: 'transport',
    name: 'Transport Fees',
    icon: Bus,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    accentColor: 'text-purple-600',
    description: 'Bus and transportation services'
  },
  {
    id: 'backpaper',
    name: 'Back Paper Fees',
    icon: FileText,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    accentColor: 'text-orange-600',
    description: 'Re-examination and revaluation'
  },
  {
    id: 'fine',
    name: 'Fines & Penalties',
    icon: AlertTriangle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    accentColor: 'text-red-600',
    description: 'Late fees and penalties'
  },
  {
    id: 'other',
    name: 'Other Fees',
    icon: Wallet,
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    accentColor: 'text-indigo-600',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Fees Dashboard
                </h1>
                <p className="text-gray-600 text-base">
                  Comprehensive fee management system
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowFeeClerkModal(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Settings className="h-5 w-5" />
                  Manage Fee Clerks
                </button>
              )}
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-400 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800">₹{(overallStats.totalRevenue / 10000000).toFixed(2)}Cr</p>
                </div>
                <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-2xl">₹</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-400 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">Collection Rate</p>
                  <p className="text-3xl font-bold text-gray-800">{overallStats.collectionRate}%</p>
                </div>
                <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-400 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">Pending Amount</p>
                  <p className="text-3xl font-bold text-gray-800">₹{(overallStats.totalPending / 10000000).toFixed(2)}Cr</p>
                </div>
                <div className="h-14 w-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-7 w-7 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-400 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-800">{overallStats.totalStudents}</p>
                </div>
                <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Fee Categories Grid */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Fee Categories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEE_CATEGORIES.map((category, index) => {
              const Icon = category.icon;
              const categoryData = STATIC_FEE_DATA[category.id];
              
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 ${category.borderColor} hover:scale-105`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 ${category.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${category.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Collected:</span>
                      <span className="font-semibold text-green-600">
                        ₹{(categoryData.totalCollected / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Pending:</span>
                      <span className="font-semibold text-red-600">
                        ₹{(categoryData.pendingAmount / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Students:</span>
                      <span className="font-semibold text-gray-800">
                        {categoryData.totalStudents}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        View Details
                      </span>
                      <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
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
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    Manage Fee Clerks
                  </h3>
                  <button 
                    onClick={() => setShowFeeClerkModal(false)} 
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <button
                    onClick={() => setShowAddFeeClerkModal(true)}
                    className="w-full md:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <UserPlus className="h-5 w-5" />
                    Add New Fee Clerk
                  </button>
                </div>

                {feeClerks.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No fee clerks found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {feeClerks.map((clerk) => (
                          <tr key={clerk._id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {clerk.firstName} {clerk.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {clerk.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs rounded-full font-semibold flex items-center gap-1 w-fit ${
                                clerk.isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                <span className={`h-2 w-2 rounded-full ${clerk.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {clerk.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => handleDeleteFeeClerk(clerk._id, `${clerk.firstName} ${clerk.lastName}`)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
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
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Add New Fee Clerk</h3>
                  <button 
                    onClick={() => setShowAddFeeClerkModal(false)} 
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleCreateFeeClerk} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input 
                      name="firstName" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" 
                      placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input 
                      name="lastName" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" 
                      placeholder="Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input 
                      name="email" 
                      type="email" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" 
                      placeholder="feeclerk@huroorkee.ac.in" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input 
                      name="password" 
                      type="password" 
                      required 
                      minLength={8} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" 
                      placeholder="Minimum 8 characters" 
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>The fee clerk will have access to fees management features only.</span>
                    </p>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button 
                      type="button" 
                      onClick={() => setShowAddFeeClerkModal(false)} 
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all" 
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
      </div>
    );
  }

  // Category Detail View
  const category = FEE_CATEGORIES.find(cat => cat.id === selectedCategory);
  const Icon = category.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-100 flex items-center gap-2 shadow-md transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 ${category.iconBg} rounded-xl flex items-center justify-center shadow-md`}>
              <Icon className={`h-8 w-8 ${category.iconColor}`} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                {category.name}
              </h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-400">
            <p className="text-sm text-gray-600 mb-1 font-medium">Total Students</p>
            <p className="text-3xl font-bold text-gray-800">{currentCategoryData.totalStudents}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-400">
            <p className="text-sm text-gray-600 mb-1 font-medium">Total Collected</p>
            <p className="text-3xl font-bold text-green-600">₹{(currentCategoryData.totalCollected / 100000).toFixed(1)}L</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-400">
            <p className="text-sm text-gray-600 mb-1 font-medium">Pending Count</p>
            <p className="text-3xl font-bold text-red-600">{currentCategoryData.pending}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-400">
            <p className="text-sm text-gray-600 mb-1 font-medium">Pending Amount</p>
            <p className="text-3xl font-bold text-purple-600">₹{(currentCategoryData.pendingAmount / 100000).toFixed(1)}L</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-blue-600" />
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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
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
                    <tr key={payment._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        {payment.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {payment.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {payment.department || payment.hostelName || payment.route || payment.subjects || payment.reason || payment.category}
                        {payment.roomNo && ` - ${payment.roomNo}`}
                        {payment.distance && ` (${payment.distance})`}
                        {payment.semester && ` - Sem ${payment.semester}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {payment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                        ₹{payment.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'overdue'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
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
      </div>
    </div>
  );
};

export default FeesDashboard;
