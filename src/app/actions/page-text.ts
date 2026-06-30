"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, audit } from "@/lib/admin-auth";
import { PAGE_TEXT_KEYS } from "@/lib/page-text";

export type PageTextFormState = { ok?: boolean; error?: string };

/** Pages whose copy this store feeds — revalidate all on any change. */
const PATHS = ["/rooms", "/dining", "/experiences", "/gallery", "/blog", "/contact", "/admin/page-text"];

export async function savePageText(
  _prev: PageTextFormState | undefined,
  formData: FormData,
): Promise<PageTextFormState> {
  const adminUser = await requireAdmin();

  // Accept only registered keys; trim values. Empty value = clear override
  // (the row is removed so the compiled default applies again).
  const upserts: { key: string; value: string }[] = [];
  const clears: string[] = [];
  for (const [key, raw] of formData.entries()) {
    if (!PAGE_TEXT_KEYS.has(key)) continue;
    const value = String(raw).trim();
    if (value) upserts.push({ key, value });
    else clears.push(key);
  }

  const db = createAdminClient();
  if (upserts.length) {
    const { error } = await db.from("page_text").upsert(upserts, { onConflict: "key" });
    if (error) return { error: error.message };
  }
  if (clears.length) {
    const { error } = await db.from("page_text").delete().in("key", clears);
    if (error) return { error: error.message };
  }

  for (const p of PATHS) revalidatePath(p);
  await audit(adminUser.email, "page_text.update", "Page text updated");
  return { ok: true };
}
