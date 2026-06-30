-- =====================================================================
-- Paul's Hotel — Migration 0004: editable page text
-- =====================================================================
-- A simple key/value store for owner-editable marketing copy (page hero
-- kicker/title/intro + section headings). Keys are defined in
-- src/lib/page-text.ts; a missing key falls back to the compiled default, so
-- this table can be empty and the site still renders. 100% idempotent.
--
-- DESIGN (matches 0002/0003):
--   * Public RLS allows SELECT only; writes via service-role server action.
--   * No seed — every key falls back to its compiled default until the owner
--     edits it, so the table starts empty and fills in on demand.
--
-- RUN: paste into Supabase Dashboard → SQL Editor → Run.
-- =====================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create table if not exists public.page_text (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

drop trigger if exists page_text_updated_at on public.page_text;
create trigger page_text_updated_at before update on public.page_text
  for each row execute function public.set_updated_at();

alter table public.page_text enable row level security;
drop policy if exists "public read page_text" on public.page_text;
create policy "public read page_text" on public.page_text for select using (true);
