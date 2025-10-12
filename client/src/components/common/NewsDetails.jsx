// pages/NewsDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {
  deleteNews,
  getNewsById as getAdminNews,
  updateNews,
} from '@/store/admin/news-slice';
import {
  getNewsBySlug,
  getRelatedNews,
} from '@/store/user/news-slice';
import {
  ArrowLeft,
  Edit2,
  Check,
  X,
  Loader2,
  Calendar,
  Eye,
  Clock,
  User,
  Tag,
  Download,
  Pin,
  Save,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

function NewsDetailsPage() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Use appropriate slice based on role
  const adminNews = useSelector((state) => state.adminNews);
  const alumniNews = useSelector((state) => state.userNews);

  const news = isAdmin ? adminNews.currentNews : alumniNews.currentNews;
  const relatedNews = alumniNews.relatedNews;
  const isLoading = isAdmin ? adminNews.isLoading : alumniNews.isLoading;

  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isAdmin) {
      // Admin uses ID parameter
      if (id) {
        console.log('Loading admin news with ID:', id);
        dispatch(getAdminNews(id));
      }
    } else {
      // Alumni uses slug parameter
      if (slug) {
        console.log('Loading alumni news with slug:', slug);
        dispatch(getNewsBySlug(slug));
      }
    }
  }, [id, slug, dispatch, isAdmin]);

  useEffect(() => {
    if (news?._id) {
      dispatch(getRelatedNews({ id: news._id, limit: 3 }));
    }
  }, [dispatch, news?._id]);

  const getCategoryBadgeColor = (category) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      events: 'bg-blue-100 text-blue-800',
      achievements: 'bg-green-100 text-green-800',
      placements: 'bg-purple-100 text-purple-800',
      research: 'bg-amber-100 text-amber-800',
      'alumni-stories': 'bg-pink-100 text-pink-800',
      announcements: 'bg-red-100 text-red-800',
      others: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
  };

  const getStatusBadge = (status) => {
    const configs = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={configs[status] || configs.draft}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEditField = (field) => {
    setEditMode({ ...editMode, [field]: true });
    setEditValues({ ...editValues, [field]: news[field] });
  };

  const handleSaveField = async (field) => {
    setIsUpdating(true);
    try {
      const updateData = { [field]: editValues[field] };
      await dispatch(updateNews({
        id: news._id,
        newsData: updateData,
      }));
      setEditMode({ ...editMode, [field]: false });
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = (field) => {
    setEditMode({ ...editMode, [field]: false });
    setEditValues({ ...editValues, [field]: news[field] });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editValues.tags.includes(tagInput.trim())) {
      setEditValues((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditValues((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSaveTags = async () => {
    setIsUpdating(true);
    try {
      await dispatch(updateNews({
        id: news._id,
        newsData: { tags: editValues.tags },
      }));
      setEditMode({ ...editMode, tags: false });
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePublish = async () => {
    setIsUpdating(true);
    try {
      await dispatch(updateNews({
        id: news._id,
        newsData: { status: 'published' },
      }));
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnpublish = async () => {
    setIsUpdating(true);
    try {
      await dispatch(updateNews({
        id: news._id,
        newsData: { status: 'draft' },
      }));
    } catch (error) {
      console.error('Unpublish failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePin = async () => {
    setIsUpdating(true);
    try {
      await dispatch(updateNews({
        id: news._id,
        newsData: { isPinned: !news.isPinned },
      }));
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 mb-4">News article not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const EditableField = ({
    field,
    value,
    multiline = false,
    type = 'text',
  }) => {
    if (!isAdmin) {
      return <span>{value}</span>;
    }

    if (editMode[field]) {
      return (
        <div className="flex items-start gap-2 w-full">
          {multiline ? (
            <textarea
              className="flex-1 px-3 py-2 border rounded-md"
              rows={6}
              value={editValues[field] ?? value}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              autoFocus
            />
          ) : (
            <Input
              type={type}
              value={editValues[field] ?? value}
              onChange={(e) =>
                setEditValues((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="flex-1"
              autoFocus
            />
          )}
          <Button
            size="sm"
            onClick={() => handleSaveField(field)}
            className="bg-green-600 hover:bg-green-700 flex-shrink-0"
            disabled={isUpdating}
          >
            <Check size={16} />
          </Button>
          <Button
            size="sm"
            onClick={() => handleCancelEdit(field)}
            className="bg-gray-200 hover:bg-gray-300 flex-shrink-0"
            disabled={isUpdating}
          >
            <X size={16} />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span>{value}</span>
        {isAdmin && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditField(field)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 size={14} />
          </Button>
        )}
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Cover Image */}
      {news.coverImage && (
        <div className="w-full h-96 overflow-hidden bg-gray-900">
          <img
            src={news.coverImage}
            alt={news.title}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Status and Settings (Admin Only) */}
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              {getStatusBadge(news.status)}
              <div className="flex gap-2">
                {news.status === 'draft' ? (
                  <Button
                    onClick={handlePublish}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Publish
                  </Button>
                ) : (
                  <Button
                    onClick={handleUnpublish}
                    disabled={isUpdating}
                    className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    Unpublish
                  </Button>
                )}
              </div>
              <Button
                onClick={handleTogglePin}
                disabled={isUpdating}
                className={`flex items-center gap-2 ${
                  news.isPinned
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Pin className="w-4 h-4" />
                )}
                {news.isPinned ? 'Pinned' : 'Pin'}
              </Button>
              <Button
                onClick={() => setShowDeleteModal(true)}
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getCategoryBadgeColor(news.category)}`}>
              {news.categoryInfo?.label || news.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            <EditableField field="title" value={news.title} />
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                {news.author.firstName} {news.author.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{news.viewCount} views</span>
            </div>
          </div>

          {/* Description (Markdown) */}
          <div className="mb-8 relative">
            <div className="absolute top-0 right-0">
              {isAdmin && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditField('description')}
                  className="opacity-100 hover:opacity-100"
                >
                  <Edit2 size={14} />
                </Button>
              )}
            </div>

            {isAdmin && editMode.description ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Markdown Editor
                    </label>
                    <textarea
                      className="flex-1 px-3 py-2 border rounded-md font-mono text-sm w-full"
                      rows={15}
                      value={editValues.description ?? news.description}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="# Heading 1&#10;## Heading 2&#10;- List item&#10;**bold text**"
                      autoFocus
                    />
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="border rounded-md p-4 bg-gray-50 overflow-y-auto h-96 prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-2">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-2">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          code: ({ inline, children }) =>
                            inline ? (
                              <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono overflow-x-auto my-2">
                                {children}
                              </code>
                            ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">
                              {children}
                            </blockquote>
                          ),
                          a: ({ href, children }) => (
                            <a href={href} className="text-blue-600 hover:underline">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {editValues.description ?? news.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => handleSaveField('description')}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    <Check size={16} className="mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => handleCancelEdit('description')}
                    className="bg-gray-200 hover:bg-gray-300"
                    disabled={isUpdating}
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold mt-5 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-2">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-gray-900 text-gray-100 p-4 rounded text-sm font-mono overflow-x-auto my-4">
                          {children}
                        </code>
                      ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} className="text-blue-600 hover:underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {news.description}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-8 relative">
            <div className="absolute -top-8 right-0">
              {isAdmin && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditMode({ ...editMode, tags: true });
                    setEditValues({ ...editValues, tags: news.tags || [] });
                  }}
                  className="opacity-100 hover:opacity-100"
                >
                  <Edit2 size={14} />
                </Button>
              )}
            </div>

            {isAdmin && editMode.tags ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                    }
                    placeholder="Add tag..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddTag}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {editValues.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-gray-200 text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>

                <Button
                  onClick={handleSaveTags}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Tags
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {news.tags && news.tags.length > 0 ? (
                  news.tags.map((tag) => (
                    <Badge key={tag} className="bg-gray-100 text-gray-700">
                      #{tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No tags added</p>
                )}
              </div>
            )}
          </div>

          {/* Attachments */}
          {news.attachments && news.attachments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Attachments
              </h2>
              <div className="space-y-3">
                {news.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {attachment.fileName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {attachment.fileType} •{' '}
                          {formatFileSize(attachment.fileSize)}
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related News (Alumni Only) */}
        {!isAdmin && relatedNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((relatedItem) => (
                <div
                  key={relatedItem._id}
                  onClick={() => navigate(`/news/${relatedItem.slug}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                >
                  {relatedItem.coverImage && (
                    <img
                      src={relatedItem.coverImage}
                      alt={relatedItem.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(
                        relatedItem.category
                      )}`}
                    >
                      {relatedItem.categoryInfo?.label || relatedItem.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2">
                      {relatedItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedItem.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                      <span>{formatDate(relatedItem.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creator Info */}
        {news.createdBy && (
          <div className="bg-white rounded-lg shadow p-4 text-sm text-gray-600">
            Created by{' '}
            <span className="font-medium">
              {news.createdBy.firstName} {news.createdBy.lastName}
            </span>{' '}
            on {formatDate(news.createdAt)}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete News Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this news article? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-700 font-medium">{news.title}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => setShowDeleteModal(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                // Implement delete action
                dispatch(deleteNews(news._id));
                setShowDeleteModal(false);
                navigate('/admin/news');
              }}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Deleting...
                </>
              ) : (
                'Delete News'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewsDetailsPage;