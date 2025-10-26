import apiClient from './api';

export const userService = {
  getAllUsers: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }
};