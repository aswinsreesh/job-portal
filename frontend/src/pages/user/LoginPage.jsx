import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import FormField from '../../components/common/FormField';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clearAuthError, login } from '../../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const from = location.state?.from || '/jobs';

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === 'user') navigate(from, { replace: true });
  }, [user, navigate, from]);

  const onSubmit = async (data) => {
    const result = await dispatch(login({ ...data, role: 'user' }));
    if (login.fulfilled.match(result)) navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <div className="card">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to apply for jobs</p>
          {error && <Alert message={error} className="mt-4" />}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <FormField label="Email" error={errors.email?.message} required>
              <input
                type="email"
                className="input-field"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
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
          <p className="mt-4 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">
              Register
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-slate-400">
            Demo: user@jobportal.com / User@123
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
