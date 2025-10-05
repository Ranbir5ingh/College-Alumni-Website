// store/user-attendance-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  tokenVerification: null,
  attendanceStatus: null,
  error: null,
};

// Verify attendance token
export const verifyAttendanceToken = createAsyncThunk(
  "userAttendance/verifyToken",
  async ({ eventId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/attendance/${eventId}/${token}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to verify attendance token" }
      );
    }
  }
);

// Mark attendance via QR code
export const markAttendanceViaQR = createAsyncThunk(
  "userAttendance/markAttendance",
  async ({ eventId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/attendance/${eventId}/${token}/mark`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to mark attendance" }
      );
    }
  }
);

// Get my attendance status for an event
export const getMyAttendanceStatus = createAsyncThunk(
  "userAttendance/getStatus",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/attendance/${eventId}/status`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch attendance status" }
      );
    }
  }
);

const userAttendanceSlice = createSlice({
  name: "userAttendance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTokenVerification: (state) => {
      state.tokenVerification = null;
    },
    clearAttendanceStatus: (state) => {
      state.attendanceStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Verify attendance token
      .addCase(verifyAttendanceToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyAttendanceToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tokenVerification = action.payload.data;
        state.error = null;
      })
      .addCase(verifyAttendanceToken.rejected, (state, action) => {
        state.isLoading = false;
        state.tokenVerification = null;
        state.error = action.payload;
      })
      // Mark attendance
      .addCase(markAttendanceViaQR.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAttendanceViaQR.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendanceStatus = {
          attended: true,
          attendanceMarkedAt: action.payload.data.attendanceMarkedAt,
          registrationNumber: action.payload.data.registrationNumber,
        };
        state.error = null;
      })
      .addCase(markAttendanceViaQR.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get attendance status
      .addCase(getMyAttendanceStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyAttendanceStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendanceStatus = action.payload.data;
        state.error = null;
      })
      .addCase(getMyAttendanceStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearTokenVerification, clearAttendanceStatus } = 
  userAttendanceSlice.actions;
export default userAttendanceSlice.reducer;