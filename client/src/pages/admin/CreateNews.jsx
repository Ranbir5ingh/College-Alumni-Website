// pages/admin/NewsFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createNews,
  updateNews,
  getNewsById,
  clearCurrentNews,
  clearError,
  clearSuccess,
} from '@/store/admin/news-slice';
import { ArrowLeft, Save, Eye, Upload, X, FileText } from 'lucide-react';
// Import your markdown editor library
// import MdEditor from 'react-markdown-editor-lite';
// import MarkdownIt from 'markdown-it';
// import 'react-markdown-editor-lite/lib/index.css';

// const mdParser = new MarkdownIt();

const NewsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentNews, isLoading, error, success } = useSelector(
    (state) => state.adminNews
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    excerpt: '',
    coverImage: '',
    category: 'general',
    tags: [],
    status: 'draft',
    isPinned: false,
    attachments: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getNewsById(id));
    }
    
    return () => {
      dispatch(clearCurrentNews());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentNews && id) {
      setFormData({
        title: currentNews.title || '',
        description: currentNews.description || '',
        excerpt: currentNews.excerpt || '',
        coverImage: currentNews.coverImage || '',
        category: currentNews.category || 'general',
        tags: currentNews.tags || [],
        status: currentNews.status || 'draft',
        isPinned: currentNews.isPinned || false,
        attachments: currentNews.attachments || [],
      });
    }
  }, [currentNews, id]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/admin/news');
      }, 2000);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddAttachment = () => {
    // This would open a file upload dialog in real implementation
    const newAttachment = {
      fileName: 'sample.pdf',
      fileUrl: 'https://example.com/sample.pdf',
      fileSize: 1024000,
      fileType: 'application/pdf',
    };
    
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment],
    }));
  };

  const handleRemoveAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    
    if (formData.excerpt && formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt cannot exceed 300 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (id) {
      await dispatch(updateNews({ id, newsData: formData }));
    } else {
      await dispatch(createNews(formData));
    }
  };

  const handleSaveAsDraft = async () => {
    setFormData((prev) => ({ ...prev, status: 'draft' }));
    
    setTimeout(() => {
      if (validateForm()) {
        if (id) {
          dispatch(updateNews({ id, newsData: { ...formData, status: 'draft' } }));
        } else {
          dispatch(createNews({ ...formData, status: 'draft' }));
        }
      }
    }, 0);
  };

  const handlePublish = async () => {
    setFormData((prev) => ({ ...prev, status: 'published' }));
    
    setTimeout(() => {
      if (validateForm()) {
        if (id) {
          dispatch(updateNews({ id, newsData: { ...formData, status: 'published' } }));
        } else {
          dispatch(createNews({ ...formData, status: 'published' }));
        }
      }
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/news')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? 'Edit News' : 'Create News'}
              </h1>
              <p className="text-gray-600">
                {id ? 'Update existing news article' : 'Create a new news article'}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => dispatch(clearError())} className="text-red-700">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter news title..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Brief summary of the news..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.excerpt ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {formData.excerpt.length}/300 characters
                </p>
              </div>

              {/* Description (Markdown Editor) */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                
                {/* Replace this textarea with MdEditor component when you have it installed */}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="15"
                  placeholder="Write your news content in markdown format..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                
                {/* Uncomment when using MdEditor */}
                {/* <MdEditor
                  value={formData.description}
                  style={{ height: '500px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={({ text }) => handleDescriptionChange(text)}
                /> */}
                
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Supports Markdown formatting (headings, lists, links, etc.)
                </p>
              </div>

              {/* Attachments */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Attachments
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </button>
                </div>
                
                {formData.attachments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No attachments added</p>
                ) : (
                  <div className="space-y-2">
                    {formData.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {attachment.fileType} •{' '}
                              {(attachment.fileSize / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleSaveAsDraft}
                    disabled={isLoading}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </button>
                  
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Publish
                  </button>
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.coverImage && (
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="mt-3 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="events">Events</option>
                  <option value="achievements">Achievements</option>
                  <option value="placements">Placements</option>
                  <option value="research">Research</option>
                  <option value="alumni-stories">Alumni Stories</option>
                  <option value="announcements">Announcements</option>
                  <option value="others">Others</option>
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPinned"
                    checked={formData.isPinned}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Pin this news</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsFormPage;