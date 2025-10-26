import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <header className="p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-800"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-2 transition rounded-lg hover:bg-gray-50"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.roles?.join(', ')}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-indigo-600 rounded-full">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 z-50 w-56 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => handleMenuClick('/profile')}
                  className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <User size={18} />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => handleMenuClick('/settings/profile')}
                  className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <Settings size={18} />
                  <span>Account Settings</span>
                </button>
              </div>

              {/* Logout Section */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;