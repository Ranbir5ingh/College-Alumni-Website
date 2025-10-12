// store/user/membership-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  orderLoading: false,
  membershipInfo: null,
  myStatus: null,
  currentOrder: null,
  purchaseSuccess: false,
  error: null,
};

// Get membership information and benefits
export const getMembershipInfo = createAsyncThunk(
  "userMembership/getMembershipInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/membership/info`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch membership info" }
      );
    }
  }
);

// Get my membership status
export const getMyMembershipStatus = createAsyncThunk(
  "userMembership/getMyMembershipStatus",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/membership/my-status`, { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch membership status" }
      );
    }
  }
);

// Create Razorpay order
export const createMembershipOrder = createAsyncThunk(
  "userMembership/createMembershipOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/membership/create-order`,
        orderData, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create order" }
      );
    }
  }
);

// Purchase membership
export const purchaseMembership = createAsyncThunk(
  "userMembership/purchaseMembership",
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/membership/purchase`,
        purchaseData, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to purchase membership" }
      );
    }
  }
);

// Cancel membership
export const cancelMembership = createAsyncThunk(
  "userMembership/cancelMembership",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/membership/cancel`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to cancel membership" }
      );
    }
  }
);

// Download receipt
export const downloadMembershipReceipt = createAsyncThunk(
  "userMembership/downloadMembershipReceipt",
  async (purchaseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/membership/receipt/${purchaseId}`, {withCredentials: true}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to download receipt" }
      );
    }
  }
);

const userMembershipSlice = createSlice({
  name: "userMembership",
  initialState,
  reducers: {
    clearPurchaseSuccess: (state) => {
      state.purchaseSuccess = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get membership info
      .addCase(getMembershipInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembershipInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipInfo = action.payload.data;
      })
      .addCase(getMembershipInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch membership info";
      })
      
      // Get my status
      .addCase(getMyMembershipStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyMembershipStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.myStatus = action.payload.data;
      })
      .addCase(getMyMembershipStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch membership status";
      })
      
      // Create order
      .addCase(createMembershipOrder.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
      })
      .addCase(createMembershipOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.currentOrder = action.payload.data;
      })
      .addCase(createMembershipOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload?.message || "Failed to create order";
      })
      
      // Purchase membership
      .addCase(purchaseMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseSuccess = true;
      })
      .addCase(purchaseMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to purchase membership";
      })
      
      // Cancel membership
      .addCase(cancelMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelMembership.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(cancelMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to cancel membership";
      })
      
      // Download receipt
      .addCase(downloadMembershipReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadMembershipReceipt.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(downloadMembershipReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to download receipt";
      });
  },
});

export const { clearPurchaseSuccess, clearCurrentOrder, clearError } = userMembershipSlice.actions;

export default userMembershipSlice.reducer;