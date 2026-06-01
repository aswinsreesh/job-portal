import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import {
  fetchAdminApplications,
  updateApplicationStatus,
} from '../../store/slices/applicationsSlice';
import { fetchAdminJobs } from '../../store/slices/jobsSlice';
import { APPLICATION_STATUSES } from '../../utils/constants';

const defaultFilters = {
  page: 1,
  limit: 10,
  jobId: '',
  status: '',
  search: '',
};

const statusBadgeClass = {
  pending: 'bg-amber-100 text-amber-800',
  reviewed: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminApplicationsPage() {
  const dispatch = useDispatch();
  const { list, pagination, loading, error, updatingId } = useSelector(
    (s) => s.applications
  );
  const { list: jobs } = useSelector((s) => s.jobs);
  const [filters, setFilters] = useState(defaultFilters);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminJobs({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v != null)
    );
    dispatch(fetchAdminApplications(params));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value, page: 1 }));
  };

  const handleStatusChange = async (applicationId, status) => {
    await dispatch(updateApplicationStatus({ id: applicationId, status }));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Job Applications</h2>
          <p className="mt-1 text-sm text-stone-500">
            View applicants, cover letters, and update application status
          </p>
        </div>
      </div>

      <div className="card mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label-text">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Applicant, email, job title..."
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Job</label>
          <select
            name="jobId"
            value={filters.jobId}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">All jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.companyName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-text">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setFilters(defaultFilters)}
            className="btn-secondary w-full"
          >
            Reset filters
          </button>
        </div>
      </div>

      {error && <Alert message={error} className="mt-4" />}

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Applicant</th>
                <th className="px-4 py-3 text-left font-semibold">Job</th>
                <th className="px-4 py-3 text-left font-semibold">Applied</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Cover letter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {list.map((app) => (
                <Fragment key={app.id}>
                  <tr className="hover:bg-surface-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">
                        {app.applicant.fullName}
                      </p>
                      <p className="text-stone-500">{app.applicant.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{app.job.title}</p>
                      <p className="text-stone-500">{app.job.companyName}</p>
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="link-accent text-xs"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View job →
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {new Date(app.appliedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`rounded-md border border-stone-300 px-2 py-1 text-xs font-medium capitalize ${statusBadgeClass[app.status] || ''}`}
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expandedId === app.id ? null : app.id)
                        }
                        className="link-accent text-sm"
                      >
                        {expandedId === app.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === app.id && (
                    <tr>
                      <td colSpan={5} className="bg-surface-50 px-4 py-4">
                        <p className="mb-1 text-xs font-semibold uppercase text-stone-500">
                          Cover letter
                        </p>
                        <p className="whitespace-pre-wrap text-stone-700">
                          {app.coverLetter}
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <p className="py-12 text-center text-stone-500">
              No applications found. Applications appear here when users apply for
              published jobs.
            </p>
          )}
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
}
