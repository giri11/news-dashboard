import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Sorting state
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, pageSize, sortBy, sortDir, searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories(currentPage, pageSize, sortBy, sortDir, searchTerm);
      setCategories(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setDeleting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      fetchCategories();
      closeDeleteModal();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i + 1}
        </button>
      );
    }

    return pages;
  };

  if (loading && categories.length === 0) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
          <p className="mt-1 text-gray-600">Manage article categories</p>
        </div>
        <button
          onClick={() => navigate('/categories/add')}
          className="flex items-center gap-2 px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Search Section */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="flex justify-end gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by name or description..."
            className="px-4 py-2 border border-gray-300 rounded-lg w-96 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Search size={20} />
            Search
          </button>
        </div>
      </div>

      {/* DataTable */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('id')}
                  className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  ID {sortBy === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  Created By
                </th>
                <th 
                  onClick={() => handleSort('createdAt')}
                  className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                >
                  Created At {sortBy === 'createdAt' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.createdByName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/categories/edit/${category.id}`)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Edit category"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete category"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-700">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
            {renderPagination()}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="px-2 py-1 border border-gray-300 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Delete Category</h2>
              </div>
              <button onClick={closeDeleteModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete this category? This action cannot be undone.
              </p>
              
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <span className="text-sm text-gray-900">{categoryToDelete.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Description:</span>
                    <span className="text-sm text-gray-900">{categoryToDelete.description}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-6 py-2 font-medium text-white transition bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Category'}
              </button>
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
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

export default Categories;