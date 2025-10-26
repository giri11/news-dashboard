import React from 'react';
import { useAuth } from '../context/AuthContext';
import MenuItem from './MenuItem';
import { LogOut } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { user, menus, logout } = useAuth();

  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden flex flex-col`}>
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
        <p className="text-sm text-gray-600">{user?.name}</p>
      </div>
      
      <nav className="mt-4 flex-1 overflow-y-auto">
        {menus.map((menu) => (
          <MenuItem key={menu.id} item={menu} />
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;