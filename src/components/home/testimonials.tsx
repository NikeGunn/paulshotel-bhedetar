import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSettings } from "@/lib/settings";

type Review = (typeof testimonials)[number];

function Card({ t }: { t: Review }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-brand-800/5 sm:w-[420px]">
      <div className="flex items-center justify-between">
        <Quote className="h-8 w-8 text-amber-400/50" />
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < t.rating ? "fill-amber-400 text-amber-400" : "text-brand-200"
              }`}
            />
          ))}
        </div>
      </div>
      <blockquote className="mt-4 flex-1 font-display text-base italic leading-relaxed text-brand-900">
        &ldquo;{t.text}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-brand-800/10 pt-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-800 font-display text-sm font-semibold text-amber-200">
          {t.name.charAt(0)}
        </span>
        <span>
          <span className="block font-semibold text-brand-800">{t.name}</span>
          <span className="block text-sm text-muted">{t.location}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** A GPU marquee row that scrolls in one direction and pauses on hover. */
function MarqueeRow({
  reviews,
  direction,
  duration,
}: {
  reviews: Review[];
  direction: "left" | "right";
  duration: string;
}) {
  const loop = [...reviews, ...reviews];

  return (
    <div className="marquee-pause relative overflow-hidden py-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-sand to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-sand to-transparent sm:w-32" />
      <div
        className="marquee-track items-stretch gap-6 [&>*]:my-1"
        style={
          {
            "--marquee-anim":
              direction === "left" ? "marquee-left" : "marquee-right",
            "--marquee-dur": duration,
          } as React.CSSProperties
        }
      >
        {loop.map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export async function Testimonials() {
  const { rating } = await getSettings();
  const half = Math.ceil(testimonials.length / 2);
  const rowA = [...testimonials];
  const rowB = [...testimonials.slice(half), ...testimonials.slice(0, half)];

  return (
    <section className="overflow-hidden bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          align="center"
          kicker={`Rated ${rating.value} by ${rating.count} guests`}
          title="What people say"
          intro="Real words from travellers after a stay up in the clouds with us."
        />
      </div>

      {/* Row 1 scrolls left, Row 2 the other way. Generous gap between. */}
      <div className="mt-14 space-y-6">
        <MarqueeRow reviews={rowA} direction="left" duration="50s" />
        <MarqueeRow reviews={rowB} direction="right" duration="58s" />
      </div>
    </section>
  );
}
