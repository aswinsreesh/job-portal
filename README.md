# Job Portal Management System

A full-stack job portal with separate **Admin** and **User** portals. Admins manage job postings; users browse, filter, and apply for jobs.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router, React Hook Form |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT access tokens + HTTP-only refresh tokens |

## Project Structure

```
job-portal/
├── backend/
│   ├── migrations/          # SQL database migrations
│   ├── seeds/               # Master/seed data
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validators/
│   └── .env.example
├── frontend/
│   └── src/
│       ├── api/             # Axios client + token refresh
│       ├── components/      # Reusable UI components
│       ├── pages/           # User & admin pages
│       └── store/           # Redux slices
└── README.md
```

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd job-portal
```

### 2. Database setup

Create a PostgreSQL database:

```sql
CREATE DATABASE job_portal;
```

### 3. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set your `DATABASE_URL` and JWT secrets.

```bash
npm install
npm run migrate
npm run seed
npm run dev
```

API runs at **http://localhost:5000**

### 4. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at **http://localhost:5173**

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jobportal.com | Admin@123 |
| User | user@jobportal.com | User@123 |

## Features

### Admin Portal (`/admin/login`)

- Login with JWT access + refresh tokens
- Dashboard with job/user/application stats
- Job CRUD (create, edit, list, delete)
- Filtering by category, experience level, status
- Pagination on job listings
- Form validation and error states
- All data via Redux + REST API

### User Portal

- Landing page: header, featured jobs, jobs by category, footer
- Job listing with advanced filters (search, location, category, experience, salary)
- Pagination
- User registration & login
- Job detail page (API-driven) with apply form for logged-in users
- Redux-managed state for all API operations

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET | `/api/jobs/public` | Public job list (filters + pagination) |
| GET | `/api/jobs/public/:id` | Job detail |
| POST | `/api/jobs/public/:id/apply` | Apply to job (user) |
| GET | `/api/jobs/admin` | Admin job list |
| POST | `/api/jobs/admin` | Create job |
| PUT | `/api/jobs/admin/:id` | Update job |
| DELETE | `/api/jobs/admin/:id` | Delete job |
| GET | `/api/jobs/admin/stats` | Dashboard stats |

## Environment Variables

### Backend (`backend/.env`)

See `backend/.env.example` for all variables:

- `PORT`, `DATABASE_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `CLIENT_URL`

### Frontend (`frontend/.env`)

- `VITE_API_URL` — API base URL (default uses Vite proxy to `localhost:5000`)

## Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with watch |
| `npm run migrate` | Run SQL migrations |
| `npm run seed` | Seed categories, users, sample jobs |
| `npm start` | Production start |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## License

MIT
