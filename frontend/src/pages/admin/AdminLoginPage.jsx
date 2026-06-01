import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import FormField from '../../components/common/FormField';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clearAuthError, login } from '../../store/slices/authSlice';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (data) => {
    const result = await dispatch(login({ ...data, role: 'admin' }));
    if (login.fulfilled.match(result)) navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-stone-900">Admin Login</h1>
        <p className="mt-1 text-sm text-stone-500">Manage jobs and platform data</p>
        {error && <Alert message={error} className="mt-4" />}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <FormField label="Email" error={errors.email?.message} required>
            <input
              type="email"
              className="input-field"
              {...register('email', { required: 'Email is required' })}
            />
          </FormField>
          <FormField label="Password" error={errors.password?.message} required>
            <input
              type="password"
              className="input-field"
              {...register('password', { required: 'Password is required' })}
            />
          </FormField>
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
            {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-stone-400">
          Demo: admin@jobportal.com / Admin@123
        </p>
      </div>
    </div>
  );
}
