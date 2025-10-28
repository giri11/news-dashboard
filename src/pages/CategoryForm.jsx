import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { ArrowLeft, Save } from 'lucide-react';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategoryById(id);
      setFormData({
        name: data.name,
        description: data.description
      });
    } catch (error) {
      setError('Failed to load category data');
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

    setLoading(true);
    try {
      if (isEditMode) {
        await categoryService.updateCategory(id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      navigate('/categories');
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Categories
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit Category' : 'Add New Category'}
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
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Technology, Health, Business"
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
                  placeholder="Brief description of this category"
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 mt-8 border-t">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {loading ? 'Saving...' : (isEditMode ? 'Update Category' : 'Create Category')}
              </button>
              <button
                onClick={() => navigate('/categories')}
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

export default CategoryForm;