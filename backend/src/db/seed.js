import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = path.join(__dirname, '../../seeds');

async function runSqlFile(client, file) {
  const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8').trim();
  if (sql) await client.query(sql);
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await runSqlFile(client, '001_categories.sql');

    const adminHash = await bcrypt.hash('Admin@123', 10);
    const userHash = await bcrypt.hash('User@123', 10);

    await client.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, 'admin'), ($4, $5, $6, 'user')
       ON CONFLICT (email) DO NOTHING`,
      [
        'admin@jobportal.com',
        adminHash,
        'Portal Admin',
        'user@jobportal.com',
        userHash,
        'Demo User',
      ]
    );

    const { rows: adminRows } = await client.query(
      "SELECT id FROM users WHERE email = 'admin@jobportal.com'"
    );
    const adminId = adminRows[0]?.id;

    const { rows: cats } = await client.query('SELECT id, slug FROM categories');
    const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

    const jobCount = await client.query('SELECT COUNT(*)::int AS c FROM jobs');
    if (jobCount.rows[0].c === 0 && adminId) {
      const sampleJobs = [
        {
          title: 'Senior Full Stack Developer',
          description:
            'Build scalable web applications using React and Node.js. Lead technical decisions and mentor junior developers.',
          requirements: '5+ years experience, React, Node.js, PostgreSQL',
          company: 'TechNova Inc',
          location: 'Remote',
          salary_min: 90000,
          salary_max: 130000,
          category: 'engineering',
          experience: 'senior',
          featured: true,
        },
        {
          title: 'UI/UX Designer',
          description:
            'Design intuitive user experiences for our job platform and mobile apps.',
          requirements: 'Figma, design systems, user research',
          company: 'Creative Labs',
          location: 'New York, NY',
          salary_min: 70000,
          salary_max: 95000,
          category: 'design',
          experience: 'mid',
          featured: true,
        },
        {
          title: 'Digital Marketing Specialist',
          description:
            'Drive growth through SEO, content marketing, and paid campaigns.',
          requirements: 'Google Ads, analytics, content strategy',
          company: 'GrowthHive',
          location: 'Austin, TX',
          salary_min: 55000,
          salary_max: 75000,
          category: 'marketing',
          experience: 'junior',
          featured: true,
        },
        {
          title: 'Sales Executive',
          description: 'Manage enterprise client relationships and exceed revenue targets.',
          requirements: 'B2B sales, CRM, negotiation',
          company: 'SalesForce Pro',
          location: 'Chicago, IL',
          salary_min: 60000,
          salary_max: 90000,
          category: 'sales',
          experience: 'mid',
          featured: false,
        },
        {
          title: 'Product Manager',
          description: 'Own product roadmap for our hiring platform features.',
          requirements: 'Agile, stakeholder management, analytics',
          company: 'ProductFirst',
          location: 'San Francisco, CA',
          salary_min: 100000,
          salary_max: 140000,
          category: 'product',
          experience: 'senior',
          featured: true,
        },
        {
          title: 'Junior Frontend Developer',
          description: 'Work with React and Tailwind to ship user-facing features.',
          requirements: 'React basics, HTML/CSS, eagerness to learn',
          company: 'StartupHub',
          location: 'Remote',
          salary_min: 45000,
          salary_max: 60000,
          category: 'engineering',
          experience: 'entry',
          featured: false,
        },
        {
          title: 'HR Coordinator',
          description: 'Support recruitment and employee onboarding processes.',
          requirements: 'Communication, ATS tools, organization',
          company: 'PeopleWorks',
          location: 'Boston, MA',
          salary_min: 45000,
          salary_max: 55000,
          category: 'human-resources',
          experience: 'junior',
          featured: false,
        },
        {
          title: 'Financial Analyst',
          description: 'Analyze financial data and support budgeting decisions.',
          requirements: 'Excel, financial modeling, attention to detail',
          company: 'FinanceCore',
          location: 'Dallas, TX',
          salary_min: 65000,
          salary_max: 85000,
          category: 'finance',
          experience: 'mid',
          featured: false,
        },
      ];

      for (const job of sampleJobs) {
        await client.query(
          `INSERT INTO jobs (
            title, description, requirements, company_name, location,
            salary_min, salary_max, category_id, experience_level,
            status, is_featured, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'published',$10,$11)`,
          [
            job.title,
            job.description,
            job.requirements,
            job.company,
            job.location,
            job.salary_min,
            job.salary_max,
            catMap[job.category],
            job.experience,
            job.featured,
            adminId,
          ]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Seed data applied successfully.');
    console.log('Admin: admin@jobportal.com / Admin@123');
    console.log('User:  user@jobportal.com / User@123');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
