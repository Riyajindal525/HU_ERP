import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided.');
            return;
        }

        const verify = async () => {
            try {
                const response = await authService.verifyEmail(token);
                if (response.success) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now login.');
                    // Redirect after 3 seconds
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Verification failed.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. Token might be invalid or expired.');
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="card max-w-md w-full p-8 text-center">
                <div className="flex justify-center mb-6">
                    {status === 'verifying' && <Loader2 className="h-16 w-16 text-primary-500 animate-spin" />}
                    {status === 'success' && <CheckCircle className="h-16 w-16 text-success-500" />}
                    {status === 'error' && <XCircle className="h-16 w-16 text-danger-500" />}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {status === 'verifying' && 'Verifying Email'}
                    {status === 'success' && 'Email Verified'}
                    {status === 'error' && 'Verification Failed'}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {message}
                </p>

                {status !== 'verifying' && (
                    <Link to="/login" className="btn btn-primary w-full">
                        Back to Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
