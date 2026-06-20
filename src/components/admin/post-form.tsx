"use client";

import { useActionState } from "react";
import { Save, Loader2 } from "lucide-react";
import { savePost, type PostFormState } from "@/app/actions/posts";
import { RichEditor } from "./rich-editor";
import { ImagePicker } from "./image-picker";

type Post = {
  id?: string;
  title?: string;
  excerpt?: string | null;
  content?: string;
  cover_url?: string | null;
  status?: string;
  seo_title?: string | null;
  seo_description?: string | null;
};

export function PostForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState<PostFormState | undefined, FormData>(
    savePost,
    undefined,
  );

  const field =
    "mt-1.5 w-full rounded-xl border border-brand-800/15 bg-white px-4 py-2.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30";
  const label = "text-sm font-medium text-brand-800";

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div className="space-y-5 lg:col-span-2">
        <div>
          <label className={label}>Title</label>
          <input
            name="title"
            defaultValue={post?.title}
            required
            className={`${field} font-display text-lg`}
            placeholder="Sunrise spots around Bhedetar"
          />
        </div>
        <div>
          <label className={label}>Content</label>
          <div className="mt-1.5">
            <RichEditor name="content" initialHTML={post?.content ?? ""} />
          </div>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-brand-800/10 bg-white p-5">
          <label className={label}>Status</label>
          <select name="status" defaultValue={post?.status ?? "draft"} className={field}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <button
            type="submit"
            disabled={pending}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-800 px-5 py-3 font-semibold text-cream transition-colors hover:bg-brand-900 disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save post
          </button>
          {state?.error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-brand-800/10 bg-white p-5">
          <label className={label}>Cover image</label>
          <div className="mt-2">
            <ImagePicker name="cover_url" initialUrl={post?.cover_url ?? ""} />
          </div>
        </div>

        <div className="rounded-2xl border border-brand-800/10 bg-white p-5">
          <label className={label}>Excerpt</label>
          <textarea
            name="excerpt"
            defaultValue={post?.excerpt ?? ""}
            rows={3}
            className={field}
            placeholder="Short summary shown on the blog list."
          />
          <label className={`${label} mt-4 block`}>SEO title</label>
          <input name="seo_title" defaultValue={post?.seo_title ?? ""} className={field} />
          <label className={`${label} mt-4 block`}>SEO description</label>
          <textarea
            name="seo_description"
            defaultValue={post?.seo_description ?? ""}
            rows={2}
            className={field}
          />
        </div>
      </aside>
    </form>
  );
}
