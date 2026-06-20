import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  image,
  alt,
  kicker,
  title,
  intro,
  crumb,
}: {
  image: string;
  alt: string;
  kicker?: string;
  title: string;
  intro?: string;
  crumb: string;
}) {
  return (
    <section className="relative flex h-[58vh] min-h-[420px] items-end overflow-hidden bg-brand-950 pt-20">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover animate-kenburns"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/55 to-brand-950/35" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 lg:px-8">
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-cream/70">
          <Link href="/" className="hover:text-amber-200">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-amber-200">{crumb}</span>
        </nav>
        {kicker && (
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
            {kicker}
          </span>
        )}
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-lg text-cream/85">{intro}</p>
        )}
      </div>
    </section>
  );
}
