"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, audit } from "@/lib/admin-auth";

export type ContentFormState = { ok?: boolean; error?: string };

/** Routes whose rendered output embeds each content type. */
const PATHS = {
  rooms: ["/rooms", "/", "/admin/content"],
  dishes: ["/dining", "/", "/admin/content"],
  experiences: ["/experiences", "/", "/admin/content"],
  testimonials: ["/", "/admin/content"],
} as const;

type Table = keyof typeof PATHS;

function revalidate(table: Table) {
  for (const p of PATHS[table]) revalidatePath(p);
}

/** Shared optional-text transform: trims; empty -> null. */
const optText = (max = 2000) =>
  z.string().max(max).optional().transform((v) => {
    const t = (v ?? "").trim();
    return t === "" ? null : t;
  });

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ---- amenities: comma/newline separated -> text[] ----
const amenitiesField = z
  .string()
  .max(2000)
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean),
  );

// ===================================================================== rooms
const roomSchema = z.object({
  name: z.string().min(1, "Name is required.").max(200),
  slug: optText(200),
  blurb: optText(1000),
  image: optText(500),
  price_from: optText(60),
  capacity: optText(120),
  amenities: amenitiesField,
  sort_order: z.coerce.number().int().min(0).max(9999).optional(),
});

export async function saveRoom(
  _prev: ContentFormState | undefined,
  formData: FormData,
): Promise<ContentFormState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const parsed = roomSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { error: `${i?.path.join(".")}: ${i?.message}` };
  }
  const d = parsed.data;
  const payload = {
    name: d.name,
    slug: d.slug || slugify(d.name),
    blurb: d.blurb,
    image: d.image,
    price_from: d.price_from,
    capacity: d.capacity,
    amenities: d.amenities,
    ...(d.sort_order !== undefined ? { sort_order: d.sort_order } : {}),
  };

  const db = createAdminClient();
  const { error } = id
    ? await db.from("rooms").update(payload).eq("id", id)
    : await db.from("rooms").insert(payload);
  if (error) return { error: error.message };

  revalidate("rooms");
  await audit(adminUser.email, "content.room_save", `Room ${id ? "updated" : "created"}: ${d.name}`);
  return { ok: true };
}

// ===================================================================== dishes
const dishSchema = z.object({
  name: z.string().min(1, "Name is required.").max(200),
  src: optText(500),
  sort_order: z.coerce.number().int().min(0).max(9999).optional(),
});

export async function saveDish(
  _prev: ContentFormState | undefined,
  formData: FormData,
): Promise<ContentFormState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const parsed = dishSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { error: `${i?.path.join(".")}: ${i?.message}` };
  }
  const d = parsed.data;
  const payload = {
    name: d.name,
    src: d.src,
    ...(d.sort_order !== undefined ? { sort_order: d.sort_order } : {}),
  };

  const db = createAdminClient();
  const { error } = id
    ? await db.from("dishes").update(payload).eq("id", id)
    : await db.from("dishes").insert(payload);
  if (error) return { error: error.message };

  revalidate("dishes");
  await audit(adminUser.email, "content.dish_save", `Dish ${id ? "updated" : "created"}: ${d.name}`);
  return { ok: true };
}

// ================================================================ experiences
const experienceSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  body: optText(1000),
  image: optText(500),
  sort_order: z.coerce.number().int().min(0).max(9999).optional(),
});

export async function saveExperience(
  _prev: ContentFormState | undefined,
  formData: FormData,
): Promise<ContentFormState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const parsed = experienceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { error: `${i?.path.join(".")}: ${i?.message}` };
  }
  const d = parsed.data;
  const payload = {
    title: d.title,
    body: d.body,
    image: d.image,
    ...(d.sort_order !== undefined ? { sort_order: d.sort_order } : {}),
  };

  const db = createAdminClient();
  const { error } = id
    ? await db.from("experiences").update(payload).eq("id", id)
    : await db.from("experiences").insert(payload);
  if (error) return { error: error.message };

  revalidate("experiences");
  await audit(adminUser.email, "content.experience_save", `Experience ${id ? "updated" : "created"}: ${d.title}`);
  return { ok: true };
}

// =============================================================== testimonials
const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required.").max(120),
  location: optText(120),
  body: z.string().min(1, "Review text is required.").max(1000),
  rating: z.coerce.number().int().min(1).max(5),
  sort_order: z.coerce.number().int().min(0).max(9999).optional(),
});

export async function saveTestimonial(
  _prev: ContentFormState | undefined,
  formData: FormData,
): Promise<ContentFormState> {
  const adminUser = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { error: `${i?.path.join(".")}: ${i?.message}` };
  }
  const d = parsed.data;
  const payload = {
    name: d.name,
    location: d.location,
    body: d.body,
    rating: d.rating,
    ...(d.sort_order !== undefined ? { sort_order: d.sort_order } : {}),
  };

  const db = createAdminClient();
  const { error } = id
    ? await db.from("testimonials").update(payload).eq("id", id)
    : await db.from("testimonials").insert(payload);
  if (error) return { error: error.message };

  revalidate("testimonials");
  await audit(adminUser.email, "content.testimonial_save", `Testimonial ${id ? "updated" : "created"}: ${d.name}`);
  return { ok: true };
}

// ================================================================ delete (any)
const TABLES: readonly Table[] = ["rooms", "dishes", "experiences", "testimonials"];

export async function deleteContent(table: Table, id: string): Promise<ContentFormState> {
  const adminUser = await requireAdmin();
  if (!TABLES.includes(table)) return { error: "Unknown content type." };
  if (!id) return { error: "Missing id." };

  const db = createAdminClient();
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) return { error: error.message };

  revalidate(table);
  await audit(adminUser.email, "content.delete", `Deleted ${table} ${id}`);
  return { ok: true };
}
