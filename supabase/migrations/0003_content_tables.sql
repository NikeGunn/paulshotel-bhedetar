-- =====================================================================
-- Paul's Hotel — Migration 0003: editable site content
-- =====================================================================
-- Makes rooms / dishes / experiences / testimonials owner-editable from the
-- admin panel (gallery + blog were already DB-backed). 100% idempotent: safe
-- to run repeatedly against the LIVE production database. Each table is seeded
-- ONLY if empty, so re-running never clobbers owner edits.
--
-- DESIGN (matches 0002):
--   * Public RLS allows SELECT only (the public site renders these). All writes
--     go through the service-role client in server actions — no public write.
--   * Every content table has `sort_order` (owner-orderable) + timestamps with
--     the shared set_updated_at() trigger from 0002.
--   * The app's data layer (src/lib/content-data.ts) falls back to the compiled
--     src/lib/content.ts when a table is empty or Supabase is unreachable, so a
--     missing/empty table can never break the public site.
--
-- RUN: paste into Supabase Dashboard → SQL Editor → Run.
-- =====================================================================

-- set_updated_at() already exists from 0001/0002; redefine harmlessly so this
-- migration is self-contained if run on a fresh DB.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ===================== rooms =====================
create table if not exists public.rooms (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  blurb       text,
  image       text,
  price_from  text,
  capacity    text,
  amenities   text[] not null default '{}',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists rooms_updated_at on public.rooms;
create trigger rooms_updated_at before update on public.rooms
  for each row execute function public.set_updated_at();

-- ===================== dishes =====================
create table if not exists public.dishes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  src         text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists dishes_updated_at on public.dishes;
create trigger dishes_updated_at before update on public.dishes
  for each row execute function public.set_updated_at();

-- ===================== experiences =====================
create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  image       text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists experiences_updated_at on public.experiences;
create trigger experiences_updated_at before update on public.experiences
  for each row execute function public.set_updated_at();

-- ===================== testimonials =====================
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  location    text,
  body        text not null,
  rating      int  not null default 5 check (rating between 1 and 5),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ===================== RLS: public SELECT only =====================
alter table public.rooms        enable row level security;
alter table public.dishes       enable row level security;
alter table public.experiences  enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "public read rooms" on public.rooms;
create policy "public read rooms" on public.rooms for select using (true);
drop policy if exists "public read dishes" on public.dishes;
create policy "public read dishes" on public.dishes for select using (true);
drop policy if exists "public read experiences" on public.experiences;
create policy "public read experiences" on public.experiences for select using (true);
drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (true);

-- ===================== seeds (only if empty) =====================
-- Mirror src/lib/content.ts so DB == current site on day one.

insert into public.rooms (slug, name, blurb, image, price_from, capacity, amenities, sort_order)
select * from (values
  ('deluxe-double', 'Deluxe Double',
   'Our cosiest room, with a plush double bed, warm accent lighting and a window that opens onto the hills.',
   '/images/rooms/deluxe-double-accent.webp', 'Rs. 1,500', '2 guests',
   array['Mountain view','Private bathroom','Cosy bedding','Free Wi-Fi'], 0),
  ('twin-room', 'Twin Room',
   'Two comfortable beds and plenty of space, perfect for friends and families exploring Bhedetar together.',
   '/images/rooms/twin-room.webp', 'Rs. 1,800', '2 to 3 guests',
   array['Valley view','Two beds','Private bathroom','Free Wi-Fi'], 1),
  ('family-stay', 'Family Lodge Room',
   'A roomy stay for the whole group, steps from the terrace and the restaurant. Wake up, walk out, watch the sunrise.',
   '/images/hotel/exterior-blue-dusk.webp', 'Rs. 2,500', 'Up to 4 guests',
   array['Terrace access','Extra space','Hot water','Free Wi-Fi'], 2)
) as v(slug, name, blurb, image, price_from, capacity, amenities, sort_order)
where not exists (select 1 from public.rooms);

insert into public.dishes (name, src, sort_order)
select * from (values
  ('Chicken Sekuwa', '/images/food/chicken-sekuwa.webp', 0),
  ('Chowmein', '/images/food/chowmein.webp', 1),
  ('Chicken Biryani', '/images/food/chicken-biryani.webp', 2),
  ('Thukpa', '/images/food/thukpa-soup.webp', 3),
  ('Chilli Paneer', '/images/food/chilli-paneer-sticks.webp', 4),
  ('Veg Fried Rice', '/images/food/veg-fried-rice.webp', 5),
  ('Spicy Wings', '/images/food/chicken-wings-sekuwa.webp', 6),
  ('Cheese Sticks', '/images/food/fried-cheese-sticks.webp', 7),
  ('Aloo Paratha', '/images/food/aloo-paratha.webp', 8)
) as v(name, src, sort_order)
where not exists (select 1 from public.dishes);

insert into public.experiences (title, body, image, sort_order)
select * from (values
  ('Sunrise over the valley',
   'Set an early alarm and watch the first light spill across the hills. On clear mornings the view stretches all the way to the plains.',
   '/images/views/night-valley-citylights.webp', 0),
  ('The Bhedetar Sky Walk',
   'Walk out over the edge of the ridge on the glass and steel Sky Walk, a short hop from the hotel and a favourite with visitors.',
   '/images/hotel/lounge-sky-walk.webp', 1),
  ('Charles Point lookout',
   'The classic Bhedetar viewpoint right beside us, wrapped in cloud one minute and bright with sun the next.',
   '/images/hotel/exterior-foggy-day.webp', 2),
  ('Cool evenings by the lights',
   'When the sun drops the terrace lights up. Grab a drink, pull up a chair and watch the valley twinkle below.',
   '/images/hotel/terrace-string-lights.webp', 3)
) as v(title, body, image, sort_order)
where not exists (select 1 from public.experiences);

insert into public.testimonials (name, location, body, rating, sort_order)
select * from (values
  ('Sujan Rai', 'Dharan',
   'Drove up for the weekend and did not want to leave. The view from the terrace at sunrise is unreal and the sekuwa is the best I have had in Bhedetar.', 5, 0),
  ('Anita Limbu', 'Itahari',
   'Clean rooms, warm staff and the cool weather was such a relief from the heat below. Perfect little getaway with family.', 5, 1),
  ('Bikash Thapa', 'Kathmandu',
   'Stayed one night on a road trip east. The lounge bar with the city lights below is a vibe. Highly recommend for couples.', 5, 2),
  ('Priya Gurung', 'Biratnagar',
   'Woke up to clouds rolling past the window. Food was hot and tasty and the price is very reasonable. Will come again.', 4, 3),
  ('Rohan Shrestha', 'Lalitpur',
   'Cool weather, friendly owner and a quiet spot to switch off for a couple of days. The momo and thukpa hit different up here.', 5, 4),
  ('Sabina Magar', 'Dhankuta',
   'Came up for my birthday and the terrace at night with the lights was magical. Staff went out of their way to make it special.', 5, 5)
) as v(name, location, body, rating, sort_order)
where not exists (select 1 from public.testimonials);
