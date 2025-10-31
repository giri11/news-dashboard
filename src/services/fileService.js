import apiClient from './api';

export const fileService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (filename) => {
    const response = await apiClient.delete(`/files/images/${filename}`);
    return response.data;
  },

  getImageUrl: (path) => {
    if (!path) return null;
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;
    // If it's a relative path from our API, prepend the base URL
    return `http://localhost:8080${path}`;
  }
};