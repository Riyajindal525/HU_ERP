import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceService from '../../services/attendanceService';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAttendance(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const fetchAttendanceSummary = createAsyncThunk(
  'attendance/fetchSummary',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getStudentAttendanceSummary(studentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance summary');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendance: [],
    summary: [],
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {
    clearAttendance: (state) => {
      state.attendance = [];
      state.summary = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.attendance;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export const { clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
