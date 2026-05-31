import pool from '../config/db.js';
import { AppError } from '../utils/errors.js';

export const applyToJob = async (jobId, userId, coverLetter) => {
  const job = await pool.query(
    "SELECT id FROM jobs WHERE id = $1 AND status = 'published'",
    [jobId]
  );
  if (!job.rows[0]) throw new AppError('Job not available for applications', 404);

  const existing = await pool.query(
    'SELECT id FROM applications WHERE job_id = $1 AND user_id = $2',
    [jobId, userId]
  );
  if (existing.rows[0]) {
    throw new AppError('You have already applied to this job', 409);
  }

  const { rows } = await pool.query(
    `INSERT INTO applications (job_id, user_id, cover_letter)
     VALUES ($1, $2, $3)
     RETURNING id, job_id, user_id, cover_letter, status, applied_at`,
    [jobId, userId, coverLetter]
  );

  return {
    id: rows[0].id,
    jobId: rows[0].job_id,
    userId: rows[0].user_id,
    coverLetter: rows[0].cover_letter,
    status: rows[0].status,
    appliedAt: rows[0].applied_at,
  };
};

export const getUserApplicationForJob = async (jobId, userId) => {
  const { rows } = await pool.query(
    `SELECT id, job_id, status, applied_at FROM applications
     WHERE job_id = $1 AND user_id = $2`,
    [jobId, userId]
  );
  return rows[0] || null;
};
