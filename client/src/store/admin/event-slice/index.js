import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import ExcelJS from "exceljs";

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

// Export event registrations with Excel download (using ExcelJS - more secure)
export const exportEventRegistrations = createAsyncThunk(
  "adminEvent/exportEventRegistrations",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/events/${id}/registrations/export`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        const { eventTitle, registrations, count } = response.data.data;

        if (!registrations || registrations.length === 0) {
          throw new Error("No registrations to export");
        }

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Alumni Portal';
        workbook.created = new Date();

        // Add Summary Sheet
        const summarySheet = workbook.addWorksheet('Summary', {
          properties: { tabColor: { argb: '4472C4' } }
        });

        summarySheet.columns = [
          { header: 'Field', key: 'field', width: 25 },
          { header: 'Value', key: 'value', width: 40 }
        ];

        summarySheet.addRows([
          { field: 'Event Title', value: eventTitle },
          { field: 'Total Registrations', value: count },
          { field: 'Export Date', value: new Date().toLocaleString() }
        ]);

        // Style summary sheet header
        summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        summarySheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4472C4' }
        };

        // Add Registrations Sheet
        const registrationsSheet = workbook.addWorksheet('Registrations');

        // Get column headers from first registration object
        const headers = Object.keys(registrations[0]);
        registrationsSheet.columns = headers.map(header => ({
          header: header,
          key: header,
          width: header.length > 20 ? 30 : header.length + 10
        }));

        // Add data rows
        registrations.forEach(reg => {
          registrationsSheet.addRow(reg);
        });

        // Style registrations header
        registrationsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
        registrationsSheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '70AD47' }
        };

        // Add borders to all cells
        registrationsSheet.eachRow({ includeEmpty: false }, (row) => {
          row.eachCell({ includeEmpty: false }, (cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        });

        // Generate file name
        const timestamp = new Date().toISOString().split('T')[0];
        const sanitizedTitle = eventTitle
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase()
          .substring(0, 30);
        const fileName = `${sanitizedTitle}_registrations_${timestamp}.xlsx`;

        // Write to buffer and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);

        return response.data;
      }
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