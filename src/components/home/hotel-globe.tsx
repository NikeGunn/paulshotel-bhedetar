"use client";

import { useEffect, useRef } from "react";
import { useSpring } from "motion/react";
import { BHEDETAR, useGlobe } from "@/lib/use-globe";

// Cities guests travel from, converging on Bhedetar. [lat, lng]
const SOURCES: { loc: [number, number]; size: number }[] = [
  { loc: [27.7172, 85.324], size: 0.05 }, // Kathmandu
  { loc: [26.8125, 87.2837], size: 0.04 }, // Dharan
  { loc: [26.4525, 87.2718], size: 0.04 }, // Biratnagar
  { loc: [28.6139, 77.209], size: 0.05 }, // Delhi
  { loc: [22.5726, 88.3639], size: 0.04 }, // Kolkata
  { loc: [25.6, 85.1], size: 0.03 }, // Patna
];

export function HotelGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const r = useSpring(0, { stiffness: 280, damping: 40, mass: 1 });
  const onScreen = useRef(true);

  // Start centered on South Asia (Nepal ~87E) so Bhedetar faces the viewer.
  const phi = useRef(4.1);

  useGlobe({
    ref: canvasRef,
    size: () => canvasRef.current?.offsetWidth ?? 0,
    markers: [
      { location: BHEDETAR, size: 0.18 },
      ...SOURCES.map((s) => ({ location: s.loc, size: s.size })),
    ],
    onFrame: (state) => {
      // Advance rotation only when visible and not being dragged (saves GPU).
      if (onScreen.current && pointerInteracting.current === null)
        phi.current += 0.0035;
      state.phi = phi.current + r.get();
    },
  });

  // Pause the globe's rotation when it scrolls out of view.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(
      ([entry]) => (onScreen.current = entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(canvas);
    return () => io.disconnect();
  }, [canvasRef]);

  return (
    <div className="relative h-full w-full">
      {/* halo */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-6 rounded-full bg-brand-500/10 blur-2xl" />

      {/* animated incoming arcs (great-circle feel) over the globe.
          motion-reduce hides the SMIL animation for reduced-motion users. */}
      <svg
        viewBox="0 0 480 480"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full motion-reduce:hidden"
        aria-hidden
      >
        <defs>
          <radialGradient id="arcFade" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[
          "M 60 150 Q 180 60 240 240",
          "M 430 120 Q 300 70 240 240",
          "M 90 360 Q 170 320 240 240",
          "M 400 350 Q 320 300 240 240",
          "M 240 40 Q 250 150 240 240",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 280"
            opacity="0.7"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="286"
              to="0"
              dur={`${2.6 + i * 0.4}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
        {/* pulsing ring on Bhedetar (center) */}
        <circle cx="240" cy="240" r="6" fill="#f59e0b" />
        <circle cx="240" cy="240" r="6" fill="none" stroke="#f59e0b" strokeWidth="2">
          <animate attributeName="r" from="6" to="26" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.8" to="0" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </svg>

      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerMovement.current = delta;
            r.set(delta / 200);
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerMovement.current = delta;
            r.set(delta / 100);
          }
        }}
        className="relative aspect-square w-full cursor-grab opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        style={{ touchAction: "pan-y" }}
      />

      {/* label */}
      <span className="pointer-events-none absolute inset-x-0 -bottom-2 z-20 mx-auto flex w-fit items-center gap-2 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-brand-950 shadow-lg">
        <span className="h-2 w-2 animate-pulse rounded-full bg-brand-900" />
        Guests arrive from across Nepal &amp; India · drag to spin
      </span>
    </div>
  );
}
