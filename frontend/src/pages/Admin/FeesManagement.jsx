import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Users, AlertCircle, TrendingUp, Settings, UserPlus, Trash2, X, Award, Clock, CheckCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

// Static Demo Data
const STATIC_STATS = {
  totalStudents: 1247,
  feesPaid: 892,
  pendingFees: 355,
  totalRevenue: 18650000,
  collectionRate: 71.5,
  monthlyGrowth: 12.3
};

const STATIC_PENDING_PAYMENTS = [
  {
    _id: '1',
    rollNumber: 'CSE2024001',
    studentName: 'Aarav Sharma',
    department: 'Computer Science',
    semester: 'III',
    amount: 45000,
    dueDate: '2024-03-15',
    status: 'overdue'
  },
  {
    _id: '2',
    rollNumber: 'ECE2024015',
    studentName: 'Diya Patel',
    department: 'Electronics',
    semester: 'V',
    amount: 42000,
    dueDate: '2024-03-20',
    status: 'pending'
  },
  {
    _id: '3',
    rollNumber: 'ME2024032',
    studentName: 'Arjun Kumar',
    department: 'Mechanical',
    semester: 'I',
    amount: 48000,
    dueDate: '2024-03-18',
    status: 'pending'
  },
  {
    _id: '4',
    rollNumber: 'CSE2024089',
    studentName: 'Priya Singh',
    department: 'Computer Science',
    semester: 'VII',
    amount: 45000,
    dueDate: '2024-03-10',
    status: 'overdue'
  },
  {
    _id: '5',
    rollNumber: 'CE2024045',
    studentName: 'Rohan Verma',
    department: 'Civil Engineering',
    semester: 'III',
    amount: 44000,
    dueDate: '2024-03-22',
    status: 'pending'
  },
  {
    _id: '6',
    rollNumber: 'IT2024056',
    studentName: 'Ananya Reddy',
    department: 'Information Tech',
    semester: 'V',
    amount: 46000,
    dueDate: '2024-03-25',
    status: 'pending'
  },
  {
    _id: '7',
    rollNumber: 'EE2024023',
    studentName: 'Kabir Joshi',
    department: 'Electrical',
    semester: 'I',
    amount: 43000,
    dueDate: '2024-03-12',
    status: 'overdue'
  },
  {
    _id: '8',
    rollNumber: 'CSE2024112',
    studentName: 'Sanya Gupta',
    department: 'Computer Science',
    semester: 'III',
    amount: 45000,
    dueDate: '2024-03-28',
    status: 'pending'
  }
];

const STATIC_FEE_CLERKS = [
  {
    _id: 'fc1',
    firstName: 'Rajesh',
    lastName: 'Mehta',
    email: 'rajesh.mehta@huroorkee.ac.in',
    isActive: true,
    paymentsProcessed: 234,
    lastActive: '2024-02-11'
  },
  {
    _id: 'fc2',
    firstName: 'Sneha',
    lastName: 'Kapoor',
    email: 'sneha.kapoor@huroorkee.ac.in',
    isActive: true,
    paymentsProcessed: 189,
    lastActive: '2024-02-11'
  },
  {
    _id: 'fc3',
    firstName: 'Amit',
    lastName: 'Desai',
    email: 'amit.desai@huroorkee.ac.in',
    isActive: false,
    paymentsProcessed: 156,
    lastActive: '2024-01-28'
  }
];

const FeesManagement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showFeeClerkModal, setShowFeeClerkModal] = useState(false);
  const [showAddFeeClerkModal, setShowAddFeeClerkModal] = useState(false);
  const [useStaticData, setUseStaticData] = useState(true); // Toggle for demo mode

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // Get statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['fee-statistics'],
    queryFn: () => api.get('/fees/statistics'),
    enabled: !useStaticData,
  });

  // Get pending payments
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: () => api.get('/fees/pending?limit=100'),
    enabled: !useStaticData,
  });

  // Get fee clerks (only for admins)
  const { data: feeClerksData } = useQuery({
    queryKey: ['fee-clerks'],
    queryFn: () => api.get('/auth/users?role=FEE_CLERK'),
    enabled: isAdmin && showFeeClerkModal && !useStaticData,
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

  // Use static or API data
  const stats = useStaticData ? STATIC_STATS : (statsData?.data || {});
  const pendingPayments = useStaticData ? STATIC_PENDING_PAYMENTS : (pendingData?.data?.payments || []);
  const feeClerks = useStaticData ? STATIC_FEE_CLERKS : (feeClerksData?.data?.users || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      {/* Header with Gradient */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-10"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in">
              Fees Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Track, manage, and optimize fee collections
            </p>
          </div>
          <div className="flex gap-3">
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
      </div>

      {/* Enhanced Statistics Cards with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-blue-500 hover:shadow-2xl group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Total Students</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {statsLoading ? '...' : stats.totalStudents?.toLocaleString() || 0}
              </p>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3" />
                <span>+5.2% from last month</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Fees Paid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-green-500 hover:shadow-2xl group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Fees Paid</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {statsLoading ? '...' : stats.feesPaid?.toLocaleString() || 0}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-3 w-3" />
                <span>{stats.collectionRate}% collection rate</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-red-500 hover:shadow-2xl group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Pending Fees</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                {statsLoading ? '...' : stats.pendingFees?.toLocaleString() || 0}
              </p>
              <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                <Clock className="h-3 w-3" />
                <span>Requires attention</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl md:col-span-2 lg:col-span-3 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100 mb-1 font-medium">Total Revenue (This Year)</p>
              <p className="text-5xl font-bold text-white mb-2">
                ₹{statsLoading ? '...' : (stats.totalRevenue || 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-purple-100">
                  <TrendingUp className="h-4 w-4" />
                  <span>+{stats.monthlyGrowth}% this month</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-purple-100">
                  <Award className="h-4 w-4" />
                  <span>Target: ₹20,000,000</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-16 w-16 text-white" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-purple-400/30 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(stats.totalRevenue / 20000000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Fee Payments Table with Enhanced Design */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-indigo-900/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Pending Fee Payments
            </h2>
            <span className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-semibold">
              {pendingPayments.length} Pending
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingLoading && !useStaticData ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                      <p className="text-gray-500 font-medium">No pending payments</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingPayments.map((payment, index) => (
                  <tr 
                    key={payment._id} 
                    className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {payment.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {payment.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                        Sem {payment.semester}
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

      {/* Manage Fee Clerks Modal with Enhanced Design */}
      {showFeeClerkModal && isAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
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
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Processed</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {feeClerks.map((clerk, index) => (
                      <tr key={clerk._id} className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {clerk.firstName} {clerk.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {clerk.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-semibold">
                            {clerk.paymentsProcessed || 0} payments
                          </span>
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

      {/* Add Fee Clerk Modal with Enhanced Design */}
      {showAddFeeClerkModal && isAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
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

      {/* Add custom animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FeesManagement;
