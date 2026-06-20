import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { galleryImages } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "See Paul's Hotel & Lodge Bhedetar in pictures: rooms, food, the bar and lounge, the terrace and those famous valley and night sky views.",
  alternates: { canonical: "/gallery" },
};

export const revalidate = 60;

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: uploaded } = await supabase
    .from("gallery_images")
    .select("url, alt, category")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  // Admin-uploaded photos first, then the built-in showcase set.
  const dbImages = (uploaded ?? []).map((g) => ({
    src: g.url,
    alt: g.alt,
    category: g.category,
  }));
  const images = [...dbImages, ...galleryImages];

  return (
    <>
      <PageHero
        crumb="Gallery"
        kicker="In pictures"
        title="A look around"
        intro="Rooms, food, the terrace and the views that keep guests coming back. Tap any photo to take a closer look."
        image="/images/hotel/terrace-string-lights.webp"
        alt="Terrace at Paul's Hotel lit with string lights"
      />
      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
