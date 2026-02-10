import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import examService from '../../services/examService';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Exams = () => {
  const { user } = useSelector((state) => state.auth);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingExams();
  }, []);

  const fetchUpcomingExams = async () => {
    try {
      setLoading(true);
      const response = await examService.getUpcomingExams(user.course);
      setUpcomingExams(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const getExamTypeBadge = (type) => {
    const variants = {
      MID_TERM: 'primary',
      END_TERM: 'danger',
      INTERNAL: 'info',
      ASSIGNMENT: 'warning',
      QUIZ: 'success',
    };
    return variants[type] || 'default';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Upcoming Exams</h1>

      {upcomingExams.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            No upcoming exams scheduled
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingExams.map((exam) => (
            <Card key={exam._id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                  <Badge variant={getExamTypeBadge(exam.type)}>
                    {exam.type.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{exam.subject?.name}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{format(new Date(exam.date), 'PPP')}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{exam.duration} minutes</span>
                  </div>

                  {exam.venue && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{exam.venue}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-semibold">{exam.totalMarks}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Passing Marks:</span>
                    <span className="font-semibold">{exam.passingMarks}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exams;
