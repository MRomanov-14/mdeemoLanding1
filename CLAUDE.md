# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:4321
npm run build     # Build for production — always run this to verify changes
npm run preview   # Preview the production build locally
```

**Always run `npm run build` to verify changes and retry until it succeeds.**

## Architecture

This is an Astro SSR site for CLICK Logística (Colombian staffing/logistics company), deployed on Vercel.

**Routing:** File-based via `src/pages/`. Pages use `.astro` files. API endpoints are JS files under `src/pages/api/`.

**Layout:** `src/layouts/Layout.astro` is the single master layout — it handles the nav (with mobile hamburger + dropdowns), footer, preloader animation, theme toggle (dark/light stored in localStorage), and the floating WhatsApp button.

**JavaScript modules** in `src/js/` are loaded as scripts in pages:
- `main.js` — Lenis smooth scroll, animated counters (IntersectionObserver), navbar scroll effects, client ticker carousel
- `form-wizard.js` — Multi-step form logic for both candidate and company forms; handles validation, progress bar, Supabase client init, and POSTs to `/api/candidates` or `/api/companies`
- `network-canvas.js` — Animated neural network canvas background; deferred 1s after load to avoid blocking render

**Database:** `src/lib/db.js` is a singleton Postgres connection. Checks `DATABASE_URL` then `STGLANDING_POSTGRES_URL`. Tables are in the `clicklandingpublic` schema: `candidates` and `companies`.

**API routes:**
- `POST /api/companies` — company inquiries → `clicklandingpublic.companies`
- `POST /api/candidates` and `GET /api/candidates?cedula=` — recruitment applications → `clicklandingpublic.candidates`

## Environment Variables

```
DATABASE_URL or STGLANDING_POSTGRES_URL   # Postgres connection string
PUBLIC_SUPABASE_URL                        # Supabase project URL (client-accessible)
PUBLIC_SUPABASE_ANON_KEY                   # Supabase anon key (client-accessible)
```

## Design System

Defined in `tailwind.config.cjs`:
- **Primary/Accent:** `#eab308` / `#facc15` (golden yellow — the brand color)
- **Background:** `#09090b` dark, `#fafafa` light
- **Fonts:** Outfit (headings, weight 700/900), Inter (body)
- Custom animations: `float`, `pulse-slow`, `scroll-left`, `shake-x`, `pop-in`

Dark mode is default. Theme switching uses the `dark` class on `<html>` toggled in Layout.astro.

## Key Patterns

- `output: 'server'` in `astro.config.mjs` — all pages are SSR via the Vercel adapter
- Ngrok is whitelisted in Vite config for mobile testing
- Supabase client in `form-wizard.js` tries multiple env var name combinations for resilience
- Canvas animation and other heavy JS are deferred to keep initial render fast
