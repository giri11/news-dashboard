import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mb-4 font-bold text-indigo-600 text-9xl">404</div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Page Not Found</h1>
          <p className="text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="p-8 mb-6 bg-white rounded-lg shadow-lg">
          <svg
            className="w-48 h-48 mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="#4F46E5"
              opacity="0.3"
            />
            <path
              d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm1 13h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="#4F46E5"
            />
          </svg>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Home size={20} />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;