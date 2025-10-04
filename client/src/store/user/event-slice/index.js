// store/user-event-slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  events: [],
  currentEvent: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  error: null,
};

// Get all events
export const getAllEvents = createAsyncThunk(
  "userEvent/getAllEvents",
  async (params, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `http://localhost:5000/api/user/events?${queryString}`,
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

// Get event by ID
export const getEventById = createAsyncThunk(
  "userEvent/getEventById",
  async (id, { rejectWithValue }) => {
    try {
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
      return { ...response.data, eventId: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to register for event" }
      );
    }
  }
);

// Unregister from event
export const unregisterFromEvent = createAsyncThunk(
  "userEvent/unregisterFromEvent",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/events/${id}/unregister`,
        {},
        { withCredentials: true }
      );
      return { ...response.data, eventId: id };
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
      // Get all events
      .addCase(getAllEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get event by ID
      .addCase(getEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload.data;
        state.error = null;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register for event
      .addCase(registerForEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const eventId = action.payload.eventId;
        
        // Update in events list
        const eventIndex = state.events.findIndex(e => e._id === eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex].isRegistered = true;
          state.events[eventIndex].currentAttendees += 1;
        }
        
        // Update current event if viewing details
        if (state.currentEvent && state.currentEvent._id === eventId) {
          state.currentEvent.isRegistered = true;
          state.currentEvent.currentAttendees += 1;
        }
        
        state.error = null;
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Unregister from event
      .addCase(unregisterFromEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unregisterFromEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const eventId = action.payload.eventId;
        
        // Update in events list
        const eventIndex = state.events.findIndex(e => e._id === eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex].isRegistered = false;
          if (state.events[eventIndex].currentAttendees > 0) {
            state.events[eventIndex].currentAttendees -= 1;
          }
        }
        
        // Update current event if viewing details
        if (state.currentEvent && state.currentEvent._id === eventId) {
          state.currentEvent.isRegistered = false;
          if (state.currentEvent.currentAttendees > 0) {
            state.currentEvent.currentAttendees -= 1;
          }
        }
        
        state.error = null;
      })
      .addCase(unregisterFromEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentEvent } = userEventSlice.actions;
export default userEventSlice.reducer;