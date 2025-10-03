import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  eventList: [],
  currentEvent: null,
  stats: null,
  registrations: [],
  registrationPagination: {
    currentPage: 1,
    totalPages: 1,
    totalRegistrations: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
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
  "adminEvent/getAllEvents",
  async (params, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `http://localhost:5000/api/admin/events?${queryString}`,
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
  "adminEvent/getEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/events/${id}`,
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

// Create event
export const createEvent = createAsyncThunk(
  "adminEvent/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/events",
        eventData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create event" }
      );
    }
  }
);

// Update event
export const updateEvent = createAsyncThunk(
  "adminEvent/updateEvent",
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/events/${id}`,
        eventData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update event" }
      );
    }
  }
);

// Delete event
export const deleteEvent = createAsyncThunk(
  "adminEvent/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/events/${id}`,
        { withCredentials: true }
      );
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete event" }
      );
    }
  }
);

// Update event status
export const updateEventStatus = createAsyncThunk(
  "adminEvent/updateEventStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/events/${id}/status`,
        statusData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update event status" }
      );
    }
  }
);

// Get event statistics
export const getEventStats = createAsyncThunk(
  "adminEvent/getEventStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/events/stats",
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

// Get event registrations
export const getEventRegistrations = createAsyncThunk(
  "adminEvent/getEventRegistrations",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await axios.get(
        `http://localhost:5000/api/admin/events/${id}/registrations?${queryString}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch registrations" }
      );
    }
  }
);

// Mark attendance
export const markAttendance = createAsyncThunk(
  "adminEvent/markAttendance",
  async ({ registrationId, attended }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/events/registrations/${registrationId}/attendance`,
        { attended },
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

// Generate attendance QR
export const generateAttendanceQR = createAsyncThunk(
  "adminEvent/generateAttendanceQR",
  async ({ id, expiryMinutes }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/events/${id}/qr/generate`,
        { expiryMinutes },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to generate QR code" }
      );
    }
  }
);

// Deactivate attendance QR
export const deactivateAttendanceQR = createAsyncThunk(
  "adminEvent/deactivateAttendanceQR",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/events/${id}/qr/deactivate`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to deactivate QR code" }
      );
    }
  }
);

// Export event registrations
export const exportEventRegistrations = createAsyncThunk(
  "adminEvent/exportEventRegistrations",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/events/${id}/registrations/export`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to export registrations" }
      );
    }
  }
);

// Send event reminders
export const sendEventReminders = createAsyncThunk(
  "adminEvent/sendEventReminders",
  async ({ id, reminderType }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/events/${id}/reminders`,
        { reminderType },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send reminders" }
      );
    }
  }
);

const adminEventSlice = createSlice({
  name: "adminEvent",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
      state.registrations = [];
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
        state.eventList = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.eventList = [];
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
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventList.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentEvent && state.currentEvent._id === action.payload.data._id) {
          state.currentEvent = action.payload.data;
        }
        const index = state.eventList.findIndex(e => e._id === action.payload.data._id);
        if (index !== -1) {
          state.eventList[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventList = state.eventList.filter(
          event => event._id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update event status
      .addCase(updateEventStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentEvent && state.currentEvent._id === action.payload.data.id) {
          state.currentEvent = { ...state.currentEvent, ...action.payload.data };
        }
        state.error = null;
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get event statistics
      .addCase(getEventStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
        state.error = null;
      })
      .addCase(getEventStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get event registrations
      .addCase(getEventRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrations = action.payload.data;
        state.registrationPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getEventRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Mark attendance
      .addCase(markAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.registrations.findIndex(
          r => r._id === action.payload.data.registrationId
        );
        if (index !== -1) {
          state.registrations[index] = {
            ...state.registrations[index],
            ...action.payload.data
          };
        }
        state.error = null;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Generate attendance QR
      .addCase(generateAttendanceQR.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateAttendanceQR.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(generateAttendanceQR.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Deactivate attendance QR
      .addCase(deactivateAttendanceQR.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivateAttendanceQR.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deactivateAttendanceQR.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Export event registrations
      .addCase(exportEventRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportEventRegistrations.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(exportEventRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Send event reminders
      .addCase(sendEventReminders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendEventReminders.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendEventReminders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentEvent } = adminEventSlice.actions;
export default adminEventSlice.reducer;