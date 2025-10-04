import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  currentEvent: null,
  error: null,
};

// Get event by ID (User-facing - pulls from /api/user/events/:id)
export const getEventById = createAsyncThunk(
  "userEvent/getEventById",
  async (id, { rejectWithValue }) => {
    try {
      // Note: This endpoint should only return published events or drafts if the user has admin role (handled by backend middleware)
      const response = await axios.get(
        `http://localhost:5000/api/user/events/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch event details" }
      );
    }
  }
);

// Register for event
export const registerForEvent = createAsyncThunk(
  "userEvent/registerForEvent",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/events/${id}/register`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to register for event" }
      );
    }
  }
);

// Unregister/Cancel registration for event (optional feature)
export const unregisterFromEvent = createAsyncThunk(
  "userEvent/unregisterFromEvent",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/events/${id}/unregister`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to cancel registration" }
      );
    }
  }
);


const userEventSlice = createSlice({
  name: "userEvent",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get event by ID
      .addCase(getEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentEvent = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload.data;
        state.error = null;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentEvent = null;
      })
      // Register for event (Update isRegistered status locally)
      .addCase(registerForEvent.fulfilled, (state) => {
        if (state.currentEvent) {
          state.currentEvent.isRegistered = true;
          // Optimistically update attendees count if structure allows
          if (state.currentEvent.currentAttendees !== undefined) {
             state.currentEvent.currentAttendees += 1;
          }
        }
      })
      // Unregister (Update isRegistered status locally)
      .addCase(unregisterFromEvent.fulfilled, (state) => {
        if (state.currentEvent) {
          state.currentEvent.isRegistered = false;
          // Optimistically update attendees count
          if (state.currentEvent.currentAttendees > 0) {
             state.currentEvent.currentAttendees -= 1;
          }
        }
      });
  },
});

export const { clearError, clearCurrentEvent } = userEventSlice.actions;
export default userEventSlice.reducer;