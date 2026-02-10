import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const Reports = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/faculty/dashboard')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                            Reports
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="card">
                    <div className="card-body text-center py-12">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Reports & Analytics
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            This feature is coming soon. You'll be able to generate and view reports here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
