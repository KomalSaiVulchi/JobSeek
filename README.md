# JobSeek – Full-Stack Job Portal

JobSeek is a full-stack job portal where applicants can find and apply to jobs, and companies can post jobs, review applicants, and manage application statuses.

This repo contains both the React frontend (Vite + Tailwind) and the Node/Express + MongoDB backend, deployed together on Vercel.

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

### Backend (`server/.env` on local, Vercel project env in production)

```bash
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

On Vercel, define **MONGODB_URI** and **JWT_SECRET** in the same project’s Environment Variables.

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

## Deployment on Vercel

This repo is structured so both frontend and backend deploy on Vercel in a single project.

### Backend on Vercel (Serverless API)

- `server/app.js` defines the Express app and connects to MongoDB.
- `api/server.js` exports that app so Vercel can run it as a serverless function.
- The backend is automatically exposed under the `/api` path on your Vercel domain.

Example routes in production:

- `GET https://your-app.vercel.app/api/health`
- `POST https://your-app.vercel.app/api/auth/login`
- `GET https://your-app.vercel.app/api/jobs`

### Frontend on Vercel

- Vercel builds the React app using Vite:
  - **Build command:** `npm run build`
  - **Output directory:** `dist`
- The SPA is served from the root of `https://your-app.vercel.app`.
- The frontend uses `VITE_API_URL=/api` so all API calls go to the same Vercel project’s backend.

### Steps to Deploy

1. Push this repository to GitHub.
2. In Vercel, click **New Project** and import the GitHub repo.
3. Framework preset: **Vite**.
4. Set **Build & Output**:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variables in Vercel:
   - `MONGODB_URI` – your Atlas URI
   - `JWT_SECRET` – secret for signing JWTs
   - `VITE_API_URL` – `/api`
6. Deploy. Once complete, test:
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
