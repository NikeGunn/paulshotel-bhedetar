"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, audit } from "@/lib/admin-auth";

export type SettingsFormState = { ok?: boolean; error?: string };

// Optional text: trims; empty string => null (so the column falls back to
// siteConfig via the data layer's `pick`). Keeps the row sparse and the
// fallback behaviour predictable.
const optText = (max = 2000) =>
  z
    .string()
    .max(max)
    .optional()
    .transform((v) => {
      const t = (v ?? "").trim();
      return t === "" ? null : t;
    });

const optUrl = z
  .string()
  .max(500)
  .optional()
  .transform((v) => (v ?? "").trim())
  .refine((v) => v === "" || /^https?:\/\//i.test(v), {
    message: "Links must start with http:// or https://",
  })
  .transform((v) => (v === "" ? null : v));

const optEmail = z
  .string()
  .max(200)
  .optional()
  .transform((v) => (v ?? "").trim())
  .refine((v) => v === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), {
    message: "Enter a valid email address",
  })
  .transform((v) => (v === "" ? null : v));

// Optional number from a form string. Empty => null. Out-of-range => error.
const optNum = (min: number, max: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v ?? "").trim())
    .refine((v) => v === "" || !Number.isNaN(Number(v)), {
      message: "Enter a number",
    })
    .transform((v) => (v === "" ? null : Number(v)))
    .refine((v) => v === null || (v >= min && v <= max), {
      message: `Must be between ${min} and ${max}`,
    });

const settingsSchema = z.object({
  name: optText(200),
  tagline: optText(300),
  description: optText(2000),
  phone: optText(40),
  phone_e164: optText(40),
  whatsapp: optText(40),
  email: optEmail,
  address_street: optText(300),
  address_locality: optText(120),
  address_region: optText(120),
  address_postal_code: optText(40),
  address_country: optText(120),
  address_full: optText(400),
  geo_lat: optNum(-90, 90),
  geo_lng: optNum(-180, 180),
  rating_value: optNum(0, 5),
  rating_count: optNum(0, 10_000_000),
  price_range: optText(60),
  facebook_url: optUrl,
  instagram_url: optUrl,
  directions_url: optUrl,
  map_embed_query: optText(300),
  hours: optText(200),
  // Comma- or newline-separated keywords -> text[] (or null to fall back).
  seo_keywords: z
    .string()
    .max(2000)
    .optional()
    .transform((v) => {
      const items = (v ?? "")
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      return items.length ? items : null;
    }),
  notify_email: optEmail,
  show_whatsapp_button: z.coerce.boolean(),
  show_call_button: z.coerce.boolean(),
});

/** Public routes whose rendered output embeds settings/NAP/JSON-LD. */
const SETTINGS_DEPENDENT_PATHS = ["/", "/contact", "/rooms", "/dining", "/gallery", "/experiences", "/blog"];

export async function saveSettings(
  _prev: SettingsFormState | undefined,
  formData: FormData,
): Promise<SettingsFormState> {
  const admin = await requireAdmin();

  // Checkboxes only appear in FormData when checked; coerce presence -> bool.
  const raw = Object.fromEntries(formData.entries());
  raw.show_whatsapp_button = String(formData.has("show_whatsapp_button"));
  raw.show_call_button = String(formData.has("show_call_button"));

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const where = issue?.path?.join(".");
    const msg = issue?.message ?? "Invalid input.";
    return { error: where ? `${where}: ${msg}` : msg };
  }

  const db = createAdminClient();
  // Single-row upsert pinned to id = 1. updated_at is bumped by the DB trigger.
  const { error } = await db
    .from("site_settings")
    .update(parsed.data)
    .eq("id", 1);

  if (error) return { error: error.message };

  // Revalidate the pages that embed NAP/JSON-LD. This re-runs their cached
  // settings fetch on the next request; the 60s fetch TTL is the natural cap.
  for (const p of SETTINGS_DEPENDENT_PATHS) revalidatePath(p);
  revalidatePath("/admin/settings");

  await audit(admin.email, "settings.update", "Site settings updated");
  return { ok: true };
}
