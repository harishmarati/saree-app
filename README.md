# Saree Inventory App

Full-stack app to track saree inventory and pricing: name, description, image URL,
original price, exchange rate, additional charges, margin %, and the computed final price.

## Structure

- `backend/` — Express + TypeScript + SQLite via `@libsql/client` (local file for dev, [Turso](https://turso.tech) for production) REST API
- `frontend/` — React + Redux Toolkit + MUI

## Pricing formula

```
landedCost = originalPrice * exchangeRate + additionalCharges
finalPrice = landedCost * (1 + marginPercentage / 100)
```

`finalPrice` is computed server-side on every create/update and stored alongside
`createdAt` / `updatedAt` timestamps.

## Running locally

Backend (http://localhost:4000). With no `.env` file, it uses a local SQLite file
(`backend/saree.db`) automatically — no Turso account needed for local dev:

```
cd backend
npm install
npm run dev
```

Frontend (http://localhost:5173, proxies `/api` to the backend):

```
cd frontend
npm install
npm run dev
```

## Deploying (Turso + Render + Vercel)

### 1. Database — Turso

Install the Turso CLI and create a free database (run these yourself, since login
is interactive):

```
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create saree-app
turso db show saree-app --url
turso db tokens create saree-app
```

Keep the URL (starts with `libsql://`) and the token — you'll set them as Render env vars.

### 2. Backend — Render

This repo includes `render.yaml` at the root, so you can use Render's "New Blueprint"
option pointed at your GitHub repo, or create a Web Service manually with:

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`

Either way, set these environment variables on the Render service:

- `TURSO_DATABASE_URL` — the `libsql://...` URL from step 1
- `TURSO_AUTH_TOKEN` — the token from step 1
- `CORS_ORIGIN` — your Vercel URL once you have it (step 3); comma-separate multiple origins

Render's free tier spins down after ~15 minutes idle, so the first request after a
lull takes a few seconds to wake up.

### 3. Frontend — Vercel

Import the repo in Vercel with:

- Root directory: `frontend`
- Framework preset: Vite (auto-detected)

Set the environment variable:

- `VITE_API_BASE_URL` — your Render backend URL, e.g. `https://saree-app-backend.onrender.com` (no trailing slash)

Then go back to Render and set `CORS_ORIGIN` to your Vercel URL so the backend accepts
requests from it.

## API

| Method | Path              | Description          |
|--------|-------------------|-----------------------|
| GET    | /api/sarees       | List all sarees      |
| GET    | /api/sarees/:id   | Get one saree        |
| POST   | /api/sarees       | Create a saree       |
| PUT    | /api/sarees/:id   | Update a saree       |
| DELETE | /api/sarees/:id   | Delete a saree       |

Request body for POST/PUT:

```json
{
  "name": "Kanjivaram Silk",
  "description": "Pure silk saree with gold zari border",
  "imageUrl": "https://example.com/saree1.jpg",
  "originalPrice": 5000,
  "exchangeRate": 1,
  "additionalCharges": 200,
  "marginPercentage": 25
}
```
