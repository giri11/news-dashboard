import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { categoryService } from '../services/categoryService';
import { ArrowLeft, Save, Image } from 'lucide-react';

const ArticleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    content: '',
    pathImage: ''
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      // Fetch all categories without pagination for dropdown
      const data = await categoryService.getAllCategories(0, 1000, 'name', 'asc', '');
      setCategories(data.content);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticleById(id);
      setFormData({
        categoryId: data.categoryId || '',
        title: data.title || '',
        description: data.description || '',
        content: data.content || '',
        pathImage: data.pathImage || ''
      });
    } catch (error) {
      setError('Failed to load article data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        categoryId: Number(formData.categoryId),
        title: formData.title,
        description: formData.description,
        content: formData.content,
        pathImage: formData.pathImage
      };

      if (isEditMode) {
        await articleService.updateArticle(id, payload);
      } else {
        await articleService.createArticle(payload);
      }
      navigate('/articles');
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} article`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/articles')}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Articles
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit Article' : 'Add New Article'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 rounded-lg bg-red-50">
              {error}
            </div>
          )}

          <div onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No categories available. Please create a category first.
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter article title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief description of the article"
                  rows="3"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Full article content..."
                  rows="12"
                />
                <p className="mt-1 text-xs text-gray-500">
                  You can use this field for the full article content
                </p>
              </div>

              {/* Image Path */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="pathImage"
                    value={formData.pathImage}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                    title="Upload image"
                  >
                    <Image size={20} />
                  </button>
                </div>
                {formData.pathImage && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs text-gray-500">Image Preview:</p>
                    <img 
                      src={formData.pathImage} 
                      alt="Preview" 
                      className="max-w-xs border border-gray-300 rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 mt-8 border-t">
              <button
                onClick={handleSubmit}
                disabled={loading || categories.length === 0}
                className="flex items-center gap-2 px-6 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {loading ? 'Saving...' : (isEditMode ? 'Update Article' : 'Create Article')}
              </button>
              <button
                onClick={() => navigate('/articles')}
                type="button"
                className="px-6 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
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

export default ArticleForm;