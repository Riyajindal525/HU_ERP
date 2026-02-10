import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Users, AlertCircle, TrendingUp, Settings, UserPlus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const FeesManagement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showFeeClerkModal, setShowFeeClerkModal] = useState(false);
  const [showAddFeeClerkModal, setShowAddFeeClerkModal] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // Get statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['fee-statistics'],
    queryFn: () => api.get('/fees/statistics'),
  });

  // Get pending payments
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: () => api.get('/fees/pending?limit=100'),
  });

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

  const stats = statsData?.data || {};
  const pendingPayments = pendingData?.data?.payments || [];
  const feeClerks = feeClerksData?.data?.users || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Fees Management
            </h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowFeeClerkModal(true)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
              title="Manage Fee Clerks"
            >
              <Settings className="h-5 w-5" />
              Manage Fee Clerks
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats.totalStudents || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Fees Paid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fees Paid</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {statsLoading ? '...' : stats.feesPaid || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Fees</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {statsLoading ? '...' : stats.pendingFees || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                ₹{statsLoading ? '...' : (stats.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Fee Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Pending Fee Payments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No pending payments
                  </td>
                </tr>
              ) : (
                pendingPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {payment.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {payment.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ₹{payment.amount?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Fee Clerks Modal */}
      {showFeeClerkModal && isAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Fee Clerks</h3>
              <button onClick={() => setShowFeeClerkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <button
                onClick={() => setShowAddFeeClerkModal(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add New Fee Clerk
              </button>
            </div>

            {feeClerks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No fee clerks found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {feeClerks.map((clerk) => (
                      <tr key={clerk._id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {clerk.firstName} {clerk.lastName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {clerk.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            clerk.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {clerk.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteFeeClerk(clerk._id, `${clerk.firstName} ${clerk.lastName}`)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            disabled={deleteFeeClerkMutation.isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Fee Clerk</h3>
              <button onClick={() => setShowAddFeeClerkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFeeClerk} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input name="firstName" required className="input w-full" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input name="lastName" required className="input w-full" placeholder="Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input name="email" type="email" required className="input w-full" placeholder="feeclerk@huroorkee.ac.in" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input name="password" type="password" required minLength={8} className="input w-full" placeholder="Minimum 8 characters" />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  The fee clerk will have access to fees management features only.
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddFeeClerkModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createFeeClerkMutation.isLoading}>
                  {createFeeClerkMutation.isLoading ? 'Creating...' : 'Create Fee Clerk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesManagement;
