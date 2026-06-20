import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { experiences } from "@/lib/content";
import { Sunrise, Footprints, Mountain, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Things to Do in Bhedetar",
  description:
    "Sunrise viewpoints, the Bhedetar Sky Walk, Charles Point and cool hilltop evenings. Discover what to do around Paul's Hotel & Lodge in Bhedetar, Dhankuta.",
  alternates: { canonical: "/experiences" },
};

const quick = [
  { icon: Sunrise, label: "Sunrise viewpoint", note: "Best on clear mornings" },
  { icon: Footprints, label: "Bhedetar Sky Walk", note: "Glass walkway over the ridge" },
  { icon: Mountain, label: "Charles Point", note: "The classic lookout" },
  { icon: Sparkles, label: "Night sky", note: "Stars far from city glow" },
];

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        crumb="Experiences"
        kicker="Things to do"
        title="More than a place to sleep"
        intro="Bhedetar is a hill station made for slow mornings, big views and cool mountain air. Here is what waits just outside the door."
        image="/images/hotel/exterior-foggy-day.webp"
        alt="Paul's Hotel wrapped in hill fog at Charles Point"
      />

      {/* Quick facts */}
      <section className="bg-cream pt-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quick.map((q) => (
              <StaggerItem key={q.label}>
                <div className="rounded-2xl border border-brand-800/10 bg-white p-6 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <q.icon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 font-display text-lg font-semibold text-brand-900">
                    {q.label}
                  </p>
                  <p className="mt-1 text-sm text-muted">{q.note}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Detailed experiences */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl space-y-16 px-5 sm:space-y-24 lg:px-8">
          {experiences.map((exp, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={exp.title}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <Reveal
                  direction={reversed ? "right" : "left"}
                  className={reversed ? "lg:order-2" : ""}
                >
                  <div className="overflow-hidden rounded-[2rem] shadow-xl">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      width={720}
                      height={520}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Reveal>
                <Reveal
                  direction={reversed ? "left" : "right"}
                  delay={0.1}
                  className={reversed ? "lg:order-1" : ""}
                >
                  <span className="font-display text-6xl font-semibold text-amber-400/40">
                    0{i + 1}
                  </span>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-brand-900">
                    {exp.title}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted">{exp.text}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
