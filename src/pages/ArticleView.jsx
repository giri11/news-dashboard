import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { ArrowLeft, Edit, Calendar, User, FolderOpen } from 'lucide-react';

const ArticleView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticleById(id);
      setArticle(data);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!article) {
    return <div className="p-6">Article not found</div>;
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/articles')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Articles
        </button>
        <button
          onClick={() => navigate(`/articles/edit/${article.id}`)}
          className="flex items-center gap-2 px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Edit size={18} />
          Edit Article
        </button>
      </div>

      <article className="overflow-hidden bg-white rounded-lg shadow">
        {/* Article Image */}
        {article.pathImage && (
          <div className="w-full bg-gray-100 h-96">
            <img 
              src={article.pathImage} 
              alt={article.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-sm text-indigo-800 bg-indigo-100 rounded-full">
              <FolderOpen size={16} />
              {article.categoryName}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 pb-6 mb-6 text-sm text-gray-600 border-b">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>By {article.createdByName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {article.updatedAt && article.updatedAt !== article.createdAt && (
              <div className="flex items-center gap-2">
                <Edit size={16} />
                <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-xl leading-relaxed text-gray-700">
              {article.description}
            </p>
          </div>

          {/* Content */}
          {article.content && (
            <div className="prose max-w-none">
              <div className="leading-relaxed text-gray-800 whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default ArticleView;