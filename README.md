# ATOMIC — The Growth Market

A one-commitment-per-day stock-market-style personal growth chart. React, TypeScript, Vite, Tailwind, Recharts; localStorage only. No backend.

## Run on Windows (PowerShell)

```powershell
npm install
npm run dev
```

Open the localhost URL printed by Vite. Verify with `npm test` and `npm run build`.

## Rules
- Starts at index 100; each completed day multiplies by 1.01; each missed day multiplies by 0.99.
- A user may record exactly one outcome per local calendar day, with no edits after submission.
- Unrecorded calendar days do not automatically count as missed: the chart shows *only actual entries*. A missing calendar day breaks the current streak, however.
- At first record the chart adds a **baseline reference** at 100 the previous day (not an invented action).
- Data is saved to `localStorage` with key `atomic-growth-records-v1`. It stays on the same browser and device and can be cleared by deleting site data.
- Dates use the device's local calendar and ISO date keys (`YYYY-MM-DD`); incorrect device clocks can affect recording.
- A save error is shown if storage is blocked; the UI does not register an unsaved action.

## Project structure

- `src/App.tsx` — interface, actions and persistence
- `src/components/GrowthChart.tsx` — interactive chart
- `src/lib/growth.mjs` — calculations and daily-entry validation
- `src/lib/growth.d.mts` — TypeScript types for the calculation module
- `src/styles.css` — visual styling and responsiveness
- `tests/growth.test.mjs` — Node built-in calculation tests

## Suggested manual checks
1. On a fresh browser, see index 100 and empty-chart message.
2. Click Completed. See 101, +1%, one chart record, and a disabled choice state.
3. Reload. Same record should remain, with no additional entry.
4. Change to a new calendar day (in a test browser only) and click Missed. Expected index: 99.99, change −0.01%.
5. Confirm mobile responsive layout in developer tools.

## Habit notebook (v0.2)
Open the notebook in Daily Commitment, add or remove habit tags. They persist separately from the original growth records. Tags describe your commitment; the index still changes once per day, not once per tag.

## Deploy and share
Run `npm install`, `npm test`, and `npm run build` first. Push this project to a GitHub repository (do not commit node_modules). In Vercel, import the repository as a Vite project and deploy; included vercel.json specifies the build and output. Alternatively import into Netlify; included netlify.toml specifies build settings. Share the public URL.

Each browser has independent progress. A new deployment URL is a different storage origin, so localhost data does not migrate automatically. No accounts or cross-device sync. Updating files on the same origin preserves storage. Do not clear site data if you want to keep your records.
