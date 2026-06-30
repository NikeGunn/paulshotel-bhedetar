import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Users, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { getSettings, contactLinks } from "@/lib/settings";
import { getRooms } from "@/lib/content-data";
import { getPageText } from "@/lib/page-text-data";

export const metadata: Metadata = {
  title: "Rooms in Bhedetar",
  description:
    "Clean, comfortable rooms at Paul's Hotel & Lodge in Bhedetar. Mountain and valley views, cosy bedding and warm hospitality, from budget twins to family stays.",
  alternates: { canonical: "/rooms" },
};

export default async function RoomsPage() {
  const [settings, rooms, pt] = await Promise.all([getSettings(), getRooms(), getPageText()]);
  const { whatsappHref } = contactLinks(settings);
  return (
    <>
      <PageHero
        crumb="Rooms"
        kicker={pt("rooms.hero.kicker")}
        title={pt("rooms.hero.title")}
        intro={pt("rooms.hero.intro")}
        image="/images/rooms/twin-room.webp"
        alt="Twin room at Paul's Hotel Bhedetar"
      />

      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl space-y-20 px-5 lg:px-8">
          {rooms.map((room, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={room.slug}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <Reveal
                  direction={reversed ? "right" : "left"}
                  className={reversed ? "lg:order-2" : ""}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
                    <Image
                      src={room.image}
                      alt={`${room.name} at Paul's Hotel Bhedetar`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-brand-950/70 px-4 py-1.5 text-sm font-semibold text-amber-200 backdrop-blur-sm">
                      from {room.priceFrom} / night
                    </span>
                  </div>
                </Reveal>
                <Reveal
                  direction={reversed ? "left" : "right"}
                  delay={0.1}
                  className={reversed ? "lg:order-1" : ""}
                >
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                    <Users className="h-4 w-4" /> {room.capacity}
                  </span>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-brand-900">
                    {room.name}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted">
                    {room.blurb}
                  </p>
                  <ul className="mt-6 grid grid-cols-2 gap-3">
                    {room.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-sm text-brand-800">
                        <Check className="h-4 w-4 text-amber-500" /> {a}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-brand-950 transition-transform hover:-translate-y-0.5"
                    >
                      Check availability <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full border border-brand-800/20 px-6 py-3 font-semibold text-brand-800 transition-colors hover:bg-brand-800 hover:text-cream"
                    >
                      Enquire
                    </Link>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
