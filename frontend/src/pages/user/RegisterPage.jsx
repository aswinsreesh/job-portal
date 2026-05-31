import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import FormField from '../../components/common/FormField';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clearAuthError, register } from '../../store/slices/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const { register: reg, handleSubmit, formState: { errors }, watch } = useForm();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate('/jobs', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (data) => {
    const result = await dispatch(
      register({ email: data.email, password: data.password, fullName: data.fullName })
    );
    if (register.fulfilled.match(result)) navigate('/jobs', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <div className="card">
          <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
          {error && <Alert message={error} className="mt-4" />}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <FormField label="Full Name" error={errors.fullName?.message} required>
              <input
                className="input-field"
                {...reg('fullName', { required: 'Name is required' })}
              />
            </FormField>
            <FormField label="Email" error={errors.email?.message} required>
              <input
                type="email"
                className="input-field"
                {...reg('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
              />
            </FormField>
            <FormField label="Password" error={errors.password?.message} required>
              <input
                type="password"
                className="input-field"
                {...reg('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
            </FormField>
            <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
              <input
                type="password"
                className="input-field"
                {...reg('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (v) =>
                    v === watch('password') || 'Passwords do not match',
                })}
              />
            </FormField>
            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? <LoadingSpinner size="sm" /> : 'Register'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
