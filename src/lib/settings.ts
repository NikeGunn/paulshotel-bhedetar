import "server-only";
import { siteConfig } from "./site-config";

/**
 * Settings data layer — DB-backed, with a guaranteed fallback to the compiled
 * `siteConfig`. The public site renders from `getSettings()`; if the DB row is
 * missing, partially filled, or Supabase is unreachable, every field falls back
 * to the compiled default. **This function never throws** → the live site can
 * never crash on a settings read.
 *
 * FREE-PLAN COST: the public read is a single primary-key lookup on a one-row
 * table, fetched through Next's data cache with `revalidate = 60`. So under any
 * amount of traffic the public pages hit Supabase at most ~once per minute, not
 * once per request. Admin reads use `getSettingsFresh()` (uncached, service
 * role) only on the few admin pages that must show live values.
 */

const SETTINGS_TTL_SECONDS = 60;

/**
 * Cache tag on the public settings fetch. `saveSettings` revalidates the
 * dependent routes (which drops the data-cache entries under them), so an owner
 * edit rebuilds with fresh DB values on the next request rather than waiting out
 * the {@link SETTINGS_TTL_SECONDS} window; the TTL is the backstop.
 */
const SETTINGS_TAG = "site-settings";

/** Shape returned to the app — mirrors `siteConfig` so consumers swap cleanly. */
export type ResolvedSettings = {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phoneE164: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    full: string;
  };
  geo: { lat: number; lng: number };
  rating: { value: number; count: number };
  priceRange: string;
  url: string;
  social: { facebook: string; instagram: string };
  hours: string;
  directionsUrl: string;
  mapEmbedQuery: string;
  keywords: readonly string[];
  /** Enquiry-alert recipient. Mirrors OWNER_EMAIL env; DB value is advisory. */
  notifyEmail: string;
  /** Feature toggles for the floating contact buttons. */
  showWhatsappButton: boolean;
  showCallButton: boolean;
};

/** Raw DB row (all columns nullable except the toggles + id). */
type SettingsRow = {
  name: string | null;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  phone_e164: string | null;
  whatsapp: string | null;
  email: string | null;
  address_street: string | null;
  address_locality: string | null;
  address_region: string | null;
  address_postal_code: string | null;
  address_country: string | null;
  address_full: string | null;
  geo_lat: number | null;
  geo_lng: number | null;
  rating_value: number | string | null;
  rating_count: number | null;
  price_range: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  directions_url: string | null;
  map_embed_query: string | null;
  hours: string | null;
  seo_keywords: string[] | null;
  notify_email: string | null;
  show_whatsapp_button: boolean | null;
  show_call_button: boolean | null;
};

/** Build the fully-compiled fallback from siteConfig. Cheap, pure. */
function fallback(): ResolvedSettings {
  return {
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    phone: siteConfig.phone,
    phoneE164: siteConfig.phoneE164,
    whatsapp: siteConfig.whatsapp,
    email: siteConfig.email,
    address: { ...siteConfig.address },
    geo: { ...siteConfig.geo },
    rating: { ...siteConfig.rating },
    priceRange: siteConfig.priceRange,
    url: siteConfig.url,
    social: { ...siteConfig.social },
    hours: siteConfig.hours,
    directionsUrl: siteConfig.directionsUrl,
    mapEmbedQuery: siteConfig.mapEmbedQuery,
    keywords: siteConfig.keywords,
    notifyEmail: siteConfig.email,
    showWhatsappButton: true,
    showCallButton: true,
  };
}

/** Pick the DB value when present (non-null, non-empty), else the fallback. */
function pick<T>(dbValue: T | null | undefined, fb: T): T {
  if (dbValue === null || dbValue === undefined) return fb;
  if (typeof dbValue === "string" && dbValue.trim() === "") return fb;
  return dbValue;
}

