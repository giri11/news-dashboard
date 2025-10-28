import apiClient from './api';

export const articleService = {
  getAllArticles: async (page = 0, size = 10, sortBy = 'id', sortDir = 'desc', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await apiClient.get(`/articles?${params.toString()}`);
    return response.data;
  },

  getArticleById: async (id) => {
    const response = await apiClient.get(`/articles/${id}`);
    return response.data;
  },

  createArticle: async (articleData) => {
    const response = await apiClient.post('/articles', articleData);
    return response.data;
  },

  updateArticle: async (id, articleData) => {
    const response = await apiClient.put(`/articles/${id}`, articleData);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await apiClient.delete(`/articles/${id}`);
    return response.data;
  }
};
