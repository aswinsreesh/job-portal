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

const formatApplicationRow = (row) => ({
  id: row.id,
  jobId: row.job_id,
  userId: row.user_id,
  coverLetter: row.cover_letter,
  status: row.status,
  appliedAt: row.applied_at,
  job: {
    id: row.job_id,
    title: row.job_title,
    companyName: row.company_name,
    status: row.job_status,
  },
  applicant: {
    id: row.user_id,
    fullName: row.full_name,
    email: row.email,
  },
});

export const listApplications = async (filters = {}) => {
  const page = Math.max(1, parseInt(filters.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(filters.limit, 10) || 10));
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];
  let idx = 1;

  if (filters.jobId) {
    conditions.push(`a.job_id = $${idx++}`);
    params.push(Number(filters.jobId));
  }
  if (filters.status) {
    conditions.push(`a.status = $${idx++}`);
    params.push(filters.status);
  }
  if (filters.search) {
    conditions.push(
      `(u.full_name ILIKE $${idx} OR u.email ILIKE $${idx} OR j.title ILIKE $${idx})`
    );
    params.push(`%${filters.search}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    JOIN users u ON u.id = a.user_id
    ${where}
  `;
  const { rows: countRows } = await pool.query(countQuery, params);
  const total = countRows[0].total;

  const dataQuery = `
    SELECT
      a.id, a.job_id, a.user_id, a.cover_letter, a.status, a.applied_at,
      j.title AS job_title, j.company_name, j.status AS job_status,
      u.full_name, u.email
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    JOIN users u ON u.id = a.user_id
    ${where}
    ORDER BY a.applied_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  const { rows } = await pool.query(dataQuery, [...params, limit, offset]);

  return {
    applications: rows.map(formatApplicationRow),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const updateApplicationStatus = async (id, status) => {
  const { rows } = await pool.query(
    `UPDATE applications SET status = $1
     WHERE id = $2
     RETURNING id, job_id, user_id, cover_letter, status, applied_at`,
    [status, id]
  );
  if (!rows[0]) throw new AppError('Application not found', 404);

  const detail = await pool.query(
    `SELECT
      a.id, a.job_id, a.user_id, a.cover_letter, a.status, a.applied_at,
      j.title AS job_title, j.company_name, j.status AS job_status,
      u.full_name, u.email
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    JOIN users u ON u.id = a.user_id
    WHERE a.id = $1`,
    [id]
  );
  return formatApplicationRow(detail.rows[0]);
};
