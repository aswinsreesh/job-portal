import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import JobFilters from '../../components/jobs/JobFilters';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { deleteJob, fetchAdminJobs } from '../../store/slices/jobsSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { formatExperience } from '../../utils/constants';

const defaultFilters = { page: 1, limit: 10, categoryId: '', experienceLevel: '', status: '' };

export default function AdminJobsPage() {
  const dispatch = useDispatch();
  const { list, pagination, loading, error } = useSelector((s) => s.jobs);
  const { list: categories } = useSelector((s) => s.categories);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v != null)
    );
    dispatch(fetchAdminJobs(params));
  }, [dispatch, filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    await dispatch(deleteJob(id));
    dispatch(fetchAdminJobs(filters));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Job Listings</h2>
        <Link to="/admin/jobs/new" className="btn-primary">
          + Create Job
        </Link>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        <aside>
          <JobFilters
            filters={filters}
            categories={categories}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
            showStatus
          />
        </aside>
        <div className="lg:col-span-3">
          {error && <Alert message={error} />}
          {loading ? (
            <LoadingSpinner className="py-16" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Title</th>
                    <th className="px-4 py-3 text-left font-semibold">Company</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Level</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{job.title}</td>
                      <td className="px-4 py-3">{job.companyName}</td>
                      <td className="px-4 py-3">{job.category?.name}</td>
                      <td className="px-4 py-3">{formatExperience(job.experienceLevel)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            job.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'draft'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/jobs/${job.id}/edit`}
                          className="mr-3 text-primary-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {list.length === 0 && (
                <p className="py-12 text-center text-slate-500">No jobs found.</p>
              )}
            </div>
          )}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </div>
      </div>
    </div>
  );
}
