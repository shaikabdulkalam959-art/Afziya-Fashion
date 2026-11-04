# AFZIYA FASHION

Premium men's and women's clothing: customer website, Android app and a private owner dashboard.
Built with React + Vite + TypeScript + Tailwind, backed by Appwrite Cloud.

**Status: Phase 1 (brand + UI) and Phase 2 (project + Appwrite setup) complete.**
Included now: brand palette and AF monogram, home page, working sign up / sign in / sign out,
the full 25-collection database setup script, and documentation.
Not built yet: shop, admin dashboard, payments, AI tools, Android app (Phases 3-12).

## Folders

```
frontend/   React website (deploy this folder to Vercel)
backend/    Appwrite setup script and, later, protected Functions
app/        Android app (Phase 11)
docs/       database-schema, architecture, setup-guide
```

## Quick start

1. Read `docs/setup-guide/setup.md` (Appwrite Console steps, about 10 minutes).
2. `cd frontend`, edit `.env` with your Appwrite region and Project ID.
3. `npm install` then `npm run dev`, open http://localhost:5173/auth
   (using pnpm, yarn or bun? Use `pnpm install` / `pnpm dev` etc. instead, and delete `package-lock.json` if one appears.)

## Security rule

Secrets (Appwrite API key, Razorpay secret, AI keys) live only in `backend/.env` and in Appwrite Function
variables. Never put them in `frontend/`. Private data is protected at the Appwrite level, not just by hidden pages.
