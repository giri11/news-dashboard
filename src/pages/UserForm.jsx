import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { roleService } from '../services/roleService';
import { ArrowLeft, Save } from 'lucide-react';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    roleIds: [],
    active: true
  });

  useEffect(() => {
    fetchRoles();
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchRoles = async () => {
    try {
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await userService.getUserById(id);
      
      // Get role IDs from role names
      const userRoleIds = roles
        .filter(role => data.roles.includes(role.name))
        .map(role => role.id);

      setFormData({
        username: data.username,
        password: '',
        confirmPassword: '',
        name: data.name,
        email: data.email,
        roleIds: userRoleIds,
        active: data.active
      });
    } catch (error) {
      setError('Failed to load user data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch user data when roles are loaded
  useEffect(() => {
    if (isEditMode && roles.length > 0) {
      fetchUser();
    }
  }, [roles.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleToggle = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isEditMode && !formData.password) {
      setError('Password is required for new users');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.roleIds.length === 0) {
      setError('Please select at least one role');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        roleIds: formData.roleIds,
        active: formData.active
      };

      // Only include password if it's provided
      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditMode) {
        await userService.updateUser(id, payload);
      } else {
        await userService.createUser(payload);
      }

      navigate('/users');
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Users
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit User' : 'Add New User'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password {!isEditMode && '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required={!isEditMode}
                />
                {isEditMode && (
                  <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                )}
              </div>

              {/* Confirm Password */}
              {formData.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
            </div>

            {/* Roles */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roles *
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.roleIds.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{role.name}</span>
                        {role.description && (
                          <p className="text-xs text-gray-500">{role.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Active User</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Inactive users cannot log in to the system
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
              </button>
              <button
                onClick={() => navigate('/users')}
                type="button"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;