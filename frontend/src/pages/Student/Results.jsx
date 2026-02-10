import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import resultService from '../../services/resultService';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import toast from 'react-hot-toast';

const Results = () => {
  const { user } = useSelector((state) => state.auth);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cgpa, setCgpa] = useState(null);

  useEffect(() => {
    fetchResults();
    fetchCGPA();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await resultService.getStudentResults(user.profileId);
      setResults(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const fetchCGPA = async () => {
    try {
      const response = await resultService.calculateCGPA(user.profileId);
      setCgpa(response.data.cgpa);
    } catch (error) {
      console.error('Failed to fetch CGPA:', error);
    }
  };

  const getGradeBadgeVariant = (grade) => {
    const variants = {
      'A+': 'success',
      'A': 'success',
      'B+': 'primary',
      'B': 'primary',
      'C+': 'warning',
      'C': 'warning',
      'D': 'danger',
      'F': 'danger',
    };
    return variants[grade] || 'default';
  };

  const columns = [
    {
      header: 'Exam',
      accessor: 'exam',
      render: (row) => (
        <div>
          <div className="font-medium">{row.exam?.name}</div>
          <div className="text-xs text-gray-500">{row.exam?.type}</div>
        </div>
      ),
    },
    {
      header: 'Subject',
      accessor: 'subject',
      render: (row) => (
        <div>
          <div className="font-medium">{row.subject?.name}</div>
          <div className="text-xs text-gray-500">{row.subject?.code}</div>
        </div>
      ),
    },
    {
      header: 'Marks',
      accessor: 'marks',
      render: (row) => `${row.marksObtained} / ${row.totalMarks}`,
    },
    {
      header: 'Percentage',
      accessor: 'percentage',
      render: (row) => `${row.percentage.toFixed(2)}%`,
    },
    {
      header: 'Grade',
      accessor: 'grade',
      render: (row) => (
        <Badge variant={getGradeBadgeVariant(row.grade)}>
          {row.grade}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'isPassed',
      render: (row) => (
        <Badge variant={row.isPassed ? 'success' : 'danger'}>
          {row.isPassed ? 'Passed' : 'Failed'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
        {cgpa !== null && (
          <div className="text-right">
            <div className="text-sm text-gray-600">CGPA</div>
            <div className="text-3xl font-bold text-blue-600">{cgpa.toFixed(2)}</div>
          </div>
        )}
      </div>

      <Card>
        <Table
          columns={columns}
          data={results}
          loading={loading}
          emptyMessage="No results available yet"
        />
      </Card>
    </div>
  );
};

export default Results;
