// store/admin/membership-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  purchases: [],
  statistics: null,
  activeMemberships: [],
  expiringMemberships: [],
  revenueReport: null,
  selectedPurchase: null,
  userHistory: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  error: null,
};

// Get all membership purchases
export const getAllMembershipPurchases = createAsyncThunk(
  "adminMembership/getAllMembershipPurchases",
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/membership?${queryParams}`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch purchases" }
      );
    }
  }
);

// Get membership statistics
export const getMembershipStatistics = createAsyncThunk(
  "adminMembership/getMembershipStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/statistics`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch statistics" }
      );
    }
  }
);

// Get membership purchase by ID
export const getMembershipPurchaseById = createAsyncThunk(
  "adminMembership/getMembershipPurchaseById",
  async (purchaseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/${purchaseId}`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch purchase details" }
      );
    }
  }
);

// Get user membership history
export const getUserMembershipHistory = createAsyncThunk(
  "adminMembership/getUserMembershipHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/user/${userId}`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user history" }
      );
    }
  }
);

// Update membership status
export const updateMembershipStatus = createAsyncThunk(
  "adminMembership/updateMembershipStatus",
  async ({ purchaseId, statusData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/${purchaseId}/status`,
        statusData, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update status" }
      );
    }
  }
);

// Process refund
export const processMembershipRefund = createAsyncThunk(
  "adminMembership/processMembershipRefund",
  async ({ purchaseId, refundData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/${purchaseId}/refund`,
        refundData, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to process refund" }
      );
    }
  }
);

// Get expiring memberships
export const getExpiringMemberships = createAsyncThunk(
  "adminMembership/getExpiringMemberships",
  async (days = 30, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/expiring?days=${days}`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch expiring memberships" }
      );
    }
  }
);

// Get revenue report
export const getRevenueReport = createAsyncThunk(
  "adminMembership/getRevenueReport",
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/revenue-report?${queryParams}`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch revenue report" }
      );
    }
  }
);

// Update expired memberships
export const updateExpiredMemberships = createAsyncThunk(
  "adminMembership/updateExpiredMemberships",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/update-expired`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update expired memberships" }
      );
    }
  }
);

// Get active members
export const getActiveMembers = createAsyncThunk(
  "adminMembership/getActiveMembers",
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/membership/active-members?${queryParams}`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch active members" }
      );
    }
  }
);

const adminMembershipSlice = createSlice({
  name: "adminMembership",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPurchase: (state) => {
      state.selectedPurchase = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all purchases
      .addCase(getAllMembershipPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMembershipPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload.data.purchases;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllMembershipPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch purchases";
      })
      
      // Get statistics
      .addCase(getMembershipStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembershipStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload.data;
      })
      .addCase(getMembershipStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch statistics";
      })
      
      // Get purchase by ID
      .addCase(getMembershipPurchaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembershipPurchaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPurchase = action.payload.data;
      })
      .addCase(getMembershipPurchaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch purchase details";
      })
      
      // Get user history
      .addCase(getUserMembershipHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserMembershipHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.userHistory = action.payload.data;
      })
      .addCase(getUserMembershipHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user history";
      })
      
      // Update status
      .addCase(updateMembershipStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMembershipStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateMembershipStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update status";
      })
      
      // Process refund
      .addCase(processMembershipRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processMembershipRefund.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(processMembershipRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to process refund";
      })
      
      // Get expiring memberships
      .addCase(getExpiringMemberships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpiringMemberships.fulfilled, (state, action) => {
        state.loading = false;
        state.expiringMemberships = action.payload.data.memberships;
      })
      .addCase(getExpiringMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch expiring memberships";
      })
      
      // Get revenue report
      .addCase(getRevenueReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRevenueReport.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueReport = action.payload.data;
      })
      .addCase(getRevenueReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch revenue report";
      })
      
      // Update expired memberships
      .addCase(updateExpiredMemberships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpiredMemberships.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateExpiredMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update expired memberships";
      })
      
      // Get active members
      .addCase(getActiveMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.activeMemberships = action.payload.data.members;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getActiveMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch active members";
      });
  },
});

export const { clearError, clearSelectedPurchase } = adminMembershipSlice.actions;

export default adminMembershipSlice.reducer;