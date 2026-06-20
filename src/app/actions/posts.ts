"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

export type PostFormState = { error?: string; ok?: boolean };

export async function savePost(
  _prev: PostFormState | undefined,
  formData: FormData,
): Promise<PostFormState> {
  await requireAuth();

  const id = (formData.get("id") as string) || null;
  const title = String(formData.get("title") ?? "").trim();
  const rawContent = String(formData.get("content") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const coverUrl = String(formData.get("cover_url") ?? "").trim() || null;
  const status = formData.get("status") === "published" ? "published" : "draft";
  const seoTitle = String(formData.get("seo_title") ?? "").trim() || null;
  const seoDescription = String(formData.get("seo_description") ?? "").trim() || null;

  if (title.length < 3) return { error: "Title is too short." };

  // Sanitize editor HTML before it is ever stored or rendered.
  const content = DOMPurify.sanitize(rawContent, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "a", "img", "code", "pre", "hr",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
  });

  const slug = slugify(title);
  const db = createAdminClient();

  const payload = {
    slug,
    title,
    excerpt,
    content,
    cover_url: coverUrl,
    status,
    seo_title: seoTitle,
    seo_description: seoDescription,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  if (id) {
    const { error } = await db.from("posts").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await db.from("posts").insert(payload);
    if (error) {
      if (error.code === "23505")
        return { error: "A post with a similar title already exists." };
      return { error: error.message };
    }
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await requireAuth();
  const db = createAdminClient();
  await db.from("posts").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function togglePublish(id: string, publish: boolean) {
  await requireAuth();
  const db = createAdminClient();
  await db
    .from("posts")
    .update({
      status: publish ? "published" : "draft",
      published_at: publish ? new Date().toISOString() : null,
    })
    .eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
