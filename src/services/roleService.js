import apiClient from './api';

export const roleService = {
  getAllRoles: async () => {
    const response = await apiClient.get('/roles');
    return response.data;
  },

  getRoleById: async (id) => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  createRole: async (roleData) => {
    const response = await apiClient.post('/roles', roleData);
    return response.data;
  },

  updateRole: async (id, roleData) => {
    const response = await apiClient.put(`/roles/${id}`, roleData);
    return response.data;
  },

  deleteRole: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  },

  getAvailableMenus: async () => {
    const response = await apiClient.get('/roles/available-menus');
    return response.data;
  }
};