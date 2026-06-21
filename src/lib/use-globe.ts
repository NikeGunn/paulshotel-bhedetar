"use client";

import { useEffect, type RefObject } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { siteConfig } from "@/lib/site-config";

export const BHEDETAR: [number, number] = [
  siteConfig.geo.lat,
  siteConfig.geo.lng,
];

/**
 * Shared cobe configuration for every globe on the site (DRY — was
 * duplicated across loader-globe and hotel-globe). Tuned for performance:
 * lower mapSamples and a capped devicePixelRatio keep WebGL pixel count
 * sane on mobile/low-DPI screens, which was the main source of lag.
 */
const BASE_CONFIG: Omit<COBEOptions, "width" | "height" | "onRender"> = {
  devicePixelRatio: 1.5, // overridden per-render below; cobe needs a value here
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 3,
  mapSamples: 8000, // was 11000-12000; visually identical at this size
  mapBrightness: 9,
  mapBaseBrightness: 0.05,
  baseColor: [0.38, 0.56, 0.8],
  markerColor: [1, 0.72, 0.1],
  glowColor: [0.45, 0.65, 0.95],
  markers: [],
};

/** Cap DPR so a 480px globe never renders at 960px+ on high-DPI displays. */
export function cappedDpr() {
  if (typeof window === "undefined") return 1.5;
  return Math.min(window.devicePixelRatio || 1, 1.5);
}

export type UseGlobeOpts = {
  /** Canvas the globe renders into (owned by the caller). */
  ref: RefObject<HTMLCanvasElement | null>;
  /** Pixel size used for width/height (cobe multiplies by DPR internally here). */
  size: () => number;
  markers: COBEOptions["markers"];
  /** Called each frame; mutate `state` and return next phi. */
  onFrame: (state: Record<string, number>, dpr: number, size: number) => void;
};

/**
 * Creates a cobe globe bound to the given canvas ref and tears it down on
 * unmount. Single source of truth for globe lifecycle + perf tuning.
 */
export function useGlobe({ ref, size, markers, onFrame }: UseGlobeOpts) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const dpr = cappedDpr();
    let px = size();

    const globe = createGlobe(canvas, {
      ...BASE_CONFIG,
      devicePixelRatio: dpr,
      width: px * dpr,
      height: px * dpr,
      markers,
      onRender: (state: Record<string, number>) => {
        px = size();
        onFrame(state, dpr, px);
        state.width = px * dpr;
        state.height = px * dpr;
      },
    });

    const t = setTimeout(() => (canvas.style.opacity = "1"), 60);
    return () => {
      clearTimeout(t);
      globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
