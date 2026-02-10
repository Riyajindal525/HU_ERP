import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import examService from '../../services/examService';

export const fetchExams = createAsyncThunk(
  'exams/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await examService.getAllExams(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exams');
    }
  }
);

export const fetchUpcomingExams = createAsyncThunk(
  'exams/fetchUpcoming',
  async ({ courseId, semester }, { rejectWithValue }) => {
    try {
      const response = await examService.getUpcomingExams(courseId, semester);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming exams');
    }
  }
);

const examSlice = createSlice({
  name: 'exams',
  initialState: {
    exams: [],
    upcomingExams: [],
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {
    clearExams: (state) => {
      state.exams = [];
      state.upcomingExams = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload.exams;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUpcomingExams.fulfilled, (state, action) => {
        state.upcomingExams = action.payload;
      });
  },
});

export const { clearExams } = examSlice.actions;
export default examSlice.reducer;
