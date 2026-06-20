"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { deletePost, togglePublish } from "@/app/actions/posts";

export function PostRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const published = status === "published";

  return (
    <div className="inline-flex items-center gap-1">
      {published && (
        <Link
          href={`/blog/${slug}`}
          target="_blank"
          className="grid h-8 w-8 place-items-center rounded-lg text-brand-600 hover:bg-brand-50"
          title="View live"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
      <button
        onClick={() => start(() => togglePublish(id, !published))}
        disabled={pending}
        className="grid h-8 w-8 place-items-center rounded-lg text-brand-700 hover:bg-brand-50"
        title={published ? "Unpublish" : "Publish"}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : published ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={() => {
          if (confirm("Delete this post? This cannot be undone.")) {
            start(() => deletePost(id));
          }
        }}
        disabled={pending}
        className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
