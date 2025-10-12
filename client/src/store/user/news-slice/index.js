import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/user/news";

// Get all published news
export const getAllPublishedNews = createAsyncThunk(
  "alumniNews/getAllPublishedNews",
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

// Get pinned news
export const getPinnedNews = createAsyncThunk(
  "alumniNews/getPinnedNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pinned`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pinned news"
      );
    }
  }
);

// Get recent news
export const getRecentNews = createAsyncThunk(
  "alumniNews/getRecentNews",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/recent?limit=${limit}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recent news"
      );
    }
  }
);

// Get news by slug
export const getNewsBySlug = createAsyncThunk(
  "alumniNews/getNewsBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/slug/${slug}`, { withCredentials: true });
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
  "alumniNews/getNewsById",
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

// Get news by category
export const getNewsByCategory = createAsyncThunk(
  "alumniNews/getNewsByCategory",
  async ({ category, params = {} }, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `${API_URL}/category/${category}?${queryString}`, { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news"
      );
    }
  }
);

// Get related news
export const getRelatedNews = createAsyncThunk(
  "alumniNews/getRelatedNews",
  async ({ id, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/related?limit=${limit}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch related news"
      );
    }
  }
);

// Get categories
export const getCategories = createAsyncThunk(
  "alumniNews/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Get tags
export const getTags = createAsyncThunk(
  "alumniNews/getTags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tags`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tags"
      );
    }
  }
);

const alumniNewsSlice = createSlice({
  name: "alumniNews",
  initialState: {
    newsList: [],
    pinnedNews: [],
    recentNews: [],
    currentNews: null,
    relatedNews: [],
    categories: [],
    tags: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalNews: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentNews: (state) => {
      state.currentNews = null;
      state.relatedNews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all published news
      .addCase(getAllPublishedNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPublishedNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllPublishedNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get pinned news
      .addCase(getPinnedNews.fulfilled, (state, action) => {
        state.pinnedNews = action.payload.data;
      })

      // Get recent news
      .addCase(getRecentNews.fulfilled, (state, action) => {
        state.recentNews = action.payload.data;
      })

      // Get news by slug
      .addCase(getNewsBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNewsBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentNews = action.payload.data;
      })
      .addCase(getNewsBySlug.rejected, (state, action) => {
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

      // Get news by category
      .addCase(getNewsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNewsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newsList = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getNewsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get related news
      .addCase(getRelatedNews.fulfilled, (state, action) => {
        state.relatedNews = action.payload.data;
      })

      // Get categories
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data;
      })

      // Get tags
      .addCase(getTags.fulfilled, (state, action) => {
        state.tags = action.payload.data;
      });
  },
});

export const { clearError, clearCurrentNews } = alumniNewsSlice.actions;

export default alumniNewsSlice.reducer;