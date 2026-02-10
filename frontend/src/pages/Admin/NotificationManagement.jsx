import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Plus, Send, Users, X, AlertCircle, Info, MessageSquare, Calendar, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const NotificationManagement = () => {
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState('all');
    const [selectedRole, setSelectedRole] = useState('STUDENT');

    // Fetch notifications
    const { data: notificationsData, isLoading } = useQuery({
        queryKey: ['admin-notifications'],
        queryFn: () => api.get('/notifications/all'),
        refetchInterval: 30000,
    });

    // Create notification mutation
    const createNotificationMutation = useMutation({
        mutationFn: async (data) => {
            return api.post('/notifications/bulk', data);
        },
        onSuccess: () => {
            toast.success('Notification sent successfully');
            setShowCreateModal(false);
            queryClient.invalidateQueries(['admin-notifications']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to send notification');
        },
    });

    // Delete notification mutation
    const deleteNotificationMutation = useMutation({
        mutationFn: async (notificationId) => {
            return api.delete(`/notifications/admin/${notificationId}`);
        },
        onSuccess: () => {
            toast.success('Notification deleted successfully');
            queryClient.invalidateQueries(['admin-notifications']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete notification');
        },
    });

    const handleDeleteNotification = (notificationId) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            deleteNotificationMutation.mutate(notificationId);
        }
    };

    const handleCreateNotification = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const recipientQuery = {};
        if (selectedRecipients === 'role') {
            recipientQuery.role = selectedRole;
        } else if (selectedRecipients === 'all') {
            recipientQuery.role = { $in: ['STUDENT', 'FACULTY'] };
        }

        const notificationData = {
            recipientQuery,
            type: formData.get('type'),
            title: formData.get('title'),
            message: formData.get('message'),
            priority: formData.get('priority') || 'MEDIUM',
        };

        createNotificationMutation.mutate(notificationData);
    };

    // Extract notifications array from API response
    const notifications = Array.isArray(notificationsData?.data?.notifications) 
        ? notificationsData.data.notifications 
        : [];

    const typeIcons = {
        ANNOUNCEMENT: Bell,
        ALERT: AlertCircle,
        REMINDER: Calendar,
        MESSAGE: MessageSquare,
        INFO: Info,
    };

    const priorityColors = {
        LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center">
                            <Bell className="h-8 w-8 mr-3" />
                            Notification Management
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Send notifications to students and faculty
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Create Notification
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="card">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Notifications</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {notifications.length}
                                </p>
                            </div>
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                <Send className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {notifications.filter(n => !n.isRead).length}
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Recipients</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    All Users
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="card">
                <div className="card-header">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Recent Notifications
                    </h2>
                </div>
                <div className="card-body">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Create your first notification to get started
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.slice(0, 10).map((notification) => {
                                const TypeIcon = typeIcons[notification.type] || Bell;
                                return (
                                    <div
                                        key={notification._id}
                                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                            <TypeIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className={`text-xs px-2 py-1 rounded ${priorityColors[notification.priority]}`}>
                                                            {notification.priority}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteNotification(notification._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Notification Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowCreateModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Create Notification
                                </h3>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateNotification} className="space-y-4">
                                {/* Recipients */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Recipients
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="recipients"
                                                value="all"
                                                checked={selectedRecipients === 'all'}
                                                onChange={(e) => setSelectedRecipients(e.target.value)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">All Users (Students & Faculty)</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="recipients"
                                                value="role"
                                                checked={selectedRecipients === 'role'}
                                                onChange={(e) => setSelectedRecipients(e.target.value)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Specific Role</span>
                                        </label>
                                    </div>
                                    {selectedRecipients === 'role' && (
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="input w-full mt-2"
                                        >
                                            <option value="STUDENT">Students</option>
                                            <option value="FACULTY">Faculty</option>
                                        </select>
                                    )}
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Type
                                    </label>
                                    <select name="type" className="input w-full" required>
                                        <option value="ANNOUNCEMENT">Announcement</option>
                                        <option value="ALERT">Alert</option>
                                        <option value="REMINDER">Reminder</option>
                                        <option value="MESSAGE">Message</option>
                                        <option value="INFO">Info</option>
                                    </select>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Priority
                                    </label>
                                    <select name="priority" className="input w-full" required>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title
                                    </label>
                                    <input
                                        name="title"
                                        type="text"
                                        className="input w-full"
                                        placeholder="Enter notification title"
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        className="input w-full"
                                        placeholder="Enter notification message"
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={createNotificationMutation.isLoading}
                                    >
                                        {createNotificationMutation.isLoading ? 'Sending...' : 'Send Notification'}
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

export default NotificationManagement;
