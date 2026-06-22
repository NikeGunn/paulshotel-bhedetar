# CLAUDE.md — Paul's Hotel & Lodge Website (Project Brain)

> Single source of truth for this codebase. Read this first every session.
> Owner-review demo for the CEO of Paul's Hotel, Bhedetar. Goal: a striking,
> SEO-strong, dynamic hotel site with an owner admin panel, deployed on Vercel,
> domain-ready for `paulshotel.com.np`.

---

## 1. Business facts (NAP — single source of truth)

| Field | Value |
|---|---|
| Name | **Paul's Hotel & Lodge** (signage: "PAULS HOTEL & LODGE") |
| Address | Charles Point (चार्ल्स प्वाइन्ट), Dharan–Dhankuta Highway, **Bhedetar 56804**, Dhankuta, Nepal |
| Phone / WhatsApp | **970-1406587** |
| Email | **paulshotelbhedetar@gmail.com** |
| Rating | **4.5 / 5** · **86 Google reviews** |
| Price tier | `$$` |
| Facebook | facebook.com/paulshotelbhedetar |
| Future domain | paulshotel.com.np (parked now → switch later, no code change) |
| Distance | ~1h50m from Dharan; hilltop sunrise/sunset; Sky Walk viewpoint nearby |

> All NAP/SEO constants live in `src/lib/site-config.ts` — never hardcode elsewhere.

---

## 2. Tech stack (actual installed versions)

