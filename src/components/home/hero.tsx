"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star, MapPin, ArrowRight } from "lucide-react";
import { links, siteConfig } from "@/lib/site-config";

const slides = [
  {
    src: "/images/hotel/exterior-blue-dusk.webp",
    alt: "Paul's Hotel & Lodge lit up blue at dusk in Bhedetar",
    kicker: "Charles Point · Bhedetar",
    title: "Wake up above the clouds",
    sub: "A hilltop hideaway where the morning mist clears to reveal the whole valley.",
  },
  {
    src: "/images/views/night-valley-citylights.webp",
    alt: "City lights twinkling across the valley at night from Bhedetar",
    kicker: "After dark",
    title: "City lights, a thousand feet below",
    sub: "Sip something warm on the terrace while Dharan glitters beneath you.",
  },
  {
    src: "/images/hotel/terrace-string-lights.webp",
    alt: "Open-air terrace strung with festive lights at Paul's Hotel",
    kicker: "The terrace",
    title: "Evenings that slow right down",
    sub: "String lights, mountain air and good food under an open sky.",
  },
  {
    src: "/images/views/night-sky-stars.webp",
    alt: "Star filled night sky over the hills around Bhedetar",
    kicker: "Above the haze",
    title: "Skies full of stars",
    sub: "Far from the city glow, the night sky comes alive over Bhedetar.",
  },
];

export function Hero() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-brand-950">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={slide.src} className="relative h-full min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover ${selected === i ? "animate-kenburns" : ""}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-brand-950/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-950/70 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-end pb-24 sm:items-center sm:pb-0">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-brand-950/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-amber-200 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" /> {slides[selected].kicker}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
              {slides[selected].title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-cream/85">
              {slides[selected].sub}
            </p>

            <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-4">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 font-semibold text-brand-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-amber-300"
              >
                Book your stay
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 font-semibold text-cream backdrop-blur-sm transition-colors hover:bg-cream/10"
              >
                Explore rooms
              </Link>
              <div className="inline-flex items-center gap-2 text-sm text-cream/80">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-cream">{siteConfig.rating.value}</span>
                <span>· {siteConfig.rating.count} reviews</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
        <button
          onClick={() => embla?.scrollPrev()}
          aria-label="Previous slide"
          className="grid h-10 w-10 place-items-center rounded-full border border-cream/30 text-cream backdrop-blur-sm transition-colors hover:bg-cream/15"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                selected === i ? "w-8 bg-amber-400" : "w-2 bg-cream/40"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => embla?.scrollNext()}
          aria-label="Next slide"
          className="grid h-10 w-10 place-items-center rounded-full border border-cream/30 text-cream backdrop-blur-sm transition-colors hover:bg-cream/15"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
