import apiClient from './api';

export const categoryService = {
  getAllCategories: async (page = 0, size = 10, sortBy = 'id', sortDir = 'desc', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await apiClient.get(`/categories?${params.toString()}`);
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  }
};
