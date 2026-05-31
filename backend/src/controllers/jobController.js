import { asyncHandler } from '../utils/errors.js';
import * as jobService from '../services/jobService.js';
import * as applicationService from '../services/applicationService.js';

export const listPublicJobs = asyncHandler(async (req, res) => {
  const data = await jobService.listJobs(req.query, { forPublic: true });
  res.json({ success: true, data });
});

export const getPublicJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id, { forPublic: true });
  let application = null;
  if (req.user) {
    application = await applicationService.getUserApplicationForJob(
      req.params.id,
      req.user.id
    );
  }
  res.json({ success: true, data: { job, application } });
});

export const getFeaturedJobs = asyncHandler(async (req, res) => {
  const data = await jobService.listJobs(
    { ...req.query, isFeatured: true, limit: 6 },
    { forPublic: true }
  );
  res.json({ success: true, data: data.jobs });
});

export const getCategoryJobs = asyncHandler(async (req, res) => {
  const data = await jobService.getJobsByCategory();
  res.json({ success: true, data });
});

export const listCategories = asyncHandler(async (req, res) => {
  const data = await jobService.listCategories();
  res.json({ success: true, data });
});

export const adminListJobs = asyncHandler(async (req, res) => {
  const data = await jobService.listJobs(req.query);
  res.json({ success: true, data });
});

export const adminGetJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  res.json({ success: true, data: job });
});

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user.id);
  res.status(201).json({ success: true, data: job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.body);
  res.json({ success: true, data: job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id);
  res.json({ success: true, message: 'Job deleted' });
});

export const dashboardStats = asyncHandler(async (req, res) => {
  const data = await jobService.getDashboardStats();
  res.json({ success: true, data });
});

export const applyToJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyToJob(
    req.params.id,
    req.user.id,
    req.body.coverLetter
  );
  res.status(201).json({ success: true, data: application });
});