/** Merge a (possibly partial) DB row over the compiled fallback. */
function merge(row: SettingsRow | null): ResolvedSettings {
  const fb = fallback();
  if (!row) return fb;

  const ratingValue =
    row.rating_value === null || row.rating_value === undefined
      ? fb.rating.value
      : Number(row.rating_value);

  return {
    name: pick(row.name, fb.name),
    tagline: pick(row.tagline, fb.tagline),
    description: pick(row.description, fb.description),
    phone: pick(row.phone, fb.phone),
    phoneE164: pick(row.phone_e164, fb.phoneE164),
    whatsapp: pick(row.whatsapp, fb.whatsapp),
    email: pick(row.email, fb.email),
    address: {
      street: pick(row.address_street, fb.address.street),
      locality: pick(row.address_locality, fb.address.locality),
      region: pick(row.address_region, fb.address.region),
      postalCode: pick(row.address_postal_code, fb.address.postalCode),
      country: pick(row.address_country, fb.address.country),
      full: pick(row.address_full, fb.address.full),
    },
    geo: {
      lat: pick(row.geo_lat, fb.geo.lat),
      lng: pick(row.geo_lng, fb.geo.lng),
    },
    rating: {
      value: Number.isFinite(ratingValue) ? ratingValue : fb.rating.value,
      count: pick(row.rating_count, fb.rating.count),
    },
    priceRange: pick(row.price_range, fb.priceRange),
    url: fb.url, // always env-derived; never DB-overridden (canonical/OG safety)
    social: {
      facebook: pick(row.facebook_url, fb.social.facebook),
      instagram: pick(row.instagram_url, fb.social.instagram),
    },
    hours: pick(row.hours, fb.hours),
    directionsUrl: pick(row.directions_url, fb.directionsUrl),
    mapEmbedQuery: pick(row.map_embed_query, fb.mapEmbedQuery),
    keywords:
      row.seo_keywords && row.seo_keywords.length > 0
        ? row.seo_keywords
        : fb.keywords,
    notifyEmail: pick(row.notify_email, fb.notifyEmail),
    showWhatsappButton: row.show_whatsapp_button ?? fb.showWhatsappButton,
    showCallButton: row.show_call_button ?? fb.showCallButton,
  };
}

const SELECT_COLS =
  "name,tagline,description,phone,phone_e164,whatsapp,email," +
  "address_street,address_locality,address_region,address_postal_code,address_country,address_full," +
  "geo_lat,geo_lng,rating_value,rating_count,price_range," +
  "facebook_url,instagram_url,directions_url,map_embed_query,hours,seo_keywords,notify_email," +
  "show_whatsapp_button,show_call_button";

/**
 * Low-level read of the single settings row via the Supabase REST endpoint.
 * Uses the anon key (RLS permits public SELECT of this one public row) and
 * Next's data cache. Returns null on any failure — caller falls back.
 */
async function fetchRow(opts: { cache: boolean }): Promise<SettingsRow | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/site_settings?select=${SELECT_COLS}&id=eq.1`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        ...(opts.cache
          ? { next: { revalidate: SETTINGS_TTL_SECONDS, tags: [SETTINGS_TAG] } }
          : { cache: "no-store" }),
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as SettingsRow[];
    return rows[0] ?? null;
  } catch {
    // Network/DB error — never propagate; caller uses the compiled fallback.
    return null;
  }
}

/**
 * Public, cached settings getter. Hits the DB at most ~once per
 * {@link SETTINGS_TTL_SECONDS} site-wide. Safe in any Server Component.
 */
export async function getSettings(): Promise<ResolvedSettings> {
  return merge(await fetchRow({ cache: true }));
}

/**
 * Uncached, always-fresh settings — for the admin Settings form, which must
 * show the live row immediately after a save. Reads through the same RLS-public
 * row, no caching.
 */
export async function getSettingsFresh(): Promise<ResolvedSettings> {
  return merge(await fetchRow({ cache: false }));
}

/**
 * Single source for the public contact deep-links, derived from resolved
 * settings. Every navbar/hero/footer/CTA must use THIS — never the compiled
 * `links` from site-config — so an owner phone/WhatsApp change reflects
 * everywhere from the DB. One piece of knowledge, one place (DRY).
 */
export function contactLinks(s: Pick<ResolvedSettings, "phone" | "phoneE164" | "whatsapp">) {
  return {
    phone: s.phone,
    callHref: `tel:${s.phoneE164}`,
    whatsappHref: `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(
      "Hi Paul's Hotel, I'd like to enquire about a room.",
    )}`,
  };
}
