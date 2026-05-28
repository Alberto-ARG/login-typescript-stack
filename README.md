# Auth Demo - Next.js + SQLite + Astro/React

A complete login example with **two separate apps**:

| Folder     | Stack                                 | Port | Role                            |
| ---------- | ------------------------------------- | ---- | ------------------------------- |
| `backend/` | Next.js 15 (App Router) + SQLite      | 3000 | Authentication API + data layer |
| `frontend/`| Astro 5 + React 19                    | 4321 | UI (login, register, dashboard) |

## How Authentication Works

1. The user submits email/password to the backend.
2. The backend validates credentials against SQLite (passwords are hashed with **bcrypt**).
3. If valid, the backend signs a **JWT (jose, HS256)** and returns it in an
   **httpOnly** cookie (`auth_token`) so browser JS cannot read it (helps against XSS).
4. Protected routes (`/api/auth/me`) read and verify that cookie.

The Astro frontend **proxies `/api` to the backend** (see `astro.config.mjs`),
so from the browser perspective everything stays on the same origin.
That keeps the cookie first-party (`SameSite=Lax`) and avoids CORS setup.

## Run Locally (Without Docker)

You need **two terminals**.

### 1) Backend

```bash
cd backend
npm install
npm run dev        # http://localhost:3000
```

On first run it creates `backend/data/app.db` and seeds a demo user:

```text
admin@demo.com / 123456
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:4321
```

Open **http://localhost:4321** and sign in with the demo user (or register a new one).

## Backend Endpoints

| Method | Route                | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/auth/register` | Creates a user and starts a session  |
| POST   | `/api/auth/login`    | Validates credentials and sets cookie|
| POST   | `/api/auth/logout`   | Clears the session cookie            |
| GET    | `/api/auth/me`       | Returns current user (protected)     |

## Production Notes

- Set `JWT_SECRET` to a long, random value.
- In production, the cookie is marked `Secure` automatically (requires HTTPS).
- The dashboard guard is client-side in this demo.
  For stronger protection, also validate session server-side
  (for example with Next.js middleware or Astro SSR forwarding cookies).

## Docker + Nginx (Single Public Port)

There is an `nginx` service in front exposing **only one host port**:

- `nginx`: `http://localhost` (port 80)
- `frontend`: internal at `frontend:4321` (not exposed to host)
- `backend`: internal at `backend:3000` (not exposed to host)

Start everything:

```bash
docker compose up --build
```

Open the app at:

```text
http://localhost
```
