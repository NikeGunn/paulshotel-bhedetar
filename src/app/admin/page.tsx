import Link from "next/link";
import { FileText, Images, Inbox, PenLine, ArrowRight } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = createAdminClient();
  const [posts, gallery, leads, newLeads] = await Promise.all([
    db.from("posts").select("id", { count: "exact", head: true }),
    db.from("gallery_images").select("id", { count: "exact", head: true }),
    db.from("inquiries").select("id", { count: "exact", head: true }),
    db.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const stats = [
    { label: "Blog posts", value: posts.count ?? 0, icon: FileText, href: "/admin/blog" },
    { label: "Gallery images", value: gallery.count ?? 0, icon: Images, href: "/admin/gallery" },
    { label: "Total enquiries", value: leads.count ?? 0, icon: Inbox, href: "/admin/leads" },
    { label: "New enquiries", value: newLeads.count ?? 0, icon: Inbox, href: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brand-900">
        Welcome back
      </h1>
      <p className="mt-1 text-muted">Here is what is happening on your site.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-brand-800/10 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-3xl font-semibold text-brand-900">
              {s.value}
            </p>
            <p className="text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/blog/new"
          className="flex items-center justify-between rounded-2xl bg-brand-800 p-6 text-cream transition-colors hover:bg-brand-900"
        >
          <span className="flex items-center gap-3">
            <PenLine className="h-5 w-5 text-amber-300" />
            <span className="font-semibold">Write a new blog post</span>
          </span>
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          href="/admin/gallery"
          className="flex items-center justify-between rounded-2xl border border-brand-800/15 bg-white p-6 text-brand-900 transition-colors hover:bg-brand-50"
        >
          <span className="flex items-center gap-3">
            <Images className="h-5 w-5 text-brand-600" />
            <span className="font-semibold">Add photos to the gallery</span>
          </span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
