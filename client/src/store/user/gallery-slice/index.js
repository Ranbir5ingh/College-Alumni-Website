// FILE: store/slices/alumniGallerySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getPublishedAlbums = createAsyncThunk(
  'alumniGallery/getPublishedAlbums',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/gallery/albums`, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch albums');
    }
  }
);

export const getAlbumWithPhotos = createAsyncThunk(
  'alumniGallery/getAlbumWithPhotos',
  async ({ albumId, params }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/gallery/album/${albumId}`, { params, withCredentials: true });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch album');
    }
  }
);

export const searchGallery = createAsyncThunk(
  'alumniGallery/searchGallery',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/gallery/search`, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search');
    }
  }
);

export const getCategories = createAsyncThunk(
  'alumniGallery/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/gallery/categories`, {withCredentials: true});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const getYears = createAsyncThunk(
  'alumniGallery/getYears',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/gallery/years`, {withCredentials: true});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch years');
    }
  }
);

const initialState = {
  albums: [],
  selectedAlbum: null,
  categories: [],
  years: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, pages: 0 },
  filters: {
    category: 'all',
    year: 'all',
    searchQuery: '',
  },
};

const alumniGallerySlice = createSlice({
  name: 'alumniGallery',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { category: 'all', year: 'all', searchQuery: '' };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSelectedAlbum: (state) => {
      state.selectedAlbum = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPublishedAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublishedAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getPublishedAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAlbumWithPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlbumWithPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAlbum = action.payload;
      })
      .addCase(getAlbumWithPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getYears.pending, (state) => {
        state.loading = true;
      })
      .addCase(getYears.fulfilled, (state, action) => {
        state.loading = false;
        state.years = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, resetSelectedAlbum } = alumniGallerySlice.actions;
export default alumniGallerySlice.reducer;