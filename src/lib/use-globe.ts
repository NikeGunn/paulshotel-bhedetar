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
  /** Called each frame; mutate `state`. Skipped while the globe is frozen. */
  onFrame: (state: Record<string, number>, dpr: number, size: number) => void;
  /** Freeze (render a 0px buffer) when off-screen and during scroll. Default true. */
  pauseOnScroll?: boolean;
};

/**
 * Creates a cobe globe bound to the given canvas ref and tears it down on
 * unmount. Single source of truth for globe lifecycle + perf tuning.
 *
 * Key perf trick: cobe (via phenomenon) does a per-frame `readPixels`, which
 * forces a GPU→CPU sync stall every frame the globe renders. During page
 * scroll that stall fights the compositor and causes visible jank (worst on
 * scroll-direction changes). So while the user is scrolling — or the globe is
 * off-screen — we feed cobe a 0×0 render buffer. cobe then does effectively no
 * GPU work and `readPixels` reads nothing, eliminating the stall. The canvas
 * keeps its CSS box (no layout shift) and the last frame stays painted, so the
 * globe simply looks "frozen" mid-scroll and resumes spinning once scrolling
 * settles. Net: smooth scrolling in both directions.
 */
export function useGlobe({
  ref,
  size,
  markers,
  onFrame,
  pauseOnScroll = true,
}: UseGlobeOpts) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const dpr = cappedDpr();
    let px = size();

    let onScreen = true;
    let scrolling = false;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;

    const frozen = () => pauseOnScroll && (!onScreen || scrolling);

    const io = new IntersectionObserver(
      ([entry]) => (onScreen = entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const onScroll = () => {
      scrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      // Resume ~140ms after the last scroll event (scroll has settled).
      scrollTimer = setTimeout(() => (scrolling = false), 140);
    };
    if (pauseOnScroll)
      window.addEventListener("scroll", onScroll, { passive: true });

    const globe = createGlobe(canvas, {
      ...BASE_CONFIG,
      devicePixelRatio: dpr,
      width: px * dpr,
      height: px * dpr,
      markers,
      onRender: (state: Record<string, number>) => {
        if (frozen()) {
          // 0×0 buffer => cobe does ~no GPU work, no readPixels stall.
          state.width = 0;
          state.height = 0;
          return;
        }
        px = size();
        onFrame(state, dpr, px);
        state.width = px * dpr;
        state.height = px * dpr;
      },
    });

    const t = setTimeout(() => (canvas.style.opacity = "1"), 60);
    return () => {
      clearTimeout(t);
      if (scrollTimer) clearTimeout(scrollTimer);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
