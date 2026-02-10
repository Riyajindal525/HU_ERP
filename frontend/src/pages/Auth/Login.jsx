import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, Loader2, GraduationCap, KeyRound } from 'lucide-react';

const Login = () => {
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
    const [step, setStep] = useState('email'); // 'email' | 'otp' (for OTP method)
    const [loginEmail, setLoginEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, sendOtp, loginWithOtp } = useAuth();
    const navigate = useNavigate();

    // Schema for password login
    const passwordLoginSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    });

    // Schema for OTP email step
    const emailSchema = z.object({
        email: z.string().email('Invalid email address'),
    });

    // Schema for OTP verification step
    const otpSchema = z.object({
        otp: z.string().length(6, 'OTP must be 6 digits'),
    });

    // Determine which schema to use
    const getSchema = () => {
        if (loginMethod === 'password') return passwordLoginSchema;
        if (step === 'email') return emailSchema;
        return otpSchema;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(getSchema()),
    });

    // Handle password-based login
    const handlePasswordLogin = async (data) => {
        setIsLoading(true);
        try {
            const result = await login(data.email, data.password);

            if (result) {
                // Redirect based on role
                if (result?.user?.role === 'STUDENT') {
                    navigate('/student/dashboard');
                } else if (result?.user?.role === 'FACULTY') {
                    navigate('/faculty/dashboard');
                } else if (result?.user?.role === 'LIBRARIAN') {
                    navigate('/library/dashboard');
                } else if (result?.user?.role === 'FEE_CLERK') {
                    navigate('/fees/dashboard');
                } else if (result?.user?.role === 'ADMIN' || result?.user?.role === 'SUPER_ADMIN') {
                    navigate('/admin/dashboard');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP send
    const handleSendOtp = async (data) => {
        setIsLoading(true);
        try {
            await sendOtp(data.email);
            setLoginEmail(data.email);
            setStep('otp');
            reset({ otp: '' }); // Clear form for next step
        } catch (error) {
            console.error('Failed to send OTP:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async (data) => {
        setIsLoading(true);
        try {
            const result = await loginWithOtp(loginEmail, data.otp);

            if (result) {
                // Redirect based on role
                if (result?.user?.role === 'STUDENT') {
                    navigate('/student/dashboard');
                } else if (result?.user?.role === 'FACULTY') {
                    navigate('/faculty/dashboard');
                } else if (result?.user?.role === 'LIBRARIAN') {
                    navigate('/library/dashboard');
                } else if (result?.user?.role === 'FEE_CLERK') {
                    navigate('/fees/dashboard');
                } else if (result?.user?.role === 'ADMIN' || result?.user?.role === 'SUPER_ADMIN') {
                    navigate('/admin/dashboard');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (data) => {
        if (loginMethod === 'password') {
            handlePasswordLogin(data);
        } else if (step === 'email') {
            handleSendOtp(data);
        } else {
            handleVerifyOtp(data);
        }
    };

    // Handle switching login methods
    const switchLoginMethod = (method) => {
        setLoginMethod(method);
        setStep('email');
        reset();
    };

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
                        Haridwar University
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        ERP Portal - Sign in to your account
                    </p>
                </div>

                {/* Login Form */}
                <div className="card">
                    <div className="card-body space-y-6">
                        {/* Login Method Toggle */}
                        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <button
                                type="button"
                                onClick={() => switchLoginMethod('password')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                    loginMethod === 'password'
                                        ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <Lock className="h-4 w-4 inline mr-2" />
                                Password
                            </button>
                            <button
                                type="button"
                                onClick={() => switchLoginMethod('otp')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                    loginMethod === 'otp'
                                        ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <KeyRound className="h-4 w-4 inline mr-2" />
                                OTP
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Password Login Form */}
                            {loginMethod === 'password' && (
                                <>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                {...register('email')}
                                                type="email"
                                                className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                                                placeholder="student@huroorkee.ac.in"
                                                autoFocus
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                {...register('password')}
                                                type={showPassword ? 'text' : 'password'}
                                                className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-danger-600">{errors.password.message}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* OTP Login Form */}
                            {loginMethod === 'otp' && step === 'email' && (
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                                            placeholder="student@huroorkee.ac.in"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
                                    )}
                                </div>
                            )}

                            {loginMethod === 'otp' && step === 'otp' && (
                                <div>
                                    <div className="mb-4 text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Enter the 6-digit code sent to <br />
                                            <span className="font-medium text-gray-900 dark:text-gray-200">{loginEmail}</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setStep('email')}
                                            className="mt-1 text-xs text-primary-600 hover:text-primary-500 hover:underline"
                                        >
                                            Change email
                                        </button>
                                    </div>

                                    <label
                                        htmlFor="otp"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        OTP Code
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register('otp')}
                                            type="text"
                                            maxLength={6}
                                            className={`input pl-10 tracking-widest text-center text-lg ${errors.otp ? 'input-error' : ''}`}
                                            placeholder="123456"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.otp && (
                                        <p className="mt-1 text-sm text-danger-600">{errors.otp.message}</p>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        {loginMethod === 'password' 
                                            ? 'Signing in...' 
                                            : step === 'email' 
                                            ? 'Sending OTP...' 
                                            : 'Verifying...'}
                                    </>
                                ) : (
                                    loginMethod === 'password' 
                                        ? 'Sign In' 
                                        : step === 'email' 
                                        ? 'Send OTP' 
                                        : 'Verify & Login'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
