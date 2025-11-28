# JobSeek – Full-Stack Job Portal

JobSeek is a full-stack job portal where applicants can find and apply to jobs, and companies can post jobs, review applicants, and manage application statuses.

This repo contains both the React frontend (Vite + Tailwind) and the Node/Express + MongoDB backend. You can deploy everything in a single Vercel project, or keep the frontend on Vercel and run the backend on Render (recommended for an always-on API).

---

## Features

- **Authentication**
  - Email/password signup and login
  - Applicant and Company roles
  - JWT-based auth with persisted sessions

- **Applicants**
  - Browse all jobs and view detailed descriptions
  - Apply to jobs with a cover letter
  - See application status grouped as **Ongoing** vs **Completed**
  - Withdraw an application
  - Manage profile information

- **Companies**
  - Post new jobs
  - See all jobs they created and their metrics
  - View all applicants for a specific job
  - Update application status (pending, reviewed, accepted, rejected)
  - See total applications and job views

- **Tech Stack**
  - **Frontend:** React 18, Vite, React Router, Tailwind CSS
  - **Backend:** Node.js, Express, Mongoose
  - **Database:** MongoDB Atlas
  - **Deployment:** Vercel (frontend + backend via serverless API)

---

## Project Structure

```txt
.
├─ src/                # React SPA
│  ├─ pages/           # Landing, Login, Signup, Applicant & Company pages
│  ├─ context/         # Auth & Toast contexts
│  ├─ components/      # Shared layout and UI components
│  └─ main.tsx         # App entry
├─ server/             # Express backend
│  ├─ models/          # Mongoose models (User, Job, Application)
│  ├─ routes/          # auth, jobs, applications, profile
│  ├─ app.js           # Express app (used by Vercel & local dev)
│  └─ index.js         # Local dev server entry
├─ api/
│  └─ server.js        # Vercel serverless entry wrapping Express app
├─ vite.config.ts      # Vite config
└─ README.md
```

---

## Environment Variables

### Root (Frontend)

Create a `.env` file in the project root for local development:

```bash
VITE_API_URL=http://localhost:4000
```

On Vercel, set the following **Environment Variables** in the project settings:

- `VITE_API_URL` = `/api`

### Backend (`server/.env` on local, Vercel/Render env in production)

```bash
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

On Vercel/Render, define **MONGODB_URI** and **JWT_SECRET** in the project’s Environment Variables panel.

---

## Local Development

### 1. Install Dependencies

From the project root:

```bash
npm install
cd server
npm install
cd ..
```

### 2. Run Backend (Local)

```bash
cd server
node index.js
```

The backend will start on `http://localhost:4000`.

### 3. Run Frontend (Local)

In another terminal, from the project root:

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

Make sure your root `.env` has `VITE_API_URL=http://localhost:4000` so the frontend talks to the local backend.

---

## Deployment Options

### Option A – Frontend on Vercel, Backend on Render (recommended)

1. Push this repository to GitHub.
2. **Render backend**
  - Create a Web Service → connect this repo → select the `server` directory as the root.
  - Build command: `npm install`
  - Start command: `npm start`
  - Environment variables:
    - `MONGODB_URI`
    - `JWT_SECRET`
  - Render automatically injects `PORT`; the backend already reads `process.env.PORT`.
  - Optional: use the provided `render.yaml` for one-click setup.
3. Copy the Render service URL (e.g. `https://jobseek-backend.onrender.com`).
4. **Vercel frontend**
  - New Project → import repo.
  - Root directory: project root.
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variables:
    - `VITE_API_URL` = `https://jobseek-backend.onrender.com`
5. Deploy. Verify:
  - Frontend: `https://your-frontend.vercel.app`
  - Backend health: `https://jobseek-backend.onrender.com/health`

### Option B – Everything on a single Vercel project

- `server/app.js` defines the Express app and connects to MongoDB.
- `api/server.js` exports that app so Vercel can run it as a serverless function.
- Set frontend env `VITE_API_URL=/api` so API calls hit the co-located backend.
- After deploying, test:
  - `https://your-app.vercel.app` – frontend UI
  - `https://your-app.vercel.app/api/health` – backend health check

---

## Scripts

From the project root:

- `npm run dev` – Run the Vite dev server for the frontend
- `npm run build` – Build the frontend for production
- `npm run preview` – Preview the production build locally

From the `server/` folder:

- `npm run dev` – Run backend with nodemon (auto-restart)
- `npm start` – Run backend with Node

---

## Notes

- The backend is designed to be stateless and works well as a serverless API on Vercel.
- All dynamic data (users, jobs, applications) is stored in MongoDB Atlas; there is no mock data.
- Application statuses are grouped on the frontend so applicants see clear **Ongoing** vs **Completed** states, and companies have accurate metrics.

If you extend JobSeek (e.g., add search, notifications, or analytics), you can update this README with new features and deployment notes.
