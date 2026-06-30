import Image from "next/image";
import { getExperiences } from "@/lib/content-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export async function ExperiencesStrip() {
  const experiences = await getExperiences();
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          align="center"
          kicker="Things to do"
          title="More than a place to sleep"
          intro="Bhedetar is made for slow mornings and big views. Here is what waits for you just outside the door."
        />

        <div className="mt-14 space-y-16 sm:space-y-24">
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
                  <h3 className="mt-2 font-display text-2xl font-semibold text-brand-900 sm:text-3xl">
                    {exp.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted">{exp.text}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
