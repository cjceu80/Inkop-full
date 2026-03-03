# Full-stack app: React + Node/Express + Postgres (Docker)

## Stack

- **Frontend**: React + TypeScript (Vite) in `frontend/`
- **Backend**: Node.js + Express + TypeScript in `backend/`
- **Database**: Postgres (Docker) via `docker-compose.yml`
- **Auth**: Firebase Authentication (client SDK in frontend, Admin SDK in backend)
- **Web server / proxy**: Nginx inside the `frontend` Docker image for static files + `/api` reverse proxy

You **do not strictly need Nginx** to run this stack, but it is used here for production-like Docker setup:

- Serves the built React app as static files.
- Proxies `/api` requests to the backend service.

For local dev you can run without Docker and use the Vite dev server.

## Local development (no Docker)

### 1. Start Postgres (optional via Docker)

From the project root:

```bash
docker compose up -d db
```

Create a `.env` file based on `.env.example` and ensure `DATABASE_URL` matches the `db` container (already set correctly for Docker).

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:4000` and exposes `GET /api/health`.

Firebase Auth:

- Make sure you have a Google Cloud service account for Firebase Admin.
- Set `GOOGLE_APPLICATION_CREDENTIALS` to point to that JSON file (see `.env.example`).
- Once configured, the backend exposes `GET /api/protected`, which requires a valid Firebase ID token in the `Authorization: Bearer <token>` header.

### 3. Start the frontend (Vite dev server)

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and:

- Uses a Vite dev proxy so `/api/*` is forwarded to `http://localhost:4000`.
- Has:
  - A button in `App.tsx` that calls `/api/health` and shows the response.
  - Basic Firebase anonymous sign-in/sign-out.
  - A button to call the protected `/api/protected` endpoint using the current user's Firebase ID token.

To configure Firebase on the frontend, create `frontend/.env` with keys from your Firebase project:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Full stack with Docker (production-like)

From the project root:

```bash
cp .env.example .env  # or create your own values
docker compose up --build
```

This starts:

- `db`: Postgres on port `5432`.
- `backend`: Node/Express API on internal port `4000` (exposed as `localhost:4000`).
- `frontend`: Nginx serving the built React app on `http://localhost:8080`, proxying `/api` to the backend.

You can then open `http://localhost:8080` in the browser and click the button to call `/api/health` through Nginx.

For Firebase Admin inside Docker, mount your service account JSON and set `GOOGLE_APPLICATION_CREDENTIALS` in the `backend` service environment to the path of that file.

