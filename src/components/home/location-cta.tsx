import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { HotelGlobe } from "./hotel-globe";
import { links, siteConfig } from "@/lib/site-config";

export function LocationCTA() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    siteConfig.mapEmbedQuery,
  )}&output=embed`;

  return (
    <section className="relative overflow-hidden bg-brand-950 py-20 text-cream sm:py-28">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-brand-700/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Globe */}
          <Reveal direction="left">
            <HotelGlobe />
          </Reveal>

          {/* Details */}
          <Reveal direction="right" delay={0.1}>
            <SectionHeading
              light
              kicker="Find us on the map"
              title="High in the hills at Charles Point"
              intro="Spin the globe and there we are, perched above Dharan in Bhedetar. An easy, scenic drive up the Dharan to Dhankuta highway. Come for the day, stay for the sunrise."
            />

            <ul className="mt-8 space-y-4">
              <li className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream/10 text-amber-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-cream">Address</p>
                  <p className="text-sm text-cream/70">{siteConfig.address.full}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream/10 text-amber-300">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-cream">Call or WhatsApp</p>
                  <a href={links.call} className="text-sm text-cream/70 hover:text-amber-200">
                    {siteConfig.phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream/10 text-amber-300">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-cream">Hours</p>
                  <p className="text-sm text-cream/70">{siteConfig.hours}</p>
                </div>
              </li>
            </ul>

            <a
              href={links.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 font-semibold text-brand-950 transition-transform hover:-translate-y-0.5"
            >
              <Navigation className="h-4 w-4" /> Get directions
            </a>
          </Reveal>
        </div>

        {/* Precise embedded map below */}
        <Reveal direction="up" className="mt-14">
          <div className="overflow-hidden rounded-[2rem] border-4 border-cream/10 shadow-2xl">
            <iframe
              title="Map showing Paul's Hotel in Bhedetar"
              src={mapSrc}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
