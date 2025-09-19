# FF Check (Vercel)

1. Create a new Git repository and push the files.
2. Import the repo into Vercel (https://vercel.com/new) — Vercel will auto-detect Next.js.
3. Set build: `npm run build` and start: `npm run start` (Vercel uses `vercel` runtime automatically).
4. Open the deployed URL and test by entering a UID.

Notes:
- The project proxies requests server-side to avoid CORS. Proxy only allows `raw.thug4ff.com` and `profile.thug4ff.com` to reduce abuse.
- If any API changes or requires special headers, update `pages/api/proxy.js` accordingly.