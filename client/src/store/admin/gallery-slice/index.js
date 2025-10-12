// FILE: store/slices/adminGallerySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createAlbum = createAsyncThunk(
  'adminGallery/createAlbum',
  async (albumData, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const response = await axios.post(`${API_URL}/admin/gallery/create-album`, albumData, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create album');
    }
  }
);

export const getAllAlbums = createAsyncThunk(
  'adminGallery/getAllAlbums',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/gallery/albums`, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch albums');
    }
  }
);

export const getAlbumDetails = createAsyncThunk(
  'adminGallery/getAlbumDetails',
  async (albumId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/gallery/album/${albumId}`, {withCredentials: true});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch album details');
    }
  }
);

export const uploadPhotos = createAsyncThunk(
  'adminGallery/uploadPhotos',
  async ({ albumId, files }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));

      const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
      const response = await axios.post(
        `${API_URL}/admin/gallery/upload-photos/${albumId}`,
        formData,
        config
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload photos');
    }
  }
);

export const updateAlbum = createAsyncThunk(
  'adminGallery/updateAlbum',
  async ({ albumId, albumData }, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const response = await axios.put(
        `${API_URL}/admin/gallery/album/${albumId}`,
        albumData,
        config
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update album');
    }
  }
);

export const deletePhoto = createAsyncThunk(
  'adminGallery/deletePhoto',
  async (photoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/gallery/photo/${photoId}`, {withCredentials: true});
      return photoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete photo');
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  'adminGallery/deleteAlbum',
  async (albumId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/gallery/album/${albumId}`, {withCredentials: true});
      return albumId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete album');
    }
  }
);

export const reorderPhotos = createAsyncThunk(
  'adminGallery/reorderPhotos',
  async (photoOrder, { rejectWithValue }) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const response = await axios.put(
        `${API_URL}/admin/gallery/reorder-photos`,
        { photoOrder },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reorder photos');
    }
  }
);

const initialState = {
  albums: [],
  selectedAlbum: null,
  loading: false,
  error: null,
  success: false,
  pagination: { total: 0, page: 1, pages: 0 },
  uploadProgress: 0,
};

const adminGallerySlice = createSlice({
  name: 'adminGallery',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetSelectedAlbum: (state) => {
      state.selectedAlbum = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.albums.unshift(action.payload);
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAlbumDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlbumDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAlbum = action.payload;
      })
      .addCase(getAlbumDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.uploadProgress = 100;
        if (state.selectedAlbum) {
          state.selectedAlbum.photos = [...(state.selectedAlbum.photos || []), ...action.payload];
        }
      })
      .addCase(uploadPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.albums.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.albums[index] = action.payload;
        }
        if (state.selectedAlbum?._id === action.payload._id) {
          state.selectedAlbum = action.payload;
        }
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.selectedAlbum) {
          state.selectedAlbum.photos = state.selectedAlbum.photos.filter(
            (p) => p._id !== action.payload
          );
        }
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.albums = state.albums.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reorderPhotos.pending, (state) => {
        state.loading = true;
      })
      .addCase(reorderPhotos.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(reorderPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetSelectedAlbum } = adminGallerySlice.actions;
export default adminGallerySlice.reducer;
