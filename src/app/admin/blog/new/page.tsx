import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to posts
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-brand-900">
        New blog post
      </h1>
      <div className="mt-6">
        <PostForm />
      </div>
    </div>
  );
}
