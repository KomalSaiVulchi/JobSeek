# JobSeek MERN Server

Express + MongoDB (via Mongoose) backend for JobSeek.

## Setup

1. Copy env example and fill in your Atlas URI:

```bash
cd server
cp .env.example .env
```

Edit `.env`:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=some-strong-secret
PORT=4000
```

2. Install deps and run dev server:

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:4000`.

## Endpoints (initial)

- `POST /auth/signup` { email, password, name, role }
- `POST /auth/login` { email, password }
- `GET /jobs`
- `POST /jobs` { title, description, company, location }

New endpoints:
- `POST /applications` { job_id, resume, cover_letter } (authenticated)
- `GET /applications` (authenticated)
- `POST /jobs` is now authenticated (use JWT)

