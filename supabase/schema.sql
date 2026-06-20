-- Paul's Hotel & Lodge — database schema
-- Tables: posts, gallery_images, inquiries. RLS locks down writes to service role.
-- Public can only SELECT published posts and gallery images.

-- ---------- extensions ----------
create extension if not exists "pgcrypto";

-- ---------- updated_at helper ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ===================== posts =====================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null default '',          -- sanitized HTML from the editor
  cover_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_status_published_idx
  on public.posts (status, published_at desc);

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- ===================== gallery_images =====================
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  category text not null default 'Hotel',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists gallery_sort_idx
  on public.gallery_images (sort_order asc, created_at desc);

-- ===================== inquiries =====================
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  check_in date,
  check_out date,
  guests text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);
create index if not exists inquiries_created_idx
  on public.inquiries (created_at desc);

-- ===================== RLS =====================
alter table public.posts enable row level security;
alter table public.gallery_images enable row level security;
alter table public.inquiries enable row level security;

-- Public read: only published posts
drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts
  for select using (status = 'published');

-- Authenticated admins can read all posts (drafts included)
drop policy if exists "auth read all posts" on public.posts;
create policy "auth read all posts" on public.posts
  for select to authenticated using (true);

-- Public read gallery
drop policy if exists "public read gallery" on public.gallery_images;
create policy "public read gallery" on public.gallery_images
  for select using (true);

-- No public/authenticated write policies on any table:
-- all writes (posts, gallery, inquiries) go through the service-role client
-- in server actions, which bypasses RLS. inquiries have NO select policy,
-- so they are unreadable except via service role (admin leads page).

-- ===================== storage bucket =====================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read of media bucket; writes via service role only.
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
