import SocialCards from "@/components/ui/card-fan-carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import { galleryImages } from "@/lib/content";

// Pick a striking, varied set of real hotel photos for the fan.
const picks = [
  "/images/hotel/exterior-blue-dusk.webp",
  "/images/views/night-valley-citylights.webp",
  "/images/rooms/deluxe-double-accent.webp",
  "/images/hotel/terrace-string-lights.webp",
  "/images/bar/bar-blue-led.webp",
  "/images/food/chicken-sekuwa.webp",
  "/images/views/night-sky-stars.webp",
  "/images/hotel/lounge-sky-walk.webp",
  "/images/rooms/twin-room.webp",
  "/images/hotel/exterior-terrace-evening.webp",
];

const cards = picks.map((src) => {
  const meta = galleryImages.find((g) => g.src === src);
  return { imgUrl: src, alt: meta?.alt ?? "Paul's Hotel Bhedetar", caption: meta?.category };
});

export function FanShowcase() {
  return (
    <section className="overflow-hidden bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          align="center"
          kicker="A glimpse inside"
          title="Fan through the moments"
          intro="Hover and swipe through a few of our favourite corners. Drag the deck, the rooms, the views and the food are all waiting."
        />
      </div>
      <div className="mt-6">
        <SocialCards cards={cards} />
      </div>
    </section>
  );
}
