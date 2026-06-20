# PROGRESS.md — Paul's Hotel Website

> Live build tracker. Update after each work block. See `CLAUDE.md` for the full brain.

**Status:** Phase 1 COMPLETE. Starting Phase 2 (Supabase + admin).
**Last updated:** 2026-06-20
**Next action:** Supabase schema.sql + clients, admin auth, blog CRUD + editor, wire blog/gallery to DB, inquiry server action + email.

---

## Phase 1 — Foundation + animated static site

| # | Task | Status |
|---|---|---|
| 1.1 | Scaffold Next 16 + TS + Tailwind v4 | ✅ done |
| 1.2 | Install deps (motion, embla, supabase, rhf, zod, tiptap, resend, lucide) | ✅ done |
| 1.3 | Move 24 photos → `public/images/{hotel,rooms,food,bar,views}` | ✅ done |
| 1.4 | CLAUDE.md + PROGRESS.md | ✅ done |
| 1.5 | Theme tokens + fonts (`globals.css`, Fraunces + Outfit) | ✅ done |
| 1.6 | `src/lib/site-config.ts` (NAP/SEO) + utils + jsonld + content | ✅ done |
| 1.7 | Layout shell: Nav (glass), Footer (rich), FloatingContact, root metadata | ✅ done |
| 1.8 | Home (hero carousel, reveals, highlights, food marquee, dual-row testimonials, CTA) | ✅ done |
| 1.9 | Rooms page (alternating L/R reveals) | ✅ done |
| 1.10 | Dining page (bar feature + food gallery) | ✅ done |
| 1.11 | Gallery page (filter + lightbox) | ✅ done |
| 1.12 | Experiences page | ✅ done |
| 1.13 | Contact page (form UI + map + server-action stub) | ✅ done |
| 1.14 | Playwright visual loop (desktop + mobile + scroll-step) | ✅ done |

## Phase 2 — Supabase backend + admin panel
| # | Task | Status |
|---|---|---|
| 2.1 | `supabase/schema.sql` (tables + RLS + storage bucket) | ⬜ todo |
| 2.2 | Supabase clients `server/client/admin` | ⬜ todo |
| 2.3 | Admin auth (login + protected layout) | ⬜ todo |
| 2.4 | Admin blog CRUD + Tiptap editor + image upload | ⬜ todo |
| 2.5 | Admin gallery manager | ⬜ todo |
| 2.6 | Admin leads table | ⬜ todo |
| 2.7 | Wire public blog + gallery to DB (ISR) | ⬜ todo |
| 2.8 | Inquiry server action + Resend email | ⬜ todo |

## Phase 3 — SEO hardening + Vercel CI/CD
| # | Task | Status |
|---|---|---|
| 3.1 | Metadata/JSON-LD/OG/sitemap/robots full pass | ⬜ todo |
| 3.2 | Lighthouse + perf + a11y audit | ⬜ todo |
| 3.3 | GitHub repo + Actions CI | ⬜ todo |
| 3.4 | Vercel CLI deploy + env vars | ⬜ todo |
| 3.5 | Post-deploy smoke test + domain-switch doc | ⬜ todo |

---

## Extra interactive features added (client request)
- ✅ Cinematic on-brand preloader (session-once, curtain reveal), `components/layout/preloader.tsx`
- ✅ GSAP card-fan carousel (21st.dev) with real hotel photos, `components/ui/card-fan-carousel.tsx` + `home/fan-showcase.tsx`
- ✅ Interactive cobe globe with arcs + city markers converging on Bhedetar, `home/hotel-globe.tsx` (in LocationCTA)
- ✅ Dual-row left/right testimonials marquee, uniform cards, full text

## Gotchas learned
- Turbopack native bindings broken on this Win box → dev/build use `--webpack`.
- `cobe@2.0.1` is a bad/forked build with NO `onRender` (globe static). Use **cobe@0.6.3** (documented API, onRender works).
- next.config ESM: use `process.cwd()` not `__dirname`. Set `outputFileTracingRoot` (parent pnpm-lock.yaml warning).
- `"use server"` files can only export async fns → zod schema lives in `lib/inquiry-schema.ts`, imported by both client + action.
- Next 16 warns `middleware` → `proxy` rename (still works).

## Changelog
- **2026-06-20** — Project init: Next 16.2.9 / React 19.2.4 / Tailwind v4 scaffolded in-place. 24 real photos sorted into category folders. All runtime + admin + form deps installed. CLAUDE.md brain + this tracker created.
- **2026-06-20** — Phase 1 complete (7 animated pages, verified via Playwright). Phase 2 backend live: Supabase project `paulshotel-prod` created, schema+RLS+bucket applied, owner admin user seeded. Added preloader, GSAP fan carousel, interactive globe per client requests.
