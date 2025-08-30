import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Handle OAuth callback
    const token = searchParams.get('token');
    if (token) {
      handleAuthCallback(token);
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleAuthCallback = async (token: string) => {
    try {
      setToken(token);
      const user = await apiService.getCurrentUser();
      setUser(user);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth callback error:', error);
      toast.error('Authentication failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { auth_url } = await apiService.getGoogleAuthUrl();
      window.location.href = auth_url;
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Failed to initiate Google login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-responsive-2xl font-extrabold text-gray-900">
            Human Record
          </h2>
          <p className="mt-2 text-center text-responsive-base text-gray-600">
            Voice recording with script input
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-responsive-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="text-center">
            <p className="text-responsive-sm text-gray-600">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
