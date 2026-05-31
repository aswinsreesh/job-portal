import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import LandingPage from './pages/user/LandingPage';
import JobsPage from './pages/user/JobsPage';
import JobDetailPage from './pages/user/JobDetailPage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import JobCreatePage from './pages/admin/JobCreatePage';
import JobEditPage from './pages/admin/JobEditPage';
import { fetchMe } from './store/slices/authSlice';
import { setAccessToken } from './api/client';

function AuthInit({ children }) {
  const dispatch = useDispatch();
  const { initialized, accessToken } = useSelector((s) => s.auth);

  useEffect(() => {
    if (accessToken) setAccessToken(accessToken);
    dispatch(fetchMe());
  }, [dispatch, accessToken]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInit>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="jobs" element={<AdminJobsPage />} />
            <Route path="jobs/new" element={<JobCreatePage />} />
            <Route path="jobs/:id/edit" element={<JobEditPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInit>
    </BrowserRouter>
  );
}
