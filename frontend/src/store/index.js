import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import categoriesReducer from './slices/categoriesSlice';
import dashboardReducer from './slices/dashboardSlice';
import applicationsReducer from './slices/applicationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    categories: categoriesReducer,
    dashboard: dashboardReducer,
    applications: applicationsReducer,
  },
});
