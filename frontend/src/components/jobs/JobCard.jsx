import { Link } from 'react-router-dom';
import { formatExperience, formatSalary } from '../../utils/constants';

export default function JobCard({ job, linkPrefix = '/jobs' }) {
  return (
    <Link
      to={`${linkPrefix}/${job.id}`}
      className="card group block transition hover:border-accent-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 group-hover:text-accent-600">
            {job.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-stone-600">{job.companyName}</p>
        </div>
        {job.isFeatured && (
          <span className="shrink-0 rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
            Featured
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-stone-500">
        <span className="rounded-md bg-surface-100 px-2 py-1">{job.location}</span>
        <span className="rounded-md bg-surface-100 px-2 py-1">
          {formatExperience(job.experienceLevel)}
        </span>
        {job.category?.name && (
          <span className="rounded-md bg-primary-50 px-2 py-1 text-primary-700">
            {job.category.name}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-accent-600">
        {formatSalary(job.salaryMin, job.salaryMax)}
      </p>
    </Link>
  );
}
