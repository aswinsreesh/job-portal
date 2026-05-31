import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import FormField from '../common/FormField';
import LoadingSpinner from '../common/LoadingSpinner';
import { EXPERIENCE_LEVELS, JOB_STATUSES } from '../../utils/constants';

export default function JobForm({ initialData, onSubmit, saving, error }) {
  const { list: categories } = useSelector((s) => s.categories);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      requirements: '',
      companyName: '',
      location: '',
      salaryMin: '',
      salaryMax: '',
      categoryId: '',
      experienceLevel: 'mid',
      status: 'draft',
      isFeatured: false,
    },
  });

  const submit = (data) => {
    onSubmit({
      ...data,
      categoryId: Number(data.categoryId),
      salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
      isFeatured: Boolean(data.isFeatured),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="card max-w-3xl">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Job Title" error={errors.title?.message} required className="sm:col-span-2">
          <input
            className="input-field"
            {...register('title', { required: 'Title is required' })}
          />
        </FormField>
        <FormField label="Company" error={errors.companyName?.message} required>
          <input
            className="input-field"
            {...register('companyName', { required: 'Company is required' })}
          />
        </FormField>
        <FormField label="Location" error={errors.location?.message} required>
          <input
            className="input-field"
            {...register('location', { required: 'Location is required' })}
          />
        </FormField>
        <FormField label="Category" error={errors.categoryId?.message} required>
          <select
            className="input-field"
            {...register('categoryId', { required: 'Category is required' })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Experience" error={errors.experienceLevel?.message} required>
          <select className="input-field" {...register('experienceLevel', { required: true })}>
            {EXPERIENCE_LEVELS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Salary Min">
          <input type="number" className="input-field" {...register('salaryMin')} />
        </FormField>
        <FormField label="Salary Max">
          <input type="number" className="input-field" {...register('salaryMax')} />
        </FormField>
        <FormField label="Status">
          <select className="input-field" {...register('status')}>
            {JOB_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Featured">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" {...register('isFeatured')} />
            <span className="text-sm text-slate-600">Show on homepage</span>
          </label>
        </FormField>
      </div>
      <FormField label="Description" error={errors.description?.message} required className="mt-4">
        <textarea
          rows={5}
          className="input-field"
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 20, message: 'At least 20 characters' },
          })}
        />
      </FormField>
      <FormField label="Requirements" className="mt-4">
        <textarea rows={3} className="input-field" {...register('requirements')} />
      </FormField>
      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <LoadingSpinner size="sm" /> : 'Save Job'}
        </button>
      </div>
    </form>
  );
}
