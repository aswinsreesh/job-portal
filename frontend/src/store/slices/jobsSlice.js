import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '../../api/client';

const getError = (err) => err.response?.data?.message || 'Request failed';

export const fetchPublicJobs = createAsyncThunk(
  'jobs/fetchPublic',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/jobs/public', { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const fetchFeaturedJobs = createAsyncThunk(
  'jobs/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/jobs/public/featured');
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const fetchJobsByCategory = createAsyncThunk(
  'jobs/fetchByCategory',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/jobs/public/by-category');
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const fetchJobDetail = createAsyncThunk(
  'jobs/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.get(`/jobs/public/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/apply',
  async ({ jobId, coverLetter }, { rejectWithValue }) => {
    try {
      const { data } = await client.post(`/jobs/public/${jobId}/apply`, {
        coverLetter,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const fetchAdminJobs = createAsyncThunk(
  'jobs/fetchAdmin',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await client.get('/jobs/admin', { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const fetchAdminJob = createAsyncThunk(
  'jobs/fetchAdminOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.get(`/jobs/admin/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await client.post('/jobs/admin', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await client.put(`/jobs/admin/${id}`, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await client.delete(`/jobs/admin/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],
    featured: [],
    byCategory: [],
    current: null,
    application: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    loading: false,
    detailLoading: false,
    saving: false,
    error: null,
    applySuccess: false,
  },
  reducers: {
    clearJobsError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.current = null;
      state.application = null;
      state.applySuccess = false;
    },
    resetApplySuccess: (state) => {
      state.applySuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPublicJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedJobs.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(fetchJobsByCategory.fulfilled, (state, action) => {
        state.byCategory = action.payload;
      })
      .addCase(fetchJobDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchJobDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload.job;
        state.application = action.payload.application;
      })
      .addCase(fetchJobDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(applyToJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.saving = false;
        state.application = action.payload;
        state.applySuccess = true;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminJob.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchAdminJob.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchAdminJob.rejected, (state) => {
        state.detailLoading = false;
      })
      .addCase(createJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateJob.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.list = state.list.filter((j) => j.id !== action.payload);
      });
  },
});

export const { clearJobsError, clearCurrentJob, resetApplySuccess } =
  jobsSlice.actions;
export default jobsSlice.reducer;
