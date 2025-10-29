import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check for auth error from interceptor
  useEffect(() => {
    const authError = localStorage.getItem('authError');
    if (authError) {
      setError(authError);
      localStorage.removeItem('authError');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-indigo-600 rounded-full">
            <Settings className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <div onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-center text-gray-600">
          <p>Demo credentials:</p>
          <p>Admin: admin / admin123</p>
          <p>User: user / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
