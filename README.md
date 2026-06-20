# Paul's Hotel & Lodge, Bhedetar

Marketing website + owner admin panel for Paul's Hotel & Lodge, a hilltop hotel at
Charles Point in Bhedetar, Dhankuta, Nepal. Built to rank for "hotel in Bhedetar"
and to let the owner publish blog posts, manage the photo gallery, and read guest
enquiries from a simple dashboard.

## Stack

- **Next.js 16** (App Router, React 19, Server Actions)
- **TypeScript**, **Tailwind CSS v4**
- **Supabase** (Postgres + Auth + Storage) all access server-side (no CORS)
- **motion** (Framer Motion), **embla-carousel**, **gsap**, **cobe** (interactive globe)
- **Tiptap** rich blog editor, **react-hook-form + zod**, **Resend** email
- Deployed on **Vercel** with **GitHub Actions** CI

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Supabase + site URL
npm run dev                  # http://localhost:3000  (uses --webpack)
```

> This machine's Turbopack native binding is broken, so `dev`/`build` use `--webpack`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (must pass before deploy) |
| `npm run lint` | ESLint |

## Environment variables

See `.env.example`. Public: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SITE_URL`. Server-only: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`,
`OWNER_EMAIL`.

## Database

Schema, RLS and the storage bucket live in `supabase/schema.sql`. Public users can
only read published posts and gallery images; every write and all enquiry data goes
through the service-role client in server actions.

## Admin panel

`/admin/login` lets the owner sign in (Supabase Auth) to write blog posts (rich text
plus image upload), manage the gallery, and view guest enquiries. `/admin` is excluded
from search engines (`robots.ts`) and from the public site chrome.

## Deployment

Pushing to `main` triggers GitHub Actions (lint, typecheck, build) and a Vercel
production deploy. Preview deploys are created per pull request.

### Pointing the custom domain later

The site reads its base URL from `NEXT_PUBLIC_SITE_URL`. To switch to
`paulshotel.com.np`: add the domain in the Vercel dashboard, update that one env
var, and redeploy. No code changes needed.
