"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { CardItem } from "./card-fan-carousel";

// GSAP is heavy and the fan sits well below the fold — code-split it and only
// load it when the section nears the viewport. Keeps GSAP off the home page's
// initial bundle and critical path entirely.
const SocialCards = dynamic(() => import("./card-fan-carousel"), { ssr: false });

export function CardFanLazy({ cards }: { cards: CardItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  // Reserve the fan's height so mounting it later causes no layout shift.
  return (
    <div ref={ref} className="min-h-[22rem] sm:min-h-[26rem] lg:min-h-[38rem]">
      {show && <SocialCards cards={cards} />}
    </div>
  );
}
