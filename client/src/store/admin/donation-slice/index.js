// store/admin/donationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/donations";

// Get all donations with filters
export const getAllDonations = createAsyncThunk(
  "adminDonations/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { params, withCredentials: true});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch donations"
      );
    }
  }
);

// Get donation statistics
export const getDonationStats = createAsyncThunk(
  "adminDonations/getStats",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/stats`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
);

// Get donation by ID
export const getDonationById = createAsyncThunk(
  "adminDonations/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch donation"
      );
    }
  }
);

// Update donation
export const updateDonation = createAsyncThunk(
  "adminDonations/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, data, {withCredentials: true} );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update donation"
      );
    }
  }
);

// Generate receipt
export const generateReceipt = createAsyncThunk(
  "adminDonations/generateReceipt",
  async ({ id, receiptUrl }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/receipt`, {
        receiptUrl,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate receipt"
      );
    }
  }
);

// Generate tax certificate
export const generateTaxCertificate = createAsyncThunk(
  "adminDonations/generateTaxCertificate",
  async ({ id, certificateUrl }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/tax-certificate`, {
        certificateUrl,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate tax certificate"
      );
    }
  }
);

// Process refund
export const processRefund = createAsyncThunk(
  "adminDonations/processRefund",
  async ({ id, refundReason, refundAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/refund`, {
        refundReason,
        refundAmount,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to process refund"
      );
    }
  }
);

// Mark acknowledgment sent
export const markAcknowledgmentSent = createAsyncThunk(
  "adminDonations/markAcknowledgment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/acknowledgment`, {withCredentials: true});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark acknowledgment"
      );
    }
  }
);

// Export donations
export const exportDonations = createAsyncThunk(
  "adminDonations/export",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/export`, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to export donations"
      );
    }
  }
);

const adminDonationSlice = createSlice({
  name: "adminDonations",
  initialState: {
    donations: [],
    currentDonation: null,
    stats: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalDonations: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    filters: {
      page: 1,
      limit: 20,
      category: "",
      paymentStatus: "",
      status: "",
      startDate: "",
      endDate: "",
      search: "",
      sortBy: "donationDate",
      sortOrder: "desc",
    },
    loading: false,
    error: null,
    exportData: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
        category: "",
        paymentStatus: "",
        status: "",
        startDate: "",
        endDate: "",
        search: "",
        sortBy: "donationDate",
        sortOrder: "desc",
      };
    },
    clearCurrentDonation: (state) => {
      state.currentDonation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all donations
      .addCase(getAllDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get donation stats
      .addCase(getDonationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDonationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getDonationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get donation by ID
      .addCase(getDonationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDonationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDonation = action.payload.data;
      })
      .addCase(getDonationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update donation
      .addCase(updateDonation.fulfilled, (state, action) => {
        const index = state.donations.findIndex(
          (d) => d._id === action.payload.data._id
        );
        if (index !== -1) {
          state.donations[index] = action.payload.data;
        }
        if (state.currentDonation?._id === action.payload.data._id) {
          state.currentDonation = action.payload.data;
        }
      })
      // Export donations
      .addCase(exportDonations.fulfilled, (state, action) => {
        state.exportData = action.payload.data;
      });
  },
});

export const { setFilters, resetFilters, clearCurrentDonation, clearError } =
  adminDonationSlice.actions;

export default adminDonationSlice.reducer;