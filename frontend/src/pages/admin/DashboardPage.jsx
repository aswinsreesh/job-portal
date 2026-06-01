import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';

const statCards = [
  { key: 'total_jobs', label: 'Total Jobs', color: 'bg-primary-700' },
  { key: 'published_jobs', label: 'Published', color: 'bg-primary-500' },
  { key: 'draft_jobs', label: 'Drafts', color: 'bg-accent-400' },
  { key: 'total_users', label: 'Users', color: 'bg-accent-500' },
  { key: 'total_applications', label: 'Applications', color: 'bg-primary-600' },
];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (error) return <Alert message={error} />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-900">Dashboard</h2>
      <p className="mt-1 text-stone-500">Overview of HireBridge</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map(({ key, label, color }) => (
          <div key={key} className="card">
            <div className={`mb-3 h-1 w-12 rounded ${color}`} />
            <p className="text-3xl font-bold text-stone-900">{stats?.[key] ?? 0}</p>
            <p className="mt-1 text-sm text-stone-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/admin/applications" className="btn-primary">
          View Applications
        </Link>
        <Link to="/admin/jobs/new" className="btn-secondary">
          Create New Job
        </Link>
        <Link to="/admin/jobs" className="btn-secondary">
          Manage Jobs
        </Link>
      </div>
    </div>
  );
}
