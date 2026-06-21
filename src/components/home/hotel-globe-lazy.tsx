"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Code-split cobe + the globe out of the initial bundle; only fetched when the
// section nears the viewport. ssr:false because WebGL is browser-only.
const HotelGlobe = dynamic(
  () => import("./hotel-globe").then((m) => m.HotelGlobe),
  { ssr: false },
);

/**
 * Mounts the WebGL globe only once its container scrolls near the viewport.
 * Before that it renders a lightweight placeholder, so no WebGL context (and
 * no cobe download) is created on initial page load — the main cause of the
 * home page's startup lag.
 */
export function HotelGlobeLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto aspect-square w-full max-w-[480px]">
      {show ? (
        <HotelGlobe />
      ) : (
        // Placeholder keeps layout stable (no CLS) until the globe mounts.
        <div className="relative h-full w-full">
          <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-6 rounded-full bg-brand-500/10 blur-2xl" />
        </div>
      )}
    </div>
  );
}
