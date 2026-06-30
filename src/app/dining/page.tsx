import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/ui/page-hero";
import { getSettings, contactLinks } from "@/lib/settings";
import { getDishes } from "@/lib/content-data";

export const metadata: Metadata = {
  title: "Dining, Bar & Lounge",
  description:
    "Hearty Nepali food and a relaxed bar at Paul's Hotel Bhedetar. Smoky sekuwa, steaming momo, hot thukpa, biryani, chowmein and a lounge with valley views.",
  alternates: { canonical: "/dining" },
};

export default async function DiningPage() {
  const [settings, dishes] = await Promise.all([getSettings(), getDishes()]);
  const { whatsappHref } = contactLinks(settings);
  return (
    <>
      <PageHero
        crumb="Dining"
        kicker="Eat, drink, unwind"
        title="Food worth the drive up"
        intro="The kitchen runs all day. Warm up with thukpa, dig into sekuwa fresh off the grill, then settle into the lounge as the lights come on."
        image="/images/food/chicken-sekuwa.webp"
        alt="Chicken sekuwa platter at Paul's Hotel"
      />

      {/* Bar feature */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal direction="left">
              <div className="overflow-hidden rounded-[2rem] shadow-xl">
                <Image
                  src="/images/bar/bar-blue-led.webp"
                  alt="Bar with blue LED lighting at Paul's Hotel Bhedetar"
                  width={720}
                  height={520}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <SectionHeading
                kicker="The bar and lounge"
                title="A drink with a view"
                intro="When the temperature drops, the lounge is the place to be. Cold beers, a relaxed vibe and the city lights twinkling far below. The perfect end to a day in the hills."
              />
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-800 px-7 py-3.5 font-semibold text-cream transition-transform hover:-translate-y-0.5"
              >
                Reserve a table
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Food gallery */}
      <section className="bg-sand py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            align="center"
            kicker="From our kitchen"
            title="Taste of the hills"
            intro="A few favourites from the menu. Tell us what you are craving and we will sort you out."
          />
          <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
            {dishes.map((dish) => (
              <StaggerItem key={dish.name}>
                <figure className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm">
                  <Image
                    src={dish.src}
                    alt={`${dish.name} at Paul's Hotel Bhedetar`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-3 left-4 font-display text-lg font-semibold text-cream">
                    {dish.name}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
