import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '../../api/client';

const getError = (err) => err.response?.data?.message || 'Request failed';

export const fetchAdminApplications = createAsyncThunk(
  'applications/fetchAdmin',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/jobs/admin/applications', { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await client.patch(`/jobs/admin/applications/${id}`, {
        status,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    loading: false,
    updatingId: null,
    error: null,
  },
  reducers: {
    clearApplicationsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.applications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateApplicationStatus.pending, (state, action) => {
        state.updatingId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.updatingId = null;
        const index = state.list.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.updatingId = null;
        state.error = action.payload;
      });
  },
});

export const { clearApplicationsError } = applicationsSlice.actions;
export default applicationsSlice.reducer;
