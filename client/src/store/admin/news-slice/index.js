// store/admin/adminNewsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/news";

// Create news
export const createNews = createAsyncThunk(
  "adminNews/createNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, newsData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create news"
      );
    }
  }
);

// Get all news
export const getAllNews = createAsyncThunk(
  "adminNews/getAllNews",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}?${queryString}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news"
      );
    }
  }
);

// Get news by ID
export const getNewsById = createAsyncThunk(
  "adminNews/getNewsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news"
      );
    }
  }
);

// Update news
export const updateNews = createAsyncThunk(
  "adminNews/updateNews",
  async ({ id, newsData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, newsData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update news"
      );
    }
  }
);

// Delete news
export const deleteNews = createAsyncThunk(
  "adminNews/deleteNews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete news"
      );
    }
  }
);

// Publish news
export const publishNews = createAsyncThunk(
  "adminNews/publishNews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/publish`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to publish news"
      );
    }
  }
);

// Unpublish news
export const unpublishNews = createAsyncThunk(
  "adminNews/unpublishNews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/unpublish`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unpublish news"
      );
    }
  }
);

// Toggle pin
export const togglePinNews = createAsyncThunk(
  "adminNews/togglePinNews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/toggle-pin`, { withCredentials: true });
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle pin"
      );
    }
  }
);

// Get statistics
export const getNewsStatistics = createAsyncThunk(
  "adminNews/getNewsStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/statistics`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
);

const adminNewsSlice = createSlice({
  name: "adminNews",
  initialState: {
    newsList: [],
    currentNews: null,
    statistics: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalNews: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentNews: (state) => {
      state.currentNews = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create news
      .addCase(createNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
        state.newsList.unshift(action.payload.data);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get all news
      .addCase(getAllNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get news by ID
      .addCase(getNewsById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNewsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentNews = action.payload.data;
      })
      .addCase(getNewsById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update news
      .addCase(updateNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
        state.currentNews = action.payload.data;
        const index = state.newsList.findIndex(
          (news) => news._id === action.payload.data._id
        );
        if (index !== -1) {
          state.newsList[index] = action.payload.data;
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete news
      .addCase(deleteNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
        state.newsList = state.newsList.filter(
          (news) => news._id !== action.payload.id
        );
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Publish news
      .addCase(publishNews.fulfilled, (state, action) => {
        state.success = action.payload.message;
        const index = state.newsList.findIndex(
          (news) => news._id === action.payload.data._id
        );
        if (index !== -1) {
          state.newsList[index] = action.payload.data;
        }
      })

      // Unpublish news
      .addCase(unpublishNews.fulfilled, (state, action) => {
        state.success = action.payload.message;
        const index = state.newsList.findIndex(
          (news) => news._id === action.payload.data._id
        );
        if (index !== -1) {
          state.newsList[index] = action.payload.data;
        }
      })

      // Toggle pin
      .addCase(togglePinNews.fulfilled, (state, action) => {
        state.success = action.payload.message;
        const index = state.newsList.findIndex(
          (news) => news._id === action.payload.id
        );
        if (index !== -1) {
          state.newsList[index].isPinned = action.payload.data.isPinned;
        }
      })

      // Get statistics
      .addCase(getNewsStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentNews } =
  adminNewsSlice.actions;

export default adminNewsSlice.reducer;