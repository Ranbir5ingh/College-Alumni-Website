// store/user-alumni-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  dashboardData: null,
  myEvents: [],
  myDonations: [],
  myMembership: null,
  alumniDirectory: [],
  selectedAlumni: null,
  directoryPagination: {
    currentPage: 1,
    totalPages: 1,
    totalAlumni: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  error: null,
};

// Get my dashboard data
export const getMyDashboard = createAsyncThunk(
  "userAlumni/getMyDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/alumni/dashboard",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch dashboard data" }
      );
    }
  }
);

// Get my events
export const getMyEvents = createAsyncThunk(
  "userAlumni/getMyEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/alumni/my-events",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch events" }
      );
    }
  }
);

// Get my donations
export const getMyDonations = createAsyncThunk(
  "userAlumni/getMyDonations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/alumni/my-donations",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch donations" }
      );
    }
  }
);

// Get my membership
export const getMyMembership = createAsyncThunk(
  "userAlumni/getMyMembership",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/alumni/my-membership",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch membership" }
      );
    }
  }
);

// Search alumni directory
export const searchAlumniDirectory = createAsyncThunk(
  "userAlumni/searchAlumniDirectory",
  async (params, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `http://localhost:5000/api/user/alumni/directory?${queryString}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to search directory" }
      );
    }
  }
);

// Get alumni profile by ID
export const getAlumniProfileById = createAsyncThunk(
  "userAlumni/getAlumniProfileById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/alumni/directory/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch alumni profile" }
      );
    }
  }
);

const userAlumniSlice = createSlice({
  name: "userAlumni",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAlumni: (state) => {
      state.selectedAlumni = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get my dashboard
      .addCase(getMyDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload.data;
        state.error = null;
      })
      .addCase(getMyDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get my events
      .addCase(getMyEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myEvents = action.payload.data;
        state.error = null;
      })
      .addCase(getMyEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get my donations
      .addCase(getMyDonations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyDonations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myDonations = action.payload.data;
        state.error = null;
      })
      .addCase(getMyDonations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get my membership
      .addCase(getMyMembership.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyMembership.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myMembership = action.payload.data;
        state.error = null;
      })
      .addCase(getMyMembership.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search alumni directory
      .addCase(searchAlumniDirectory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchAlumniDirectory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alumniDirectory = action.payload.data;
        state.directoryPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(searchAlumniDirectory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get alumni profile by ID
      .addCase(getAlumniProfileById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAlumniProfileById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAlumni = action.payload.data;
        state.error = null;
      })
      .addCase(getAlumniProfileById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedAlumni } = userAlumniSlice.actions;
export default userAlumniSlice.reducer;