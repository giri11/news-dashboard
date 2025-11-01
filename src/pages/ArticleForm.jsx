import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { categoryService } from '../services/categoryService';
import { fileService } from '../services/fileService';
import { ArrowLeft, Save, Image, Upload, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ArticleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    content: '',
    pathImage: ''
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchArticle();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
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

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await fileService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        pathImage: response.url
      }));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      pathImage: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmPublish = async () => {
    setLoading(true);
    setShowConfirmModal(false);

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
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'publish'} article`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Main Content */}
              <div className="space-y-6 lg:col-span-2">
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

                {/* Rich Text Editor for Content */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <div className="overflow-hidden border border-gray-300 rounded-lg">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={handleContentChange}
                      modules={modules}
                      formats={formats}
                      placeholder="Write something awesome..."
                      className="bg-white"
                      style={{ height: '400px', marginBottom: '42px' }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Use the toolbar above to format your article content
                  </p>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Category */}
                <div className="p-4 rounded-lg bg-gray-50">
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
                    <p className="mt-2 text-xs text-amber-600">
                      No categories available. Please create a category first.
                    </p>
                  )}
                </div>

                {/* Featured Image Upload */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Featured Image
                  </label>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {!formData.pathImage ? (
                    <button
                      type="button"
                      onClick={handleImageSelect}
                      disabled={uploading}
                      className="flex flex-col items-center justify-center w-full p-6 transition border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Upload className="text-indigo-600 animate-bounce" size={40} />
                          <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Image className="text-gray-400" size={40} />
                          <p className="mt-2 text-sm text-gray-600">Click to upload image</p>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="relative">
                      <img 
                        src={fileService.getImageUrl(formData.pathImage)} 
                        alt="Preview" 
                        className="w-full border border-gray-300 rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute p-2 text-white transition bg-red-500 rounded-full shadow-lg top-2 right-2 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={handleImageSelect}
                        className="w-full px-4 py-2 mt-2 text-sm text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        Change Image
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 space-y-3 rounded-lg bg-gray-50">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || categories.length === 0 || uploading}
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    {loading ? 'Saving...' : (isEditMode ? 'Update Article' : 'Publish Article')}
                  </button>
                  <button
                    onClick={() => navigate('/articles')}
                    type="button"
                    className="w-full px-6 py-3 font-medium text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
                  <Save className="text-indigo-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditMode ? 'Update Article' : 'Publish Article'}
                </h2>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="mb-4 text-gray-600">
                {isEditMode 
                  ? 'Are you sure you want to update this article? Your changes will be saved.'
                  : 'Are you sure you want to publish this article? It will be visible to everyone.'}
              </p>
              
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Title:</span>
                    <span className="text-sm text-gray-900">{formData.title || 'Untitled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Category:</span>
                    <span className="text-sm text-gray-900">
                      {categories.find(c => c.id === Number(formData.categoryId))?.name || 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={confirmPublish}
                disabled={loading}
                className="flex-1 px-6 py-2 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isEditMode ? 'Yes, Update' : 'Yes, Publish')}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
                className="flex-1 px-6 py-2 font-medium text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
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

export default ArticleForm;