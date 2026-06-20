import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dishes } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";

const row = [...dishes, ...dishes]; // duplicate for seamless loop

export function FoodMarquee() {
  return (
    <section className="overflow-hidden bg-brand-950 py-20 text-cream sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          light
          align="center"
          kicker="From our kitchen"
          title="Food worth the drive up"
          intro="Smoky sekuwa, steaming momo, hot thukpa and more. Real, fresh and full of flavour, just the thing after a day in the hills."
        />
      </div>

      {/* Row 1: GPU marquee scrolling left */}
      <div className="marquee-pause relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-950 to-transparent" />
        <div
          className="marquee-track gap-5"
          style={
            {
              "--marquee-anim": "marquee-left",
              "--marquee-dur": "44s",
            } as React.CSSProperties
          }
        >
          {row.map((dish, i) => (
            <div
              key={`${dish.name}-${i}`}
              className="relative h-56 w-72 shrink-0 overflow-hidden rounded-2xl"
            >
              <Image
                src={dish.src}
                alt={`${dish.name} served at Paul's Hotel Bhedetar`}
                fill
                sizes="288px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-lg font-semibold">
                {dish.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/dining"
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 font-semibold text-brand-950 transition-transform hover:-translate-y-0.5"
        >
          See the full menu vibe <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
