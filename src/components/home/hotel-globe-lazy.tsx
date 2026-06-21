"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Code-split cobe + the globe out of the initial bundle (bundle-dynamic-imports).
// ssr:false because WebGL is browser-only. The chunk is only fetched once we
// decide to mount, so it never weighs on the home page's initial load.
const HotelGlobe = dynamic(
  () => import("./hotel-globe").then((m) => m.HotelGlobe),
  { ssr: false },
);

type Idle = number;
const ric: (cb: () => void) => Idle =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? (cb) => window.requestIdleCallback(cb, { timeout: 2500 })
    : (cb) => window.setTimeout(cb, 1200) as unknown as Idle;
const cancelRic: (id: Idle) => void =
  typeof window !== "undefined" && "cancelIdleCallback" in window
    ? (id) => window.cancelIdleCallback(id)
    : (id) => window.clearTimeout(id);

/**
 * Mounts the WebGL globe lazily, with two independent triggers so it can never
 * get stuck unmounted:
 *   1. IntersectionObserver — mount as the section nears the viewport (the
 *      common case; keeps WebGL off the critical path on first paint).
 *   2. requestIdleCallback fallback — if the user never scrolls there but the
 *      browser goes idle, mount during idle time (js-request-idle-callback)
 *      so the globe is ready without ever blocking interaction.
 * A lightweight placeholder holds the layout (no CLS) until then.
 */
export function HotelGlobeLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;

    const mount = () => {
      setShow(true);
      io.disconnect();
      cancelRic(idle);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) mount();
      },
      { rootMargin: "400px" },
    );
    io.observe(el);

    // Idle fallback so a never-scrolled globe still appears eventually.
    const idle = ric(mount);

    return () => {
      io.disconnect();
      cancelRic(idle);
    };
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
