import React, { useState, useEffect } from 'react';
import { roleService } from '../services/roleService';
import { Shield, Plus, Edit, Trash2, Users, X } from 'lucide-react';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [availableMenus, setAvailableMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    menuIds: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchAvailableMenus();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      setError('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMenus = async () => {
    try {
      const data = await roleService.getAvailableMenus();
      setAvailableMenus(data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      const menuIds = collectAllMenuIds(role.menus);
      setFormData({
        name: role.name,
        description: role.description || '',
        menuIds: menuIds
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        description: '',
        menuIds: []
      });
    }
    setError('');
    setShowModal(true);
  };

  const collectAllMenuIds = (menus) => {
    let ids = [];
    menus.forEach(menu => {
      ids.push(menu.id);
      if (menu.subMenus && menu.subMenus.length > 0) {
        ids = ids.concat(collectAllMenuIds(menu.subMenus));
      }
    });
    return ids;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({ name: '', description: '', menuIds: [] });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingRole) {
        await roleService.updateRole(editingRole.id, formData);
      } else {
        await roleService.createRole(formData);
      }
      fetchRoles();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save role');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete role "${name}"?`)) {
      try {
        await roleService.deleteRole(id);
        fetchRoles();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete role');
      }
    }
  };

  const handleMenuToggle = (menuId, subMenuIds = []) => {
    setFormData(prev => {
      const newMenuIds = [...prev.menuIds];
      const isSelected = newMenuIds.includes(menuId);

      if (isSelected) {
        // Remove menu and all its submenus
        return {
          ...prev,
          menuIds: newMenuIds.filter(id => 
            id !== menuId && !subMenuIds.includes(id)
          )
        };
      } else {
        // Add menu
        if (!newMenuIds.includes(menuId)) {
          newMenuIds.push(menuId);
        }
        return { ...prev, menuIds: newMenuIds };
      }
    });
  };

  const renderMenuCheckbox = (menu, level = 0) => {
    const isChecked = formData.menuIds.includes(menu.id);
    const subMenuIds = menu.subMenus ? collectAllMenuIds(menu.subMenus) : [];

    return (
      <div key={menu.id} style={{ marginLeft: `${level * 20}px` }}>
        <label className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleMenuToggle(menu.id, subMenuIds)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">{menu.name}</span>
        </label>
        {menu.subMenus && menu.subMenus.map(subMenu => 
          renderMenuCheckbox(subMenu, level + 1)
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Role Management</h1>
          <p className="mt-1 text-gray-600">Manage roles and their menu access permissions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div key={role.id} className="transition bg-white rounded-lg shadow hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
                    <Shield className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{role.name}</h3>
                    <p className="text-xs text-gray-500">{role.description || 'No description'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <Users size={16} />
                <span>{role.userCount || 0} user(s)</span>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-xs font-medium text-gray-700">Menu Access:</p>
                <div className="flex flex-wrap gap-1">
                  {role.menus && role.menus.length > 0 ? (
                    role.menus.slice(0, 3).map((menu) => (
                      <span key={menu.id} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                        {menu.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No menu access</span>
                  )}
                  {role.menus && role.menus.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                      +{role.menus.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleOpenModal(role)}
                  className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(role.id, role.name)}
                  className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {error && (
                <div className="p-3 mb-4 text-sm text-red-600 rounded-lg bg-red-50">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Manager, Supervisor"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description of this role"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Menu Access Permissions *
                  </label>
                  <div className="p-4 overflow-y-auto border border-gray-300 rounded-lg max-h-64 bg-gray-50">
                    {availableMenus.map(menu => renderMenuCheckbox(menu))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Select menus that this role can access
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;