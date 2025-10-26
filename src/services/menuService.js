import apiClient from './api';

export const menuService = {
  getUserMenus: async () => {
    const response = await apiClient.get('/menus');
    return response.data;
  }
};