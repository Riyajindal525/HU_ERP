import { Link } from 'react-router-dom';
import { GraduationCap, Lock, AlertCircle } from 'lucide-react';

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-primary-600 rounded-2xl shadow-lg">
                            <GraduationCap className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        Registration Disabled
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Haridwar University ERP Portal
                    </p>
                </div>

                {/* Info Card */}
                <div className="card">
                    <div className="card-body space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <Lock className="h-8 w-8 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Admin-Only Registration
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Public registration is disabled. Only administrators can create student and faculty accounts.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800 dark:text-blue-300">
                                    <p className="font-medium mb-1">Already have an account?</p>
                                    <p>If your account has been created by an administrator, you can login using the OTP system.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">How to get access:</h4>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li>Contact your administrator</li>
                                <li>Admin will create your account with your email</li>
                                <li>Login using OTP sent to your email</li>
                            </ol>
                        </div>

                        <Link
                            to="/login"
                            className="btn btn-primary w-full"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Need help?{' '}
                    <a
                        href="mailto:admin@huroorkee.ac.in"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        Contact Administrator
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
