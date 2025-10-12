// FILE: pages/AdminGalleryPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAlbum,
  getAllAlbums,
  getAlbumDetails,
  uploadPhotos,
  updateAlbum,
  deletePhoto,
  deleteAlbum,
  resetSelectedAlbum,
  clearError,
  clearSuccess,
} from '@/store/admin/gallery-slice';
import { X, Upload, Trash2, Eye, EyeOff, Plus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminGalleryPage = () => {
  const dispatch = useDispatch();
  const { albums, selectedAlbum, loading, error, success, pagination } = useSelector(
    (state) => state.adminGallery
  );

  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other',
    year: new Date().getFullYear(),
    tags: '',
  });

  useEffect(() => {
    dispatch(getAllAlbums({ page, limit: 12 }));
  }, [dispatch, page]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    dispatch(
      createAlbum({
        ...formData,
        year: parseInt(formData.year),
      })
    );
    setFormData({
      name: '',
      description: '',
      category: 'other',
      year: new Date().getFullYear(),
      tags: '',
    });
    setShowCreateModal(false);
  };

  const handleUploadPhotos = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    dispatch(uploadPhotos({ albumId: selectedAlbum.album._id, files: selectedFiles }));
    setSelectedFiles([]);
    setShowUploadModal(false);
  };

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    setSelectedFiles(Array.from(files));
  };

  const handlePublishToggle = (album) => {
    dispatch(
      updateAlbum({
        albumId: album._id,
        albumData: { isPublished: !album.isPublished },
      })
    );
  };

  const handleDeleteAlbum = (albumId) => {
    if (window.confirm('Are you sure you want to delete this album and all its photos?')) {
      dispatch(deleteAlbum(albumId));
    }
  };

  const handleDeletePhoto = (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      dispatch(deletePhoto(photoId));
    }
  };

  const handleAlbumClick = (albumId) => {
    dispatch(getAlbumDetails(albumId));
  };

  const handleBackToList = () => {
    dispatch(resetSelectedAlbum());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Album Management</h1>
          <p className="text-purple-100 mt-1">Create and manage alumni gallery albums</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
            <span>Operation completed successfully!</span>
            <button
              onClick={() => dispatch(clearSuccess())}
              className="text-green-700 hover:text-green-900"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-700 hover:text-red-900"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {!selectedAlbum ? (
          <>
            {/* Albums List View */}
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Your Albums</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
              >
                <Plus size={20} />
                Create Album
              </button>
            </div>

            {loading && albums.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading albums...</p>
                </div>
              </div>
            ) : albums.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg mb-4">No albums created yet</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Create Your First Album
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <div key={album._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="relative h-40 bg-gray-200">
                      {album.coverImage ? (
                        <img
                          src={album.coverImage}
                          alt={album.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-300">
                          <span className="text-gray-500">No Cover Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            album.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {album.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                        {album.name}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {album.category.replace(/_/g, ' ')} • {album.year}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {album.photoCount} photos
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAlbumClick(album._id)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handlePublishToggle(album)}
                          className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition flex items-center justify-center gap-1"
                        >
                          {album.isPublished ? (
                            <>
                              <EyeOff size={16} />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye size={16} />
                              Publish
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteAlbum(album._id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                <span className="text-gray-700 font-medium">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Album Detail View */}
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Albums
            </button>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedAlbum.album.name}
                  </h2>
                  <p className="text-gray-600">{selectedAlbum.album.description}</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  <Upload size={20} />
                  Upload Photos
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Category</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedAlbum.album.category.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Year</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedAlbum.album.year}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Photos</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedAlbum.album.photoCount}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    handlePublishToggle(selectedAlbum.album)
                  }
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                    selectedAlbum.album.isPublished
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  {selectedAlbum.album.isPublished ? (
                    <>
                      <Eye size={18} />
                      Published
                    </>
                  ) : (
                    <>
                      <EyeOff size={18} />
                      Draft
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteAlbum(selectedAlbum.album._id)}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                >
                  <Trash2 size={18} />
                  Delete Album
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Photos ({selectedAlbum.photos.length})
              </h3>

              {selectedAlbum.photos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No photos uploaded yet</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Upload Photos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedAlbum.photos.map((photo) => (
                    <div key={photo._id} className="relative group">
                      <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={photo.thumbnail || photo.cloudinaryUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                          <button
                            onClick={() => handleDeletePhoto(photo._id)}
                            className="opacity-0 group-hover:opacity-100 transition bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      {photo.title && (
                        <p className="mt-2 text-sm text-gray-700 truncate">{photo.title}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Album Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Create New Album</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Album Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="convocation">Convocation</option>
                  <option value="reunion">Reunion</option>
                  <option value="events">Events</option>
                  <option value="campus_life">Campus Life</option>
                  <option value="sports">Sports</option>
                  <option value="cultural">Cultural</option>
                  <option value="academic">Academic</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g., batch-2020, sports, fun"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Photos Modal */}
      {showUploadModal && selectedAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Upload Photos</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUploadPhotos} className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload size={32} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-700 font-medium mb-1">
                  Drag and drop photos here
                </p>
                <p className="text-gray-500 text-sm mb-4">or</p>
                <label className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition inline-block">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected: {selectedFiles.length} file(s)
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {Array.from(selectedFiles).map((file, idx) => (
                      <p key={idx} className="text-xs text-gray-600 truncate">
                        ✓ {file.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedFiles.length === 0 || loading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition font-medium"
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryPage;