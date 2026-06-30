import "server-only";
import { PAGE_TEXT_DEFAULTS } from "./page-text";

/**
 * Page-text data layer — DB-backed key/value copy with a guaranteed fallback to
 * the compiled `PAGE_TEXT_DEFAULTS`. Returns a `pt(key)` lookup that yields the
 * owner's value when present (non-empty) else the compiled default. **Never
 * throws** → a missing/empty table or unreachable DB can't break the site.
 * Mirrors the settings.ts pattern (DRY).
 */

const TTL = 60;

type Row = { key: string; value: string | null };

async function fetchRows(opts: { cache: boolean }): Promise<Row[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  try {
    const res = await fetch(`${url}/rest/v1/page_text?select=key,value`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      ...(opts.cache ? { next: { revalidate: TTL } } : { cache: "no-store" }),
    });
    if (!res.ok) return null;
    return (await res.json()) as Row[];
  } catch {
    return null;
  }
}

/** A resolved lookup: `pt("rooms.hero.title")` → owner value or compiled default. */
export type PageText = (key: string) => string;

function build(rows: Row[] | null): PageText {
  const overrides: Record<string, string> = {};
  for (const r of rows ?? []) {
    const v = (r.value ?? "").trim();
    if (v) overrides[r.key] = v;
  }
  return (key: string) => overrides[key] ?? PAGE_TEXT_DEFAULTS[key] ?? "";
}

/** Public, cached page-text lookup. Safe in any Server Component. */
export async function getPageText(): Promise<PageText> {
  return build(await fetchRows({ cache: true }));
}

/** Uncached map of raw stored values — for the admin editor (live values). */
export async function getPageTextValuesFresh(): Promise<Record<string, string>> {
  const rows = await fetchRows({ cache: false });
  const out: Record<string, string> = {};
  for (const r of rows ?? []) out[r.key] = r.value ?? "";
  return out;
}
