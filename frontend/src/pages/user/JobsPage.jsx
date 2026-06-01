import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { fetchPublicJobs } from '../../store/slices/jobsSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';

const defaultFilters = {
  page: 1,
  limit: 9,
  search: '',
  location: '',
  categoryId: '',
  experienceLevel: '',
  salaryMin: '',
  sortBy: 'created_at',
};

export default function JobsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { list, pagination, loading, error } = useSelector((s) => s.jobs);
  const { list: categories } = useSelector((s) => s.categories);

  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    categoryId: searchParams.get('categoryId') || '',
    search: searchParams.get('search') || '',
  }));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v != null)
    );
    dispatch(fetchPublicJobs(params));
    const qs = new URLSearchParams();
    if (filters.categoryId) qs.set('categoryId', filters.categoryId);
    if (filters.search) qs.set('search', filters.search);
    setSearchParams(qs, { replace: true });
  }, [dispatch, filters]);

  const handlePageChange = (page) => setFilters((f) => ({ ...f, page }));

  return (
    <div className="flex min-h-screen flex-col">
      <UserHeader />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-stone-900">Browse Jobs</h1>
        <JobFilters
          layout="bar"
          filters={filters}
          categories={categories}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />
        <div>
          {error && <Alert message={error} />}
          {loading ? (
            <LoadingSpinner className="py-20" />
          ) : list.length === 0 ? (
            <div className="card py-16 text-center text-stone-500">
              No jobs match your filters. Try adjusting your search.
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-stone-500">
                Showing {list.length} of {pagination.total} jobs
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