- **Next.js 16.2.9** (App Router, React **19.2.4**, Server Components + Server Actions)
- **TypeScript** strict · path alias `@/*` → `src/*`
- **Tailwind CSS v4** (CSS-first config in `globals.css`, `@theme`)
- **motion** (Framer Motion) — reveals, parallax, page transitions
- **embla-carousel-react** + **embla-carousel-autoplay** — hero/gallery/testimonials/food carousels
- **lucide-react** — icons · **clsx** + **tailwind-merge** + **cva** — styling utils
- **@supabase/supabase-js** + **@supabase/ssr** — DB/Auth/Storage (cookie auth in App Router)
- **react-hook-form** + **zod** + **@hookform/resolvers** — forms/validation
- **@tiptap/react** + starter-kit (link bundled in v3) + image — admin rich blog editor
- **sanitize-html** — pure-JS server-side HTML sanitization of editor output (NOT isomorphic-dompurify: jsdom's native init crashed the serverless function on save)
- **resend** — inquiry notification email to owner
- Dev visual loop: **Playwright** (webapp-testing skill / Claude Code browser)

---

## 3. Architecture & CORS-safety rules (do not break)

1. **All Supabase access is server-side** — Server Components, Server Actions, Route Handlers. The browser never makes cross-origin Supabase writes → **zero CORS surface**.
2. Three Supabase clients in `src/lib/supabase/`:
   - `server.ts` — cookie-bound SSR client (auth-aware reads).
   - `client.ts` — browser client (only for auth session UI; no privileged ops).
   - `admin.ts` — **service-role** client, server-only, never imported into client components.
3. Secrets via env (`.env.local`, git-ignored; `.env.example` committed):
   - Public: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
   - Server-only: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `OWNER_EMAIL`.
4. `next.config.ts` `images.remotePatterns` whitelists the Supabase storage host (prevents prod image 400s).
5. After any DB mutation call `revalidatePath(...)`; blog/gallery use ISR so owner edits appear without redeploy.
6. `metadataBase` derives from `NEXT_PUBLIC_SITE_URL` → OG/canonical correct on Vercel URL **and** later on the custom domain. Domain switch = add domain in Vercel + change one env var. **No code change.**
7. `'use client'` only on interactive/animated leaf components. Default = Server Component.

---

## 4. Data model (Supabase Postgres)

- **posts** — id, slug (unique), title, excerpt, content (HTML), cover_url, status `draft|published`, published_at, created_at, updated_at, seo_title, seo_description.
- **gallery_images** — id, url, alt, category (`hotel|rooms|food|bar|views`), sort_order, created_at.
- **inquiries** — id, name, email, phone, check_in, check_out, guests, message, status `new|contacted|closed`, created_at.
- **rooms** (optional v1) — id, name, slug, description, price_from, capacity, amenities[], images[], sort_order.
- **RLS**: public `SELECT` on published posts + gallery + rooms; **all writes & inquiries via service-role only** (server actions). No public write path.

---

## 5. Routes / IA

Public: `/` · `/rooms` · `/dining` · `/gallery` · `/experiences` · `/blog` · `/blog/[slug]` · `/contact`
Admin (auth-gated): `/admin/login` · `/admin` · `/admin/blog` (+new/edit) · `/admin/gallery` · `/admin/leads`
SEO routes: `app/sitemap.ts` · `app/robots.ts` · `app/manifest.ts` · `app/opengraph-image.tsx`

Global UI: sticky nav, footer (NAP/social/hours), floating WhatsApp+Call buttons.

---

## 6. Design language

- Palette: deep **hotel-blue** (brand building) + warm **string-light amber** accent + soft neutrals/cream. Soothing, premium, hill-resort vibe.
- Motion: hero Embla carousel w/ slow Ken-Burns + gradient overlay; **alternating left→right / right→left** scroll reveals (motion `whileInView`, staggered); parallax on valley/hill photos; hover-lift cards; auto-scroll food marquee. Respect `prefers-reduced-motion`.
- Avoid generic AI look — use `frontend-design` + `web-design-guidelines` skills. Every image has descriptive `alt` (SEO + a11y). Lighthouse target ≥95.

### Image assets (in `public/images/`)
- `hotel/` exterior day/dusk/foggy, signage, terrace, lounge (Sky Walk), string-lights
- `rooms/` deluxe-double-accent, twin-room
- `bar/` bar-blue-led, bar-green-led-lounge
- `views/` night-valley-citylights, night-sky-stars
- `food/` sekuwa, wings, chilli-paneer, cheese-sticks, fried-rice, eggs, thukpa, chowmein, biryani, paratha

---

## 7. SEO plan

- Per-page `generateMetadata` (title/desc/canonical/OG/Twitter) + dynamic OG image.
- JSON-LD: `Hotel`+`LocalBusiness` (NAP, geo, priceRange `$$`, rating 4.5/86, sameAs FB) on home/contact; `Article` on posts; `BreadcrumbList` site-wide. Helpers in `src/lib/jsonld.ts`.
- Targets: "hotel in Bhedetar", "Paul's Hotel Bhedetar", "Bhedetar resort", "where to stay Bhedetar", "Charles Point hotel", "Sky Walk Bhedetar".
- sitemap (incl. dynamic blog slugs), robots, semantic headings, WebP, priority hero LCP, mobile-first.

---

## 8. Phases (build roadmap)

### Phase 1 — Foundation + animated static site  *(DONE)*
- [x] Scaffold Next 16 + TS + Tailwind v4; install motion/embla/supabase/rhf/zod/tiptap/resend.
- [x] Move 24 real photos → `public/images/{hotel,rooms,food,bar,views}`.
- [x] Theme tokens + fonts in `globals.css`; `src/lib/site-config.ts` (NAP/SEO).
- [x] Layout shell: Nav, Footer, FloatingContact, global metadata + JSON-LD.
- [x] Public pages w/ animations + carousels: Home, Rooms, Dining, Gallery, Experiences, Contact (form UI).
- [x] Playwright visual loop: dev server + screenshot each page (desktop + mobile).
- **Done when:** great-looking, fully animated static site runs locally; screenshots captured. ✅

### Phase 2 — Supabase backend + admin panel (dynamic)  *(DONE)*
- [x] `supabase/schema.sql` — tables + RLS + storage bucket; owner admin user provisioned.
- [x] `src/lib/supabase/{server,client,admin}.ts`.
- [x] Admin auth (login + protected `/admin` layout/middleware).
- [x] Admin: blog CRUD (create/edit/delete/publish) + Tiptap editor + image upload; gallery CRUD (upload/edit alt+category/delete); leads table + status update.
- [x] Wire public `/blog`, `/blog/[slug]`, `/gallery` to DB (ISR). Inquiry server action → save lead + Resend email + `revalidatePath`.
- **Done when:** owner logs in, publishes a blog w/ images, sees leads; public site reflects it. ✅

### Phase 3 — SEO hardening + Vercel CI/CD + live URL  *(MOSTLY DONE)*
- [x] Full metadata/JSON-LD/OG/sitemap/robots in place.
- [x] GitHub repo + Actions CI (lint, typecheck, build) green; push-to-main → Vercel prod deploy via Actions.
- [x] Vercel CLI installed, project linked, env vars set; prod deploys green and aliased to canonical domain.
- [ ] Formal Lighthouse + perf + a11y audit; post-deploy Playwright smoke on live URL; domain-switch checklist documented.
- **Live URL:** https://paulshotel-bhedetar.vercel.app · **Done when:** audit pass + domain-switch doc. (CI green ✅, live URL ✅)

---

## 9. Commands

```bash
npm run dev      # local dev (http://localhost:3000)
npm run build    # production build (must pass before deploy)
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

> Folder has a space ("paul hotel"); npm package name is `paulshotel-web`. Git/Vercel root = this folder.

---

## 10. Gotchas / conventions

- Windows shell = PowerShell 5.1 (no `&&`); Bash tool available for POSIX.
- Tailwind v4 = no `tailwind.config.js`; theme tokens go in `globals.css` `@theme`.
- Keep server-only modules (`admin.ts`, resend) out of any `'use client'` import graph.
- Original photos preserved in `Images/` (backup) — working copies live in `public/images/`.
- See `PROGRESS.md` for live status / next action.
