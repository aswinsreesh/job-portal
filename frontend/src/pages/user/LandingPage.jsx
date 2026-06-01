import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import JobCard from '../../components/jobs/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import {
  fetchFeaturedJobs,
  fetchJobsByCategory,
} from '../../store/slices/jobsSlice';

export default function LandingPage() {
  const dispatch = useDispatch();
  const { featured, byCategory } = useSelector((s) => s.jobs);
  const { loading, error } = useSelector((s) => s.jobs);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchFeaturedJobs());
    dispatch(fetchJobsByCategory());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <section className="bg-primary-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find Your Next Career Move
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            Discover thousands of opportunities from top companies. Apply in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/jobs" className="btn-primary">
              Browse All Jobs
            </Link>
            {!user && (
              <Link to="/register" className="btn-hero-outline">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900">Featured Jobs</h2>
          <Link to="/jobs" className="link-accent text-sm">
            View all →
          </Link>
        </div>
        {loading && featured.length === 0 ? (
          <LoadingSpinner className="py-12" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
        {!loading && featured.length === 0 && (
          <p className="text-center text-stone-500">No featured jobs at the moment.</p>
        )}
      </section>

      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-stone-900">
            Jobs by Category
          </h2>
          {error && <Alert message={error} />}
          <div className="space-y-12">
            {byCategory
              .filter((cat) => cat.jobs?.length > 0)
              .map((cat) => (
                <div key={cat.id}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-stone-800">{cat.name}</h3>
                    <Link
                      to={`/jobs?categoryId=${cat.id}`}
                      className="link-accent text-sm"
                    >
                      See all in {cat.name}
                    </Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cat.jobs.map((job) => (
                      <JobCard key={job.id} job={{ ...job, category: { name: cat.name } }} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
