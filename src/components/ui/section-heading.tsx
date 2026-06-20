import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  intro,
  align = "left",
  light = false,
  className,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {kicker && (
        <Reveal direction={align === "center" ? "up" : "left"}>
          <span
            className={cn(
              "inline-block text-xs font-semibold uppercase tracking-[0.25em]",
              light ? "text-amber-300" : "text-amber-600",
            )}
          >
            {kicker}
          </span>
        </Reveal>
      )}
      <Reveal direction={align === "center" ? "up" : "left"} delay={0.05}>
        <h2
          className={cn(
            "mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl",
            light ? "text-cream" : "text-brand-900",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal direction={align === "center" ? "up" : "left"} delay={0.1}>
          <p
            className={cn(
              "mt-4 text-lg leading-relaxed",
              light ? "text-cream/75" : "text-muted",
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
