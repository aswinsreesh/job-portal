-- Migration: 003_create_jobs
CREATE TYPE experience_level AS ENUM (
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
  'executive'
);

CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed');

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  experience_level experience_level NOT NULL DEFAULT 'mid',
  status job_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_category ON jobs(category_id);
CREATE INDEX idx_jobs_experience ON jobs(experience_level);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_featured ON jobs(is_featured);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
