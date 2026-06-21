"use client";

import { useRef } from "react";
import { BHEDETAR, useGlobe } from "@/lib/use-globe";

/** Small fast-spinning earth used inside the preloader. */
export function LoaderGlobe({ size = 160 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const phi = useRef(4.1);

  useGlobe({
    ref,
    size: () => size,
    markers: [{ location: BHEDETAR, size: 0.2 }],
    // Preloader is fullscreen and short-lived; never freeze it on scroll.
    pauseOnScroll: false,
    onFrame: (state) => {
      phi.current += 0.012; // brisk spin while loading
      state.phi = phi.current;
    },
  });

  return (
    <canvas
      ref={ref}
      style={{ width: size, height: size }}
      className="opacity-0 transition-opacity duration-700"
    />
  );
}
