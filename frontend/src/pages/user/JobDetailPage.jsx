import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import FormField from '../../components/common/FormField';
import {
  applyToJob,
  clearCurrentJob,
  fetchJobDetail,
  resetApplySuccess,
} from '../../store/slices/jobsSlice';
import { formatExperience, formatSalary } from '../../utils/constants';

export default function JobDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { current, application, detailLoading, saving, error, applySuccess } =
    useSelector((s) => s.jobs);
  const [showApply, setShowApply] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchJobDetail(id));
    return () => {
      dispatch(clearCurrentJob());
      dispatch(resetApplySuccess());
    };
  }, [dispatch, id]);

  const onApply = async (data) => {
    const result = await dispatch(
      applyToJob({ jobId: id, coverLetter: data.coverLetter })
    );
    if (applyToJob.fulfilled.match(result)) setShowApply(false);
  };

  if (detailLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UserHeader />
        <LoadingSpinner size="lg" className="flex-1 py-32" />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-screen flex-col">
        <UserHeader />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="text-slate-600">Job not found.</p>
          <Link to="/jobs" className="btn-primary mt-4 inline-block">
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <article className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/jobs" className="text-sm text-primary-600 hover:underline">
          ← Back to listings
        </Link>
        <div className="card mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{current.title}</h1>
              <p className="mt-2 text-lg text-slate-600">{current.companyName}</p>
            </div>
            {current.isFeatured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                Featured
              </span>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg bg-slate-100 px-3 py-1">{current.location}</span>
            <span className="rounded-lg bg-slate-100 px-3 py-1">
              {formatExperience(current.experienceLevel)}
            </span>
            <span className="rounded-lg bg-primary-50 px-3 py-1 text-primary-700">
              {current.category?.name}
            </span>
            <span className="rounded-lg bg-green-50 px-3 py-1 font-medium text-green-700">
              {formatSalary(current.salaryMin, current.salaryMax)}
            </span>
          </div>
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-slate-600">{current.description}</p>
          </section>
          {current.requirements && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold">Requirements</h2>
              <p className="mt-2 whitespace-pre-wrap text-slate-600">{current.requirements}</p>
            </section>
          )}
        </div>

        <div className="card mt-6">
          {applySuccess && (
            <Alert type="success" message="Application submitted successfully!" />
          )}
          {error && <Alert message={error} onClose={() => {}} />}
          {application ? (
            <p className="text-green-700">
              You applied on {new Date(application.applied_at || application.appliedAt).toLocaleDateString()}.
              Status: <strong>{application.status}</strong>
            </p>
          ) : user?.role === 'user' ? (
            <>
              {!showApply ? (
                <button type="button" onClick={() => setShowApply(true)} className="btn-primary">
                  Apply for this job
                </button>
              ) : (
                <form onSubmit={handleSubmit(onApply)}>
                  <FormField
                    label="Cover Letter"
                    error={errors.coverLetter?.message}
                    required
                  >
                    <textarea
                      rows={6}
                      className="input-field"
                      placeholder="Tell us why you're a great fit..."
                      {...register('coverLetter', {
                        required: 'Cover letter is required',
                        minLength: { value: 20, message: 'At least 20 characters' },
                      })}
                    />
                  </FormField>
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApply(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div>
              <p className="text-slate-600">Sign in to apply for this position.</p>
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: `/jobs/${id}` } })}
                className="btn-primary mt-3"
              >
                Login to Apply
              </button>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
}
