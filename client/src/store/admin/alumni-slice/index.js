import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  alumniList: [],
  currentAlumni: null,
  stats: null,
  pendingVerifications: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalAlumni: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  error: null,
};

// Get all alumni
export const getAllAlumni = createAsyncThunk(
  "adminAlumni/getAllAlumni",
  async (params, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `http://localhost:5000/api/admin/alumni?${queryString}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch alumni" }
      );
    }
  }
);

// Get alumni by ID
export const getAlumniById = createAsyncThunk(
  "adminAlumni/getAlumniById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/alumni/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch alumni details" }
      );
    }
  }
);

// Verify alumni
export const verifyAlumni = createAsyncThunk(
  "adminAlumni/verifyAlumni",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/alumni/${id}/verify`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to verify alumni" }
      );
    }
  }
);

// Reject alumni
export const rejectAlumni = createAsyncThunk(
  "adminAlumni/rejectAlumni",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/alumni/${id}/reject`,
        { reason },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to reject alumni" }
      );
    }
  }
);

// Update alumni status
export const updateAlumniStatus = createAsyncThunk(
  "adminAlumni/updateAlumniStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/alumni/${id}/status`,
        statusData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update alumni status" }
      );
    }
  }
);

// Delete alumni
export const deleteAlumni = createAsyncThunk(
  "adminAlumni/deleteAlumni",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/alumni/${id}`,
        { withCredentials: true }
      );
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete alumni" }
      );
    }
  }
);

// Get alumni statistics
export const getAlumniStats = createAsyncThunk(
  "adminAlumni/getAlumniStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/alumni/stats",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch statistics" }
      );
    }
  }
);

// Get pending verifications
export const getPendingVerifications = createAsyncThunk(
  "adminAlumni/getPendingVerifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/alumni/pending",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch pending verifications" }
      );
    }
  }
);

// Export alumni data
export const exportAlumniData = createAsyncThunk(
  "adminAlumni/exportAlumniData",
  async (params, { rejectWithValue }) => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await axios.get(
        `http://localhost:5000/api/admin/alumni/export?${queryString}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to export data" }
      );
    }
  }
);

const adminAlumniSlice = createSlice({
  name: "adminAlumni",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAlumni: (state) => {
      state.currentAlumni = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all alumni
      .addCase(getAllAlumni.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllAlumni.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alumniList = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getAllAlumni.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.alumniList = [];
      })
      // Get alumni by ID
      .addCase(getAlumniById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAlumniById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAlumni = action.payload.data;
        state.error = null;
      })
      .addCase(getAlumniById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify alumni
      .addCase(verifyAlumni.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyAlumni.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingVerifications = state.pendingVerifications.filter(
          alumni => alumni._id !== action.payload.data.id
        );
        state.error = null;
      })
      .addCase(verifyAlumni.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reject alumni
      .addCase(rejectAlumni.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectAlumni.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(rejectAlumni.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update alumni status
      .addCase(updateAlumniStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAlumniStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentAlumni && state.currentAlumni._id === action.payload.data.id) {
          state.currentAlumni = { ...state.currentAlumni, ...action.payload.data };
        }
        state.error = null;
      })
      .addCase(updateAlumniStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete alumni
      .addCase(deleteAlumni.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAlumni.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alumniList = state.alumniList.filter(
          alumni => alumni._id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(deleteAlumni.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get alumni statistics
      .addCase(getAlumniStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAlumniStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
        state.error = null;
      })
      .addCase(getAlumniStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get pending verifications
      .addCase(getPendingVerifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPendingVerifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingVerifications = action.payload.data;
        state.error = null;
      })
      .addCase(getPendingVerifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Export alumni data
      .addCase(exportAlumniData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportAlumniData.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(exportAlumniData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentAlumni } = adminAlumniSlice.actions;
export default adminAlumniSlice.reducer;