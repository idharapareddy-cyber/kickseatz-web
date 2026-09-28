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
