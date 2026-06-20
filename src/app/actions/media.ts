"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

/** Upload an image to the public `media` bucket, return its public URL. */
export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAuth();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "No file provided." };
  if (!ALLOWED.includes(file.type)) return { error: "Unsupported image type." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image must be under 8MB." };

  const db = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await db.storage
    .from("media")
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };

  const { data } = db.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}

/** Add a gallery image record (after upload). */
export async function addGalleryImage(formData: FormData) {
  await requireAuth();
  const url = String(formData.get("url") ?? "");
  const alt = String(formData.get("alt") ?? "").trim();
  const category = String(formData.get("category") ?? "Hotel");
  if (!url) return;

  const db = createAdminClient();
  await db.from("gallery_images").insert({ url, alt, category });
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(id: string) {
  await requireAuth();
  const db = createAdminClient();
  await db.from("gallery_images").delete().eq("id", id);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
