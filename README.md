# KickSeatz Website Prototype

NFL-wide ticket discovery and recommendation website prototype for the next phase of KickSeatz.

## Stack
- Next.js App Router
- React
- TypeScript
- Custom CSS design system
- Lucide icons
- Local browser storage for demo profile, price watches, and ratings

## Run locally

1. Install Node.js 20.9+.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

The current inventory and schedules are clearly labeled demo data. Profile, watches, and ratings use browser storage in this prototype. No real ticket purchase flow is included yet.

## Planned production architecture

The UI is intentionally separated from the inventory layer so the demo data can later be replaced by authorized live ticket inventory without rebuilding the user experience.


### If Next.js warns about multiple lockfiles
Keep the `package-lock.json` inside the folder that contains `package.json`. If you accidentally ran `npm install` in the parent `kickseatz-web` folder too, delete the parent lockfile and keep the inner project lockfile. Then restart the dev server.


## Optional backend connection

The frontend uses its built-in demo inventory by default. To connect it to the FastAPI backend, set `NEXT_PUBLIC_API_BASE_URL` to the backend origin. If the backend is hosted separately, set `KICKSEATZ_FRONTEND_ORIGIN` on the backend to the frontend origin so CORS allows the deployed Next.js app.

Run the backend locally with `python -m uvicorn backend.main:app --port 8000`.
