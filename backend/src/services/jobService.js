import pool from '../config/db.js';
import { AppError } from '../utils/errors.js';

const jobFields = `
  j.id, j.title, j.description, j.requirements, j.company_name, j.location,
  j.salary_min, j.salary_max, j.experience_level, j.status, j.is_featured,
  j.created_at, j.updated_at,
  c.id AS category_id, c.name AS category_name, c.slug AS category_slug
`;

const buildJobFilters = (filters, forPublic = false) => {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (forPublic) {
    conditions.push(`j.status = 'published'`);
  } else if (filters.status) {
    conditions.push(`j.status = $${idx++}`);
    params.push(filters.status);
  }

  if (filters.categoryId) {
    conditions.push(`j.category_id = $${idx++}`);
    params.push(filters.categoryId);
  }
  if (filters.categorySlug) {
    conditions.push(`c.slug = $${idx++}`);
    params.push(filters.categorySlug);
  }
  if (filters.experienceLevel) {
    conditions.push(`j.experience_level = $${idx++}`);
    params.push(filters.experienceLevel);
  }
  if (filters.isFeatured === 'true' || filters.isFeatured === true) {
    conditions.push(`j.is_featured = TRUE`);
  }
  if (filters.search) {
    conditions.push(
      `(j.title ILIKE $${idx} OR j.company_name ILIKE $${idx} OR j.location ILIKE $${idx})`
    );
    params.push(`%${filters.search}%`);
    idx++;
  }
  if (filters.location) {
    conditions.push(`j.location ILIKE $${idx++}`);
    params.push(`%${filters.location}%`);
  }
  if (filters.salaryMin) {
    conditions.push(`j.salary_max >= $${idx++}`);
    params.push(Number(filters.salaryMin));
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params, nextIdx: idx };
};

export const listJobs = async (filters = {}, { forPublic = false } = {}) => {
  const page = Math.max(1, parseInt(filters.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(filters.limit, 10) || 10));
  const offset = (page - 1) * limit;
  const sortBy = ['created_at', 'salary_max'].includes(filters.sortBy)
    ? filters.sortBy
    : 'created_at';
  const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';

  const { where, params, nextIdx } = buildJobFilters(filters, forPublic);

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM jobs j
    JOIN categories c ON c.id = j.category_id
    ${where}
  `;
  const { rows: countRows } = await pool.query(countQuery, params);
  const total = countRows[0].total;

  const dataQuery = `
    SELECT ${jobFields}
    FROM jobs j
    JOIN categories c ON c.id = j.category_id
    ${where}
    ORDER BY j.${sortBy} ${sortOrder}
    LIMIT $${nextIdx} OFFSET $${nextIdx + 1}
  `;
  const { rows } = await pool.query(dataQuery, [...params, limit, offset]);

  return {
    jobs: rows.map(formatJob),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getJobById = async (id, { forPublic = false } = {}) => {
  const statusClause = forPublic ? "AND j.status = 'published'" : '';
  const { rows } = await pool.query(
    `SELECT ${jobFields}
     FROM jobs j
     JOIN categories c ON c.id = j.category_id
     WHERE j.id = $1 ${statusClause}`,
    [id]
  );
  if (!rows[0]) throw new AppError('Job not found', 404);
  return formatJob(rows[0]);
};

export const createJob = async (data, adminId) => {
  const { rows } = await pool.query(
    `INSERT INTO jobs (
      title, description, requirements, company_name, location,
      salary_min, salary_max, category_id, experience_level,
      status, is_featured, created_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING id`,
    [
      data.title,
      data.description,
      data.requirements || null,
      data.companyName,
      data.location,
      data.salaryMin ?? null,
      data.salaryMax ?? null,
      data.categoryId,
      data.experienceLevel,
      data.status || 'draft',
      data.isFeatured || false,
      adminId,
    ]
  );
  return getJobById(rows[0].id);
};

export const updateJob = async (id, data) => {
  await getJobById(id);
  const { rows } = await pool.query(
    `UPDATE jobs SET
      title = $1,
      description = $2,
      requirements = $3,
      company_name = $4,
      location = $5,
      salary_min = $6,
      salary_max = $7,
      category_id = $8,
      experience_level = $9,
      status = $10,
      is_featured = $11,
      updated_at = NOW()
    WHERE id = $12 RETURNING id`,
    [
      data.title,
      data.description,
      data.requirements || null,
      data.companyName,
      data.location,
      data.salaryMin ?? null,
      data.salaryMax ?? null,
      data.categoryId,
      data.experienceLevel,
      data.status,
      data.isFeatured ?? false,
      id,
    ]
  );
  if (!rows[0]) throw new AppError('Job not found', 404);
  return getJobById(id);
};

export const deleteJob = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
  if (!rowCount) throw new AppError('Job not found', 404);
};

export const getDashboardStats = async () => {
  const { rows } = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM jobs) AS total_jobs,
      (SELECT COUNT(*)::int FROM jobs WHERE status = 'published') AS published_jobs,
      (SELECT COUNT(*)::int FROM jobs WHERE status = 'draft') AS draft_jobs,
      (SELECT COUNT(*)::int FROM users WHERE role = 'user') AS total_users,
      (SELECT COUNT(*)::int FROM applications) AS total_applications
  `);
  return rows[0];
};

export const listCategories = async () => {
  const { rows } = await pool.query(
    'SELECT id, name, slug FROM categories ORDER BY name'
  );
  return rows;
};

export const getJobsByCategory = async () => {
  const { rows } = await pool.query(`
    SELECT c.id, c.name, c.slug,
      COALESCE(
        json_agg(
          json_build_object(
            'id', j.id,
            'title', j.title,
            'companyName', j.company_name,
            'location', j.location,
            'experienceLevel', j.experience_level,
            'salaryMin', j.salary_min,
            'salaryMax', j.salary_max
          ) ORDER BY j.created_at DESC
        ) FILTER (WHERE j.id IS NOT NULL),
        '[]'
      ) AS jobs
    FROM categories c
    LEFT JOIN jobs j ON j.category_id = c.id AND j.status = 'published'
    GROUP BY c.id, c.name, c.slug
    ORDER BY c.name
  `);
  return rows.map((r) => ({
    ...r,
    jobs: (r.jobs || []).slice(0, 4),
  }));
};

const formatJob = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  requirements: row.requirements,
  companyName: row.company_name,
  location: row.location,
  salaryMin: row.salary_min,
  salaryMax: row.salary_max,
  experienceLevel: row.experience_level,
  status: row.status,
  isFeatured: row.is_featured,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  category: {
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug,
  },
});
