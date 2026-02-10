import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import studentService from '../../services/studentService';

export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await studentService.getAllStudents(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await studentService.getStudentById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student');
    }
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    currentStudent: null,
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentStudent } = studentSlice.actions;
export default studentSlice.reducer;
