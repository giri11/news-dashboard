import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // ← ADD THIS
import { userService } from '../services/userService';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const handleDelete = async (id, name) => {
  if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  }
};

  // THEN THE FUNCTIONS
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers(currentPage, pageSize, sortBy, sortDir, searchTerm);
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

    // THEN useEffect
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, sortBy, sortDir, searchTerm]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => navigate('/users/add')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            { users && users.length > 0 ? (
              users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  {Array.from(user.roles).map((role, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs mr-1">
                      {role}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
