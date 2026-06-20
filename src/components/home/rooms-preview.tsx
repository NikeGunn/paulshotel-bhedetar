import Image from "next/image";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { rooms } from "@/lib/content";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function RoomsPreview() {
  return (
    <section className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeading
            kicker="Rest easy"
            title="Rooms with a view"
            intro="Simple, comfortable and spotlessly clean. Pick your room, open the curtains and let the hills do the rest."
          />
          <Link
            href="/rooms"
            className="hidden shrink-0 items-center gap-2 rounded-full border border-brand-800/20 px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-800 hover:text-cream sm:inline-flex"
          >
            View all rooms <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {rooms.map((room) => (
            <StaggerItem key={room.slug}>
              <article className="group h-full overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={room.image}
                    alt={`${room.name} at Paul's Hotel Bhedetar`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-brand-950/70 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur-sm">
                    from {room.priceFrom} / night
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold text-brand-900">
                      {room.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Users className="h-3.5 w-3.5" /> {room.capacity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{room.blurb}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {room.amenities.slice(0, 3).map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-amber-600"
                  >
                    Enquire now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
