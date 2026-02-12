import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { facultyService, courseService, subjectService } from '../../services';
import {
  Users,
  Search,
  BookOpen,
  Trash2,
  Briefcase,
  AlertCircle,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyManagement = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [preSelectedSubject, setPreSelectedSubject] = useState(null);

  // ✅ Add Faculty form state (includes password)
  const [facultyForm, setFacultyForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Check if we're coming from Subject Management with a subject to assign
  useEffect(() => {
    if (location.state?.assignSubject) {
      setPreSelectedSubject({
        id: location.state.subjectId,
        name: location.state.subjectName,
        code: location.state.subjectCode,
        courseId: location.state.courseId,
        semester: location.state.semester
      });

      toast.success(`Select a faculty member to assign "${location.state.subjectName}"`, {
        duration: 5000
      });
    }
  }, [location.state]);

  // Fetch Faculty with auto-refresh
  const { data: facultyData, isLoading } = useQuery({
    queryKey: ['faculty', search],
    queryFn: () => facultyService.getAll({ search }),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Fetch all subjects to show faculty assignments
  const { data: allSubjectsData } = useQuery({
    queryKey: ['all-subjects'],
    queryFn: () => subjectService.getAll({ limit: 1000 }),
    refetchOnWindowFocus: true,
  });

  // Mutation: Create Faculty (NOW sends password too)
  const createFacultyMutation = useMutation({
    mutationFn: (data) => facultyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['faculty']);
      toast.success('Faculty account created successfully');
      setShowAddFacultyModal(false);
      setFacultyForm({ firstName: '', lastName: '', email: '', password: '' });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Failed to create faculty')
  });

  // Mutation: Update Faculty (Allocated Subjects)
  const updateFacultyMutation = useMutation({
    mutationFn: ({ subjectId, facultyId, data }) =>
      subjectService.assignFaculty(subjectId, { ...data, facultyId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['faculty']);
      queryClient.invalidateQueries(['subjects']);
      toast.success('Subject assigned to faculty successfully');
      setShowSubjectModal(false);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Assignment failed')
  });

  // Fetch Courses for dropdown
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll({ limit: 100 })
  });

  // Mutation: Delete Faculty
  const deleteFacultyMutation = useMutation({
    mutationFn: (id) => facultyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['faculty']);
      toast.success('Faculty deleted successfully');
    },
    onError: () => toast.error('Failed to delete faculty')
  });

  const handleOpenAddModal = () => {
    setFacultyForm({ firstName: '', lastName: '', email: '', password: '' });
    setShowAddFacultyModal(true);
  };

  const handleCreateFaculty = (e) => {
    e.preventDefault();

    // ✅ Basic validations
    if (!facultyForm.firstName.trim()) return toast.error('First name is required');
    if (!facultyForm.lastName.trim()) return toast.error('Last name is required');
    if (!facultyForm.email.trim()) return toast.error('Email is required');
    if (!facultyForm.password || facultyForm.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    createFacultyMutation.mutate({
      firstName: facultyForm.firstName.trim(),
      lastName: facultyForm.lastName.trim(),
      email: facultyForm.email.trim().toLowerCase(),
      password: facultyForm.password, // ✅ NEW
      role: 'FACULTY'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faculty Management</h1>
          <p className="text-sm text-gray-500">Manage faculty members and subject allocations</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Users className="h-5 w-5 mr-2" />
          Add Faculty
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search faculty..."
            className="input pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Faculty Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
              ) : facultyData?.data?.faculty?.map((faculty) => {
                const assignedSubjects = (allSubjectsData?.data || []).filter(subject =>
                  subject.facultyAssigned?.some(fa => fa.faculty?._id === faculty._id)
                );

                return (
                  <tr key={faculty._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                          {faculty.firstName?.[0] || 'F'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {faculty.firstName} {faculty.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{faculty.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {faculty.designation}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {assignedSubjects.length > 0 ? (
                          assignedSubjects.map((subject) => {
                            const assignment = subject.facultyAssigned.find(fa => fa.faculty?._id === faculty._id);
                            return (
                              <span key={subject._id} className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                                {subject.code}{assignment?.section ? ` (${assignment.section})` : ''}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-gray-400 text-xs">No subjects</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          title="Allocated Subjects"
                          onClick={() => {
                            setSelectedFaculty(faculty);
                            setShowSubjectModal(true);
                          }}
                          className={`p-1 hover:bg-blue-50 rounded ${
                            preSelectedSubject ? 'text-green-600 animate-pulse' : 'text-blue-600'
                          }`}
                        >
                          <BookOpen className="h-5 w-5" />
                        </button>

                        <button
                          title="Delete"
                          onClick={() => {
                            if (window.confirm('Delete this faculty member?')) {
                              deleteFacultyMutation.mutate(faculty._id);
                            }
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Allocate Subject */}
      {showSubjectModal && selectedFaculty && (
        <AssignSubjectModal
          faculty={selectedFaculty}
          courses={coursesData?.data?.courses || []}
          preSelectedSubject={preSelectedSubject}
          onClose={() => {
            setShowSubjectModal(false);
            setPreSelectedSubject(null);
          }}
          onSubmit={(data) => {
            updateFacultyMutation.mutate({
              subjectId: data.subject,
              facultyId: selectedFaculty._id,
              data: {
                section: data.section,
                academicYear: data.academicYear
              }
            });
            setPreSelectedSubject(null);
          }}
        />
      )}

      {/* ✅ Modal: Add Faculty (NOW with password) */}
      {showAddFacultyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowAddFacultyModal(false)}></div>

            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                Add New Faculty
              </h3>

              <form onSubmit={handleCreateFaculty}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <input
                      type="text"
                      value="FACULTY"
                      disabled
                      className="input mt-1 w-full bg-gray-100 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <input
                      type="text"
                      className="input mt-1 w-full"
                      placeholder="Jane"
                      value={facultyForm.firstName}
                      onChange={(e) => setFacultyForm((p) => ({ ...p, firstName: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <input
                      type="text"
                      className="input mt-1 w-full"
                      placeholder="Smith"
                      value={facultyForm.lastName}
                      onChange={(e) => setFacultyForm((p) => ({ ...p, lastName: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      className="input mt-1 w-full"
                      placeholder="faculty@huroorkee.ac.in"
                      value={facultyForm.email}
                      onChange={(e) => setFacultyForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>

                  {/* ✅ NEW Password field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        className="input pl-10 w-full"
                        placeholder="Set a password (min 6 chars)"
                        value={facultyForm.password}
                        onChange={(e) => setFacultyForm((p) => ({ ...p, password: e.target.value }))}
                        minLength={6}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Admin will set initial password. Faculty can change later (if feature exists).
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      Admin is setting an initial password for faculty.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setShowAddFacultyModal(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={createFacultyMutation.isLoading}
                    >
                      {createFacultyMutation.isLoading ? 'Creating...' : 'Create Faculty'}
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AssignSubjectModal = ({ faculty, courses, preSelectedSubject, onClose, onSubmit }) => {
  const [selectedCourse, setSelectedCourse] = useState(preSelectedSubject?.courseId || '');
  const [selectedSemester, setSelectedSemester] = useState(preSelectedSubject?.semester?.toString() || '');

  const { data: subjectsData } = useQuery({
    queryKey: ['subjects', selectedCourse, selectedSemester],
    queryFn: () => subjectService.getAll({ course: selectedCourse, semester: selectedSemester }),
    enabled: !!selectedCourse
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
            Allocate Subject to {faculty.firstName}
          </h3>

          {preSelectedSubject && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                <BookOpen className="h-4 w-4 inline mr-1" />
                Assigning: <strong>{preSelectedSubject.name}</strong> ({preSelectedSubject.code})
              </p>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            onSubmit({
              subject: formData.get('subject'),
              section: formData.get('section'),
              academicYear: formData.get('academicYear'),
              semester: selectedSemester
            });
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
                <select
                  className="input mt-1 w-full"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  disabled={!!preSelectedSubject}
                  required
                >
                  <option value="">Select Course...</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                <select
                  className="input mt-1 w-full"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  disabled={!!preSelectedSubject}
                  required
                >
                  <option value="">Select Semester...</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>

                {preSelectedSubject && (
                  <input type="hidden" name="subject" value={preSelectedSubject.id} />
                )}

                <select
                  name={preSelectedSubject ? undefined : "subject"}
                  className="input mt-1 w-full"
                  value={preSelectedSubject?.id || ''}
                  onChange={() => {}}
                  disabled={!!preSelectedSubject}
                  required={!preSelectedSubject}
                >
                  <option value="">Select Subject...</option>
                  {preSelectedSubject ? (
                    <option value={preSelectedSubject.id}>
                      {preSelectedSubject.name} ({preSelectedSubject.code})
                    </option>
                  ) : (
                    subjectsData?.data?.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
                <input name="section" type="text" className="input mt-1 w-full" placeholder="A, B, C..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Academic Year</label>
                <input name="academicYear" type="text" className="input mt-1 w-full" defaultValue="2025-26" required />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Allocate</button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default FacultyManagement;