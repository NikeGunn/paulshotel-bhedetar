import { createAdminClient } from "@/lib/supabase/admin";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const db = createAdminClient();
  const { data: images } = await db
    .from("gallery_images")
    .select("id, url, alt, category")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brand-900">Gallery</h1>
      <p className="mt-1 text-muted">
        Upload photos that appear on your public gallery page.
      </p>
      <div className="mt-8">
        <GalleryManager images={images ?? []} />
      </div>
    </div>
  );
}
