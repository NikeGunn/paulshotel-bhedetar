import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { PostRowActions } from "@/components/admin/post-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminBlogList() {
  const db = createAdminClient();
  const { data: posts } = await db
    .from("posts")
    .select("id, slug, title, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-900">Blog posts</h1>
          <p className="mt-1 text-muted">Write and manage your travel stories.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-800 px-5 py-2.5 font-semibold text-cream transition-colors hover:bg-brand-900"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-brand-800/10 bg-white">
        {!posts || posts.length === 0 ? (
          <p className="p-10 text-center text-muted">
            No posts yet. Click <strong>New post</strong> to write your first one.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-800/10 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Status</th>
                <th className="hidden px-5 py-3 sm:table-cell">Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-brand-800/5 last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="flex items-center gap-2 font-medium text-brand-900 hover:text-brand-600"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted" /> {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3 text-muted sm:table-cell">
                    {formatDate(p.updated_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <PostRowActions id={p.id} slug={p.slug} status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
