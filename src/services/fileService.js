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

  deleteImage: async (fileUrl) => {
    const response = await apiClient.delete('/files/delete', {
      params: { url: fileUrl }
    });
    return response.data;
  },

  getImageUrl: (path) => {
    if (!path) return null;
    // R2 returns full URLs, so just return it directly
    return path;
  }
};