import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const DebugPage: React.FC = () => {
  const [apiStatus, setApiStatus] = React.useState<string>('Testing...');
  const [envVars, setEnvVars] = React.useState<any>({});
  const [error, setError] = React.useState<string>('');

  useEffect(() => {
    try {
      // Show all environment variables
      const allEnvVars: any = {};
      for (const key in import.meta.env) {
        allEnvVars[key] = import.meta.env[key];
      }
      setEnvVars(allEnvVars);

      // Test API connection
      const testApi = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
          const response = await fetch(`${apiUrl}/auth/google`);
          if (response.ok) {
            const data = await response.json();
            setApiStatus(`✅ API Connected: ${JSON.stringify(data)}`);
          } else {
            setApiStatus(`❌ API Error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          setApiStatus(`❌ API Connection Failed: ${error}`);
        }
      };

      testApi();
    } catch (err) {
      setError(`Error in debug page: ${err}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Frontend Debug Info</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">All Environment Variables:</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">API Status:</h2>
          <p className="text-sm">{apiStatus}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Navigation:</h2>
          <div className="space-y-2">
            <a href="/login" className="block text-blue-600 hover:underline">Go to Login</a>
            <a href="/dashboard" className="block text-blue-600 hover:underline">Go to Dashboard</a>
            <a href="/" className="block text-blue-600 hover:underline">Go to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">React App is Working!</h1>
        <p className="mb-4">If you can see this, the React app is loading correctly.</p>
        <div className="space-y-2">
          <a href="/debug" className="block text-blue-600 hover:underline">Go to Debug Page</a>
          <a href="/login" className="block text-blue-600 hover:underline">Go to Login</a>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { user, setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    try {
      // Debug environment variables
      console.log('Environment Variables:', {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE,
        BASE_URL: import.meta.env.BASE_URL
      });

      // Check if user data exists in localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser && isAuthenticated && !user) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error in App useEffect:', error);
    }
  }, [isAuthenticated, user, setUser]);

  return (
    <Routes>
      <Route path="/test" element={<SimpleTestPage />} />
      <Route path="/debug" element={<DebugPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/test" replace />} />
    </Routes>
  );
};

export default App;
