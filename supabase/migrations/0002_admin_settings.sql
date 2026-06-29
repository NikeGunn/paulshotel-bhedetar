-- =====================================================================
-- Paul's Hotel — Migration 0002: admin settings + audit log
-- =====================================================================
-- Adds owner-editable site settings and an admin action audit trail.
-- 100% idempotent: safe to run multiple times against the LIVE production
-- database. CREATE ... IF NOT EXISTS everywhere; the settings row is seeded
-- ONLY if absent (ON CONFLICT DO NOTHING) so re-running never clobbers
-- owner edits.
--
-- FREE-PLAN DESIGN:
--   * site_settings is a SINGLE pinned row (id = 1). Reads are a primary-key
--     lookup — the cheapest possible query. The app caches it per-request, so
--     footer + navbar + JSON-LD share one fetch.
--   * Profile data (display name) lives in Supabase Auth user_metadata — no
--     extra table, no extra query.
--   * admin_audit_log is append-only with a (created_at desc) index; the admin
--     UI reads a small LIMITed page only.
--
-- RUN: paste into Supabase Dashboard → SQL Editor → Run.
-- =====================================================================

-- ---------- updated_at helper (no-op if 0001 already created it) ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ===================== site_settings (single row) =====================
-- One row only, pinned to id = 1. Columns are typed (not a jsonb blob) so the
-- public site reads native values with zero parse cost. Every column is
-- NULLable: a NULL means "fall back to the compiled siteConfig default", so a
-- partially-filled row can never break the public site.
create table if not exists public.site_settings (
  id            int  primary key default 1,
  -- Business / NAP
  name          text,
  tagline       text,
  description   text,
  phone         text,
  phone_e164    text,
  whatsapp      text,
  email         text,            -- public contact email shown on the site
  -- Address
  address_street      text,
  address_locality    text,
  address_region      text,
  address_postal_code text,
  address_country     text,
  address_full        text,
  -- Geo (JSON-LD)
  geo_lat       double precision,
  geo_lng       double precision,
  -- Reputation / pricing
  rating_value  numeric(2,1),
  rating_count  int,
  price_range   text,
  -- Social + map
  facebook_url  text,
  instagram_url text,
  directions_url   text,
  map_embed_query  text,
  -- Hours
  hours         text,
  -- SEO defaults
  seo_keywords  text[],          -- array; NULL => use compiled keyword list
  -- Notification routing (the enquiry-alert recipient; mirrors OWNER_EMAIL env)
  notify_email  text,
  -- Feature toggles for the floating contact buttons
  show_whatsapp_button boolean not null default true,
  show_call_button     boolean not null default true,
  -- single-row guard: id must always be 1
  constraint site_settings_singleton check (id = 1),
  updated_at    timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Seed the singleton row ONLY if it does not already exist. Values mirror the
-- current src/lib/site-config.ts so the DB and compiled defaults are identical
-- on day one (the app still falls back to siteConfig for any NULL column).
insert into public.site_settings (
  id, name, tagline, description,
  phone, phone_e164, whatsapp, email,
  address_street, address_locality, address_region, address_postal_code,
  address_country, address_full,
  geo_lat, geo_lng,
  rating_value, rating_count, price_range,
  facebook_url, instagram_url, directions_url, map_embed_query,
  hours, seo_keywords, notify_email,
  show_whatsapp_button, show_call_button
) values (
  1,
  'Paul''s Hotel & Lodge',
  'Wake up above the clouds in Bhedetar',
  'Paul''s Hotel & Lodge sits at Charles Point in Bhedetar, Dhankuta, where cool hill air, sunrise over the valley and warm Nepali food wait for you. Comfortable rooms, a lively bar and lounge, and sweeping views just a short drive above Dharan.',
  '970-1406587', '+9779701406587', '9779701406587', 'Sanbunpaudal299@gmail.com',
  'Charles Point, Dharan-Dhankuta Highway', 'Bhedetar', 'Dhankuta', '56804',
  'Nepal', 'Charles Point, Dharan-Dhankuta Highway, Bhedetar 56804, Dhankuta, Nepal',
  26.8467, 87.3145,
  4.5, 86, 'NPR 1,500-2,500',
  'https://www.facebook.com/paulshotelbhedetar/',
  'https://www.instagram.com/paulshotelbhedetar/',
  'https://www.google.com/maps/dir/?api=1&destination=Paul%27s+Hotel+Bhedetar+Charles+Point',
  'Paul''s Hotel Bhedetar Charles Point',
  'Open daily · Reception 24/7',
  array[
    'hotel in Bhedetar','Paul''s Hotel Bhedetar','Bhedetar resort',
    'where to stay in Bhedetar','Charles Point hotel','Sky Walk Bhedetar hotel',
    'Bhedetar Dhankuta accommodation','hotel near Dharan'
  ],
  'Sanbunpaudal299@gmail.com',
  true, true
)
on conflict (id) do nothing;

-- ===================== admin_audit_log =====================
-- Append-only trail of privileged admin actions (settings change, password
-- change, email change, etc). Read by the admin UI in small LIMITed pages.
create table if not exists public.admin_audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_email text,                 -- who did it (admin email at the time)
  action      text not null,        -- machine code, e.g. 'settings.update'
  detail      text,                 -- short human summary
  created_at  timestamptz not null default now()
);
create index if not exists admin_audit_created_idx
  on public.admin_audit_log (created_at desc);

-- ===================== RLS =====================
alter table public.site_settings   enable row level security;
alter table public.admin_audit_log enable row level security;

-- Public may READ the single settings row (the public site renders from it).
-- It contains only already-public info (NAP/SEO). No write policy => all
-- writes go through the service-role client in server actions.
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings
  for select using (true);

-- Audit log: NO select/insert policy for public or authenticated roles.
-- Only the service-role client (which bypasses RLS) can read or append it.
-- This keeps the trail unreadable from the browser.
