import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services';
import {
    Settings as SettingsIcon,
    User,
    Lock,
    Camera,
    UserPlus,
    Save,
    X,
    Eye,
    EyeOff,
    Shield,
    BookOpen,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const Settings = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('profile');
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [showAddLibrarianModal, setShowAddLibrarianModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Get API base URL for profile photos
    const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

    // Handle profile image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload profile photo mutation
    const uploadPhotoMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('profilePhoto', file);
            return authService.uploadProfilePhoto(formData);
        },
        onSuccess: () => {
            toast.success('Profile photo updated successfully');
            setProfileImage(null);
            setImagePreview(null);
            queryClient.invalidateQueries(['currentUser']);
            // Reload user data
            window.location.reload();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to upload photo');
        }
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: (data) => authService.changePassword(data),
        onSuccess: () => {
            toast.success('Password changed successfully');
            setShowPasswordModal(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    });

    // Create admin mutation
    const createAdminMutation = useMutation({
        mutationFn: (data) => authService.register({ ...data, role: 'ADMIN' }),
        onSuccess: () => {
            toast.success('Admin created successfully');
            setShowAddAdminModal(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create admin');
        }
    });

    // Create librarian mutation
    const createLibrarianMutation = useMutation({
        mutationFn: (data) => authService.register({ ...data, role: 'LIBRARIAN' }),
        onSuccess: () => {
            toast.success('Librarian created successfully');
            setShowAddLibrarianModal(false);
            queryClient.invalidateQueries(['librarians']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create librarian');
        }
    });

    // Get all librarians
    const { data: librariansData } = useQuery({
        queryKey: ['librarians'],
        queryFn: () => api.get('/auth/users?role=LIBRARIAN'),
        enabled: activeTab === 'librarians'
    });

    // Delete librarian mutation
    const deleteLibrarianMutation = useMutation({
        mutationFn: (id) => api.delete(`/auth/users/${id}`),
        onSuccess: () => {
            toast.success('Librarian removed successfully');
            queryClient.invalidateQueries(['librarians']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to remove librarian');
        }
    });

    const handlePasswordChange = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        changePasswordMutation.mutate({
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('confirmPassword')
        });
    };

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        createAdminMutation.mutate({
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password')
        });
    };

    const handleCreateLibrarian = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        createLibrarianMutation.mutate({
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password')
        });
    };

    const handleDeleteLibrarian = (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name}?`)) {
            deleteLibrarianMutation.mutate(id);
        }
    };

    const librarians = librariansData?.data?.users || [];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <SettingsIcon className="h-7 w-7 mr-3" />
                    Settings
                </h1>
                <p className="text-sm text-gray-500">Manage your account and system settings</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'profile'
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'security'
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <Lock className="h-4 w-4 inline mr-2" />
                    Security
                </button>
                <button
                    onClick={() => setActiveTab('admins')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'admins'
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <Shield className="h-4 w-4 inline mr-2" />
                    Admin Management
                </button>
                <button
                    onClick={() => setActiveTab('librarians')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'librarians'
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <BookOpen className="h-4 w-4 inline mr-2" />
                    Librarian Management
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="card max-w-2xl">
                    <div className="card-body space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                        
                        {/* Profile Photo */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : user?.profilePhoto ? (
                                        <img src={`${API_BASE_URL}${user.profilePhoto}`} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        user?.firstName?.[0] || 'A'
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                                    <Camera className="h-4 w-4 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    {user?.firstName} {user?.lastName}
                                </h4>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Role: <span className="font-medium text-primary-600">{user?.role}</span>
                                </p>
                            </div>
                        </div>

                        {profileImage && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => uploadPhotoMutation.mutate(profileImage)}
                                    disabled={uploadPhotoMutation.isLoading}
                                    className="btn btn-primary"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {uploadPhotoMutation.isLoading ? 'Uploading...' : 'Save Photo'}
                                </button>
                                <button
                                    onClick={() => {
                                        setProfileImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="btn btn-secondary"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </button>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.firstName || ''}
                                        disabled
                                        className="input w-full bg-gray-50 dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.lastName || ''}
                                        disabled
                                        className="input w-full bg-gray-50 dark:bg-gray-700"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="input w-full bg-gray-50 dark:bg-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div className="card max-w-2xl">
                    <div className="card-body space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Password</h4>
                                    <p className="text-sm text-gray-500">Change your account password</p>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="btn btn-primary"
                                >
                                    <Lock className="h-4 w-4 mr-2" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Management Tab */}
            {activeTab === 'admins' && (
                <div className="card">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Management</h3>
                            <button
                                onClick={() => setShowAddAdminModal(true)}
                                className="btn btn-primary"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add New Admin
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            Create new admin accounts to manage the system. New admins will receive login credentials via email.
                        </p>
                    </div>
                </div>
            )}

            {/* Librarian Management Tab */}
            {activeTab === 'librarians' && (
                <div className="card">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Librarian Management</h3>
                            <button
                                onClick={() => setShowAddLibrarianModal(true)}
                                className="btn btn-primary"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add New Librarian
                            </button>
                        </div>
                        
                        {librarians.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">
                                No librarians found. Add a librarian to manage the library system.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {librarians.map((librarian) => (
                                            <tr key={librarian._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {librarian.firstName} {librarian.lastName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {librarian.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        librarian.isActive
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                        {librarian.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDeleteLibrarian(librarian._id, `${librarian.firstName} ${librarian.lastName}`)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        disabled={deleteLibrarianMutation.isLoading}
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

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowPasswordModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
                                <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="currentPassword"
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            className="input w-full pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="newPassword"
                                            type={showNewPassword ? 'text' : 'password'}
                                            className="input w-full pr-10"
                                            minLength={8}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        className="input w-full"
                                        minLength={8}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={changePasswordMutation.isLoading}>
                                        {changePasswordMutation.isLoading ? 'Changing...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Admin Modal */}
            {showAddAdminModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddAdminModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Admin</h3>
                                <button onClick={() => setShowAddAdminModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateAdmin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        className="input w-full"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        className="input w-full"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        className="input w-full"
                                        placeholder="admin@huroorkee.ac.in"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        className="input w-full"
                                        placeholder="Minimum 8 characters"
                                        minLength={8}
                                        required
                                    />
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">
                                        The new admin will be able to access all admin features and manage the system.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowAddAdminModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={createAdminMutation.isLoading}>
                                        {createAdminMutation.isLoading ? 'Creating...' : 'Create Admin'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Librarian Modal */}
            {showAddLibrarianModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddLibrarianModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Librarian</h3>
                                <button onClick={() => setShowAddLibrarianModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateLibrarian} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        className="input w-full"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        className="input w-full"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        className="input w-full"
                                        placeholder="librarian@huroorkee.ac.in"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        className="input w-full"
                                        placeholder="Minimum 8 characters"
                                        minLength={8}
                                        required
                                    />
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">
                                        The librarian will only have access to the library management system.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowAddLibrarianModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={createLibrarianMutation.isLoading}>
                                        {createLibrarianMutation.isLoading ? 'Creating...' : 'Create Librarian'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
