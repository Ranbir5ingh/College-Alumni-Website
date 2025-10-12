// store/user/donation-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/user/donations";

// Get donation category stats (total raised per category)
export const getDonationCategoryStats = createAsyncThunk(
  "userDonations/getCategoryStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/category-stats`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category stats"
      );
    }
  }
);

// Create Razorpay order
export const createRazorpayOrder = createAsyncThunk(
  "userDonations/createOrder",
  async ({ amount, currency }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/create-order`,
        { amount, currency },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create payment order"
      );
    }
  }
);

// Verify Razorpay payment
export const verifyRazorpayPayment = createAsyncThunk(
  "userDonations/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/verify-payment`,
        paymentData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  }
);

// Create donation (after successful payment)
export const createDonation = createAsyncThunk(
  "userDonations/create",
  async (donationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, donationData, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create donation"
      );
    }
  }
);

// Update donation status
export const updateDonationStatus = createAsyncThunk(
  "userDonations/updateStatus",
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${id}/status`,
        { paymentStatus },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Get donation by ID
export const getDonationById = createAsyncThunk(
  "userDonations/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch donation"
      );
    }
  }
);

// Get my donation stats
export const getMyDonationStats = createAsyncThunk(
  "userDonations/getMyStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/my-stats`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
);

// Download receipt
export const downloadReceipt = createAsyncThunk(
  "userDonations/downloadReceipt",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/receipt`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download receipt"
      );
    }
  }
);

// Download tax certificate
export const downloadTaxCertificate = createAsyncThunk(
  "userDonations/downloadTaxCertificate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/tax-certificate`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download certificate"
      );
    }
  }
);

const userDonationSlice = createSlice({
  name: "userDonations",
  initialState: {
    categoryStats: {},
    currentDonation: null,
    currentOrder: null,
    stats: null,
    loading: false,
    statsLoading: false,
    categoryStatsLoading: false,
    orderLoading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    paymentVerified: false,
  },
  reducers: {
    clearCurrentDonation: (state) => {
      state.currentDonation = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearPaymentVerified: (state) => {
      state.paymentVerified = false;
    },
    resetDonationState: (state) => {
      state.currentDonation = null;
      state.currentOrder = null;
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.paymentVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get category stats
      .addCase(getDonationCategoryStats.pending, (state) => {
        state.categoryStatsLoading = true;
        state.error = null;
      })
      .addCase(getDonationCategoryStats.fulfilled, (state, action) => {
        state.categoryStatsLoading = false;
        state.categoryStats = action.payload.data;
      })
      .addCase(getDonationCategoryStats.rejected, (state, action) => {
        state.categoryStatsLoading = false;
        state.error = action.payload;
      })
      
      // Create Razorpay order
      .addCase(createRazorpayOrder.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.currentOrder = action.payload.data;
        state.error = null;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload;
      })
      
      // Verify Razorpay payment
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentVerified = false;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentVerified = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentVerified = false;
      })
      
      // Create donation
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDonation = action.payload.data;
        state.createSuccess = true;
        state.error = null;
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      
      // Update donation status
      .addCase(updateDonationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.error = null;
        if (state.currentDonation?._id === action.payload.data._id) {
          state.currentDonation = action.payload.data;
        }
      })
      .addCase(updateDonationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Get donation by ID
      .addCase(getDonationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDonationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDonation = action.payload.data;
        state.error = null;
      })
      .addCase(getDonationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get my stats
      .addCase(getMyDonationStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getMyDonationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.data;
        state.error = null;
      })
      .addCase(getMyDonationStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      
      // Download receipt
      .addCase(downloadReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadReceipt.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(downloadReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Download tax certificate
      .addCase(downloadTaxCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadTaxCertificate.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(downloadTaxCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentDonation,
  clearCurrentOrder,
  clearError,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearPaymentVerified,
  resetDonationState,
} = userDonationSlice.actions;

export default userDonationSlice.reducer;