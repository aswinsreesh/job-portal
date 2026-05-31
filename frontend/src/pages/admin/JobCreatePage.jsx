import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import JobForm from '../../components/jobs/JobForm';
import { createJob } from '../../store/slices/jobsSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';

export default function JobCreatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saving, error } = useSelector((s) => s.jobs);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (data) => {
    const result = await dispatch(createJob(data));
    if (createJob.fulfilled.match(result)) {
      navigate('/admin/jobs');
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Create Job</h2>
      <JobForm onSubmit={handleSubmit} saving={saving} error={error} />
    </div>
  );
}
