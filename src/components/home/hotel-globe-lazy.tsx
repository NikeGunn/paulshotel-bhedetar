"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Code-split cobe + the globe out of the initial bundle (bundle-dynamic-imports).
// ssr:false because WebGL is browser-only.
const HotelGlobe = dynamic(
  () => import("./hotel-globe").then((m) => m.HotelGlobe),
  { ssr: false },
);

/**
 * Mounts the WebGL globe ONLY when its section actually nears the viewport.
 *
 * Earlier this also had a requestIdleCallback fallback so it would mount even
 * if the user never scrolled — but profiling showed that fired while the user
 * was sitting idle at the top of the page and cobe's WebGL init produced a
 * ~500ms idle long-animation-frame (visible jank for no reason). The globe is
 * decorative and far below the fold, so IntersectionObserver-only is correct:
 * no scroll to it => no cost. A placeholder holds the layout (no CLS).
 */
export function HotelGlobeLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      // Mount well before the globe is visible so cobe's WebGL init happens
      // while the section is still off-screen, never on the frame it scrolls in.
      { rootMargin: "800px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} className="mx-auto aspect-square w-full max-w-[480px]">
      {show ? (
        <HotelGlobe />
      ) : (
        <div className="relative h-full w-full" aria-hidden>
          <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-6 rounded-full bg-brand-500/10 blur-2xl" />
        </div>
      )}
    </div>
  );
}
