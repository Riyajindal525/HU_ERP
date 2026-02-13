import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCredentials,
  clearCredentials,
  setLoading,
  selectIsAuthenticated,
  selectCurrentUser,
  selectUserProfile,
  selectUserRole,
} from '../store/slices/authSlice';
import { authService } from '../services';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const profile = useSelector(selectUserProfile);
  const role = useSelector(selectUserRole);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && !isAuthenticated) {
        try {
          dispatch(setLoading(true));
          const response = await authService.getCurrentUser();
          if (response.success) {
            dispatch(setCredentials(response.data));
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Clear expired or invalid token
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(clearCredentials());
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    initAuth();
  }, [dispatch, isAuthenticated]);

  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Get user profile
        const userResponse = await authService.getCurrentUser();
        dispatch(setCredentials(userResponse.data));
        toast.success('Login successful!');
        return userResponse.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const sendOtp = async (email) => {
    try {
      dispatch(setLoading(true));
      console.log('🔵 Sending OTP to:', email);
      const response = await authService.sendOtp(email);
      console.log('🔵 OTP Response:', response);
      
      if (response.success) {
        toast.success(response.message || 'OTP sent successfully');
        return response.data;
      } else {
        toast.error(response.message || 'Failed to send OTP');
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('🔴 OTP Error:', error);
      console.error('🔴 Error Response:', error.response);
      const message = error.response?.data?.message || error.message || 'Failed to send OTP';
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginWithOtp = async (email, otp) => {
    try {
      dispatch(setLoading(true));
      console.log('🔵 Logging in with OTP:', { email, otp });
      const response = await authService.loginWithOtp(email, otp);
      console.log('🔵 Login Response:', response);
      
      if (response.success) {
        // Get user profile
        const userResponse = await authService.getCurrentUser();
        console.log('🔵 User Response:', userResponse);
        
        if (userResponse.success) {
          dispatch(setCredentials(userResponse.data));
          toast.success('Login successful!');
          return userResponse.data;
        } else {
          toast.error(userResponse.message || 'Failed to get user data');
          return null;
        }
      } else {
        toast.error(response.message || 'Login failed');
        return null;
      }
    } catch (error) {
      console.error('🔴 Login Error:', error);
      console.error('🔴 Error Response:', error.response);
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (data) => {
    console.log(data)
    try {
      dispatch(setLoading(true));
      const response = await authService.register(data);
      
      if (response.success) {
        // Update Redux state with the new user data
        dispatch(setCredentials(response.data));
        toast.success('Registration successful! Welcome!');
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch(clearCredentials());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear credentials anyway
      dispatch(clearCredentials());
      navigate('/login');
    }
  };

  const hasRole = (allowedRoles) => {
    if (!role) return false;
    return Array.isArray(allowedRoles) 
      ? allowedRoles.includes(role) 
      : role === allowedRoles;
  };

  return {
    isAuthenticated,
    user,
    profile,
    role,
    login,
    sendOtp,
    loginWithOtp,
    register,
    logout,
    hasRole,
  };
};

export default useAuth;
