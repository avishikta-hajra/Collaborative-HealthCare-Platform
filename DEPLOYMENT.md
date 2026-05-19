# HealthBridge Deployment Guide

This project deploys as two apps:
- `frontend/` to Vercel
- `backend/` to Render

The live site updates later by pushing changes to GitHub. Vercel rebuilds the frontend, Render rebuilds the backend, and the deployed URLs refresh after those deployments finish.

## 1. Before You Deploy

Required stack:
- Node.js 18+
- Java 21
- PostgreSQL with `pgvector`

Important repo notes:
- The backend uses PostgreSQL, not MySQL.
- The backend requires `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, JWT secrets, Supabase values, and `OPENAI_API_KEY`.
- The frontend must know the deployed backend URL through `VITE_API_BASE_URL`.

## 2. Environment Variables

### Backend on Render

Set these in Render for the backend service:

```text
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
APP_ALLOWED_ORIGIN_PATTERNS=https://your-frontend-domain.vercel.app
```

If you also want local development to keep working, you can include localhost values too:

```text
APP_ALLOWED_ORIGIN_PATTERNS=http://localhost:5173,http://127.0.0.1:5173,https://your-frontend-domain.vercel.app
```

### Frontend on Vercel

Set these in Vercel for the frontend project:

```text
VITE_API_BASE_URL=https://your-render-backend.onrender.com
VITE_ZEGO_APP_ID=
VITE_ZEGO_SERVER_SECRET=
```

`VITE_ZEGO_APP_ID` and `VITE_ZEGO_SERVER_SECRET` are only needed if you want live video calling in the demo.

## 3. Deploy the Backend to Render

1. Open Render and create a new `Web Service`.
2. Connect the GitHub repo:
   `https://github.com/avishikta-hajra/Collaborative-HealthCare-Platform`
3. Use these settings:
   - Root Directory: `backend`
   - Runtime: `Java`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
   - Plan: `Free` is fine for lab/demo use
4. Add the backend environment variables listed above.
5. Deploy and wait for Render to generate a backend URL.

Quick checks after backend deploy:
- Open `https://your-render-backend.onrender.com/auth/login` in a REST client using a POST request.
- Open `https://your-render-backend.onrender.com/ws-telemedicine/info` in a browser. SockJS should return a JSON response when the service is healthy.

## 4. Deploy the Frontend to Vercel

1. Open Vercel and create a new project from the same GitHub repo.
2. Set the project root to `frontend`.
3. Use these build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add `VITE_API_BASE_URL` with the Render backend URL.
5. Add Zego env vars only if needed.
6. Deploy and wait for Vercel to generate a frontend URL.

Quick checks after frontend deploy:
- Open the Vercel URL and confirm the app loads.
- Test login/signup.
- Test at least one public API flow such as hospitals or ambulance listing.
- Open telemedicine and confirm WebSocket connection works from the deployed frontend domain.

## 5. How Future Changes Reach the Website

Once GitHub is connected to both platforms:

1. Make code changes locally.
2. Push to the connected branch on GitHub.
3. Vercel automatically redeploys the frontend if frontend code changed.
4. Render automatically redeploys the backend if backend code changed.
5. After those deploys complete, the live website shows the new version.

Notes:
- Frontend-only changes need only the Vercel deploy to finish.
- Backend-only changes need only the Render deploy to finish.
- Full-stack changes need both deployments to finish.
- On Render free tier, the backend may sleep after inactivity. The first request after idle can take a little longer.

## 6. Local Build Checks

Frontend:

```bash
cd frontend
npm ci
npm run build
```

Backend:

```bash
cd backend
./mvnw clean package -DskipTests
```

## 7. Team Workflow

Recommended team flow:
- Keep GitHub as the source of truth.
- Merge or push changes to the branch connected to Vercel and Render.
- Watch both deployment dashboards after important pushes.
- If the frontend stops talking to the backend, first verify:
  - `VITE_API_BASE_URL`
  - `APP_ALLOWED_ORIGIN_PATTERNS`
  - backend service health on Render
