import { EXPERIENCE_LEVELS } from '../../utils/constants';

export default function JobFilters({
  filters,
  categories,
  onChange,
  onReset,
  showStatus = false,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value, page: 1 });
  };

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Filters</h3>
        <button type="button" onClick={onReset} className="text-sm text-primary-600 hover:underline">
          Reset
        </button>
      </div>
      <div>
        <label className="label-text">Search</label>
        <input
          type="text"
          name="search"
          value={filters.search || ''}
          onChange={handleChange}
          placeholder="Job title, company..."
          className="input-field"
        />
      </div>
      <div>
        <label className="label-text">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location || ''}
          onChange={handleChange}
          placeholder="City or Remote"
          className="input-field"
        />
      </div>
      <div>
        <label className="label-text">Category</label>
        <select
          name="categoryId"
          value={filters.categoryId || ''}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-text">Experience Level</label>
        <select
          name="experienceLevel"
          value={filters.experienceLevel || ''}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">All levels</option>
          {EXPERIENCE_LEVELS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-text">Min Salary</label>
        <input
          type="number"
          name="salaryMin"
          value={filters.salaryMin || ''}
          onChange={handleChange}
          placeholder="50000"
          className="input-field"
          min="0"
        />
      </div>
      {showStatus && (
        <div>
          <label className="label-text">Status</label>
          <select
            name="status"
            value={filters.status || ''}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}
      <div>
        <label className="label-text">Sort By</label>
        <select
          name="sortBy"
          value={filters.sortBy || 'created_at'}
          onChange={handleChange}
          className="input-field"
        >
          <option value="created_at">Date Posted</option>
          <option value="title">Title</option>
          <option value="salary_max">Salary</option>
        </select>
      </div>
    </div>
  );
}
