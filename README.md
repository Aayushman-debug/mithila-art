# Mithila Art

This repository contains the Mithila Art frontend built with Vite + React and a backend Express API in `/backend`.

## Local setup

1. Install dependencies in both root and backend:
   ```bash
   cd mithila-art
   npm install
   cd backend
   npm install
   ```

2. Copy the sample environment file and set your values:
   ```bash
   cp .env.example .env
   ```

3. Run the frontend and backend locally:
   ```bash
   npm run dev
   cd backend
   npm run dev
   ```

## Environment variables

### Frontend
- `VITE_API_BASE_URL` — backend base URL, for example `http://localhost:5000` or `https://your-backend.onrender.com`

### Backend
- `PORT` — backend port (default `5000`)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — API secret for future auth
- `RAZORPAY_KEY_ID` — Razorpay API key id
- `RAZORPAY_KEY_SECRET` — Razorpay secret key
- `FRONTEND_URL` — frontend origin for CORS, e.g. `https://your-site.netlify.app`

## Deployment notes

- Frontend deploys to Netlify using `npm run build` and publishes the `dist/` folder.
- Backend deploys to Render from the `/backend` folder and uses `npm start`.
- Razorpay secrets must be configured in Render environment variables and never pushed to GitHub.
- The frontend now uses `VITE_API_BASE_URL` for backend API calls.
