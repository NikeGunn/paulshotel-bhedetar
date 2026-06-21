"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "left" | "right" | "scale";

/**
 * Scroll reveal — CSS/compositor driven, NOT a JS animation engine.
 *
 * Previously every Reveal/Stagger mounted a Framer Motion `whileInView`, which
 * meant ~30 IntersectionObservers PLUS Motion's animation loop running during
 * scroll. Profiling (LoAF, 4x CPU throttle) showed this `event-listener`
 * scripting dominating scroll frames (~1.5s of blocking). Here we instead use
 * one IntersectionObserver per element that does a single job — add an
 * `is-in` class once — and let a CSS transition (transform+opacity, both
 * compositor properties) do the animation. No per-frame JS, observers
 * disconnect after firing. Same look, a fraction of the main-thread cost.
 */

const fromClass: Record<Direction, string> = {
  up: "translate-y-12",
  left: "-translate-x-16",
  right: "translate-x-16",
  scale: "scale-95",
};

function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: "-80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, inView] as const;
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(once);
  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={cn(
        "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] motion-reduce:transition-none",
        inView ? "translate-x-0 translate-y-0 scale-100 opacity-100" : cn("opacity-0", fromClass[direction]),
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Stagger container: children fade/slide up in sequence. Uses a single IO on
 * the container and CSS transition-delay per child (no JS animation engine).
 */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(true);
  return (
    <div
      ref={ref}
      data-in={inView ? "true" : "false"}
      className={cn("stagger-root", className)}
    >
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("stagger-item", className)}>{children}</div>;
}
