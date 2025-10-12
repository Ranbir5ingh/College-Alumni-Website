// FILE: pages/AlumniGalleryPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  getPublishedAlbums,
  getAlbumWithPhotos,
  searchGallery,
  getCategories,
  getYears,
  setFilters,
  clearFilters,
} from '@/store/user/gallery-slice';
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const AlumniGalleryPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [photoPage, setPhotoPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const {
    albums,
    selectedAlbum,
    categories,
    years,
    loading,
    error,
    pagination,
    filters,
  } = useSelector((state) => state.userGallery);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getYears());
  }, [dispatch]);

  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const year = searchParams.get('year') || 'all';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');

    dispatch(setFilters({ category, year, searchQuery: search }));
    setSearchInput(search);

    const params = {
      page,
      limit: 12,
      ...(category !== 'all' && { category }),
      ...(year !== 'all' && { year }),
    };

    if (search) {
      dispatch(searchGallery({ ...params, query: search }));
    } else {
      dispatch(getPublishedAlbums(params));
    }
  }, [searchParams, dispatch]);

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(filterType, value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleAlbumClick = (albumId) => {
    dispatch(getAlbumWithPhotos({ albumId, params: { page: 1, limit: 20 } }));
    setSelectedAlbumId(albumId);
    setPhotoPage(1);
  };

  const handleLoadMorePhotos = () => {
    if (selectedAlbum && selectedAlbumId) {
      dispatch(
        getAlbumWithPhotos({
          albumId: selectedAlbumId,
          params: { page: photoPage + 1, limit: 20 },
        })
      );
      setPhotoPage(photoPage + 1);
    }
  };

  const handlePagination = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams('');
    setSearchInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Alumni Gallery</h1>
          <p className="text-blue-100">Browse memories and moments from our alumni community</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search albums..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <button
            onClick={handleClearFilters}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Albums Grid */}
        <div>
          {loading && albums.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading albums...</p>
              </div>
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No albums found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album) => (
                <div
                  key={album._id}
                  onClick={() => handleAlbumClick(album._id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden cursor-pointer transition transform hover:scale-105"
                >
                  <div className="relative h-48 bg-gray-200">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage}
                        alt={album.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-300">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition flex items-center justify-center">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg opacity-0 hover:opacity-100 transition">
                        View Album
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                      {album.name}
                    </h3>
                    <p className="text-sm text-blue-600 mb-1">
                      {album.category.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{album.year}</p>
                    <p className="text-sm text-gray-600">
                      {album.photoCount} {album.photoCount === 1 ? 'photo' : 'photos'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={pagination.page === 1}
              onClick={() => handlePagination(pagination.page - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePagination(pagination.page + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedAlbumId && selectedAlbum && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAlbumId(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedAlbum.album.name}</h2>
              <button
                onClick={() => setSelectedAlbumId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {selectedAlbum.album.description && (
                <p className="text-gray-600 mb-6">{selectedAlbum.album.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {selectedAlbum.photos.map((photo) => (
                  <div key={photo._id} className="group cursor-pointer">
                    <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={photo.thumbnail || photo.cloudinaryUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                    {photo.title && (
                      <p className="mt-2 text-sm text-gray-700 truncate">{photo.title}</p>
                    )}
                  </div>
                ))}
              </div>

              {selectedAlbum.pagination.page < selectedAlbum.pagination.pages && (
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMorePhotos}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                  >
                    {loading ? 'Loading...' : 'Load More Photos'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniGalleryPage;

