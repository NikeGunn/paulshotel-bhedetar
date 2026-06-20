import Image from "next/image";
import Link from "next/link";
import { BedDouble, UtensilsCrossed, Wine, Mountain, ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  {
    icon: BedDouble,
    title: "Cosy mountain rooms",
    text: "Warm beds and big windows that frame the hills the moment you wake.",
    href: "/rooms",
  },
  {
    icon: UtensilsCrossed,
    title: "Hearty local food",
    text: "Sekuwa, momo, thukpa and more, cooked fresh and served hot.",
    href: "/dining",
  },
  {
    icon: Wine,
    title: "Bar and lounge",
    text: "A relaxed spot for a drink as the temperature drops and the lights come on.",
    href: "/dining",
  },
  {
    icon: Mountain,
    title: "Views and adventure",
    text: "Sunrise points, the Sky Walk and Charles Point, all on your doorstep.",
    href: "/experiences",
  },
];

export function Highlights() {
  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: image collage with parallax feel */}
          <Reveal direction="left">
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-2xl">
                <Image
                  src="/images/hotel/exterior-terrace-evening.webp"
                  alt="Paul's Hotel terrace glowing in the evening with hill views"
                  width={720}
                  height={820}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 hidden w-48 overflow-hidden rounded-2xl border-4 border-cream shadow-xl sm:block">
                <Image
                  src="/images/rooms/deluxe-double-accent.webp"
                  alt="Deluxe double room with warm accent lighting"
                  width={240}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -left-4 -top-6 hidden rounded-2xl bg-brand-800 px-5 py-4 text-cream shadow-xl sm:block">
                <p className="font-display text-2xl font-semibold">1,420m</p>
                <p className="text-xs uppercase tracking-wider text-amber-200">above sea level</p>
              </div>
            </div>
          </Reveal>

          {/* Right: copy + features */}
          <div>
            <SectionHeading
              kicker="Welcome to Bhedetar"
              title="The hill escape you have been looking for"
              intro="Just up the road from Dharan, Bhedetar trades heat and traffic for cool air, quiet mornings and views that go on for miles. Paul's Hotel & Lodge is your warm, friendly base for all of it."
            />
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <StaggerItem key={f.title}>
                  <Link
                    href={f.href}
                    className="group block h-full rounded-2xl border border-brand-800/10 bg-white p-5 transition-all hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-lg"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-amber-400 group-hover:text-brand-950">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-brand-900">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                      Discover <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
