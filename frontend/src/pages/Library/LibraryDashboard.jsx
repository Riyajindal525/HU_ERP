import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, X, Settings, UserPlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const LibraryDashboard = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showLibrarianModal, setShowLibrarianModal] = useState(false);
  const [showAddLibrarianModal, setShowAddLibrarianModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const { data: booksData, isLoading } = useQuery({
    queryKey: ['library-books', searchTerm],
    queryFn: () => api.get(`/library/books?search=${searchTerm}&limit=100`),
  });

  const { data: issuesData } = useQuery({
    queryKey: ['library-issues'],
    queryFn: () => api.get('/library/issues?status=ISSUED&limit=100'),
  });

  // Get all librarians (only for admins)
  const { data: librariansData } = useQuery({
    queryKey: ['librarians'],
    queryFn: () => api.get('/auth/users?role=LIBRARIAN'),
    enabled: isAdmin && showLibrarianModal,
  });

  const addBookMutation = useMutation({
    mutationFn: (data) => api.post('/library/books', data),
    onSuccess: () => {
      toast.success('Book added successfully');
      setShowAddModal(false);
      queryClient.invalidateQueries(['library-books']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add book');
    },
  });

  const issueBookMutation = useMutation({
    mutationFn: (data) => api.post('/library/issues', data),
    onSuccess: () => {
      toast.success('Book issued successfully');
      setShowIssueModal(false);
      queryClient.invalidateQueries(['library-books']);
      queryClient.invalidateQueries(['library-issues']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to issue book');
    },
  });

  const returnBookMutation = useMutation({
    mutationFn: (issueId) => api.patch(`/library/issues/${issueId}/return`),
    onSuccess: (response) => {
      const fine = response.data.data.fine;
      if (fine > 0) {
        toast.success(`Book returned. Fine: ₹${fine}`);
      } else {
        toast.success('Book returned successfully');
      }
      setShowReturnModal(false);
      queryClient.invalidateQueries(['library-books']);
      queryClient.invalidateQueries(['library-issues']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to return book');
    },
  });

  // Create librarian mutation
  const createLibrarianMutation = useMutation({
    mutationFn: (data) => api.post('/auth/register', { ...data, role: 'LIBRARIAN' }),
    onSuccess: () => {
      toast.success('Librarian created successfully');
      setShowAddLibrarianModal(false);
      queryClient.invalidateQueries(['librarians']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create librarian');
    },
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
    },
  });

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addBookMutation.mutate({
      title: formData.get('title'),
      author: formData.get('author'),
      isbn: formData.get('isbn'),
      category: formData.get('category'),
      publisher: formData.get('publisher'),
      publishedYear: parseInt(formData.get('publishedYear')),
      totalCopies: parseInt(formData.get('totalCopies')),
    });
  };

  const handleIssueBook = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    issueBookMutation.mutate({
      bookId: formData.get('bookId'),
      rollNumber: formData.get('rollNumber'),
      dueDate: formData.get('dueDate'),
    });
  };

  const handleCreateLibrarian = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createLibrarianMutation.mutate({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
    });
  };

  const handleDeleteLibrarian = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      deleteLibrarianMutation.mutate(id);
    }
  };

  const books = booksData?.data?.books || [];
  const issues = issuesData?.data?.issues || [];
  const librarians = librariansData?.data?.users || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Library Management
            </h1>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowLibrarianModal(true)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium"
                title="Manage Librarians"
              >
                <Settings className="h-5 w-5" />
                Manage Librarians
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Plus className="h-5 w-5" />
              Add Book
            </button>
            <button
              onClick={() => setShowIssueModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
            >
              Issue Book
            </button>
            <button
              onClick={() => setShowReturnModal(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 font-medium"
            >
              Return Book
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Book Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Author</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No books found</td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{book.title}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{book.author}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{book.isbn}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      book.availableCopies > 0
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {book.availableCopies > 0 ? 'Available' : 'Issued'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Book</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input name="title" required className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
                <input name="author" required className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN</label>
                <input name="isbn" required className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <input name="category" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publisher</label>
                <input name="publisher" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Published Year</label>
                <input name="publishedYear" type="number" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Copies</label>
                <input name="totalCopies" type="number" defaultValue="1" required className="input w-full" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={addBookMutation.isLoading}>
                  {addBookMutation.isLoading ? 'Adding...' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Issue Book</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleIssueBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Book</label>
                <select name="bookId" required className="input w-full">
                  <option value="">Choose a book</option>
                  {books.filter(b => b.availableCopies > 0).map(book => (
                    <option key={book._id} value={book._id}>{book.title} - {book.author}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Roll Number</label>
                <input name="rollNumber" required placeholder="Enter roll number" className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input name="dueDate" type="date" required className="input w-full" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowIssueModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={issueBookMutation.isLoading}>
                  {issueBookMutation.isLoading ? 'Issuing...' : 'Issue Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Book Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Return Book</h3>
              <button onClick={() => setShowReturnModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {issues.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No issued books</p>
              ) : (
                issues.map((issue) => (
                  <div key={issue._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{issue.book?.title}</p>
                      <p className="text-sm text-gray-500">Roll: {issue.rollNumber}</p>
                    </div>
                    <button
                      onClick={() => returnBookMutation.mutate(issue._id)}
                      className="btn btn-sm btn-primary"
                      disabled={returnBookMutation.isLoading}
                    >
                      Return
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Librarians Modal */}
      {showLibrarianModal && isAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Librarians</h3>
              <button onClick={() => setShowLibrarianModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <button
                onClick={() => setShowAddLibrarianModal(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add New Librarian
              </button>
            </div>

            {librarians.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No librarians found</p>
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
                    {librarians.map((librarian) => (
                      <tr key={librarian._id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {librarian.firstName} {librarian.lastName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {librarian.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            librarian.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {librarian.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
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

      {/* Add Librarian Modal */}
      {showAddLibrarianModal && isAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Librarian</h3>
              <button onClick={() => setShowAddLibrarianModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLibrarian} className="space-y-4">
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
                <input name="email" type="email" required className="input w-full" placeholder="librarian@huroorkee.ac.in" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input name="password" type="password" required minLength={8} className="input w-full" placeholder="Minimum 8 characters" />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  The librarian will have access to library management features only.
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddLibrarianModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createLibrarianMutation.isLoading}>
                  {createLibrarianMutation.isLoading ? 'Creating...' : 'Create Librarian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryDashboard;
