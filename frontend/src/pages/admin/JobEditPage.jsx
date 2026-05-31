import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import JobForm from '../../components/jobs/JobForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { fetchAdminJob, updateJob } from '../../store/slices/jobsSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';

export default function JobEditPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, saving, error, detailLoading } = useSelector((s) => s.jobs);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAdminJob(id));
  }, [dispatch, id]);

  const handleSubmit = async (data) => {
    const result = await dispatch(updateJob({ id: Number(id), ...data }));
    if (updateJob.fulfilled.match(result)) {
      navigate('/admin/jobs');
    }
  };

  if (detailLoading && !current) {
    return <LoadingSpinner className="py-20" />;
  }

  const initialData = current
    ? {
        title: current.title,
        description: current.description,
        requirements: current.requirements || '',
        companyName: current.companyName,
        location: current.location,
        salaryMin: current.salaryMin || '',
        salaryMax: current.salaryMax || '',
        categoryId: current.category?.id || current.categoryId,
        experienceLevel: current.experienceLevel,
        status: current.status,
        isFeatured: current.isFeatured,
      }
    : null;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Edit Job</h2>
      {initialData ? (
        <JobForm
          key={id}
          initialData={initialData}
          onSubmit={handleSubmit}
          saving={saving}
          error={error}
        />
      ) : (
        <p className="text-slate-500">Job not found.</p>
      )}
    </div>
  );
}
