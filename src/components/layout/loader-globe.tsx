"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { siteConfig } from "@/lib/site-config";

const BHEDETAR: [number, number] = [siteConfig.geo.lat, siteConfig.geo.lng];

/** Small fast-spinning earth used inside the preloader. */
export function LoaderGlobe({ size = 160 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let phi = 4.1;
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 11000,
      mapBrightness: 9,
      mapBaseBrightness: 0.05,
      baseColor: [0.38, 0.56, 0.8],
      markerColor: [1, 0.72, 0.1],
      glowColor: [0.45, 0.65, 0.95],
      markers: [{ location: BHEDETAR, size: 0.2 }],
      onRender: (state: Record<string, number>) => {
        phi += 0.012; // brisk spin while loading
        state.phi = phi;
      },
    });
    const t = setTimeout(() => (canvas.style.opacity = "1"), 60);
    return () => {
      clearTimeout(t);
      globe.destroy();
    };
  }, [size]);

  return (
    <canvas
      ref={ref}
      style={{ width: size, height: size }}
      className="opacity-0 transition-opacity duration-700"
    />
  );
}
