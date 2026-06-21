"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to scroll and returns a boolean that flips when scrollY crosses
 * `threshold`. The scroll handler is coalesced to one read per animation frame
 * (rAF), and React state is only updated when the boolean actually changes — so
 * scrolling triggers at most two re-renders total (one per crossing), never one
 * per scroll event. This removes the per-frame setState churn that was blocking
 * frames during scroll.
 */
export function useScrollFlag(threshold: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let ticking = false;
    let current = past;

    const evaluate = () => {
      ticking = false;
      const next = window.scrollY > threshold;
      if (next !== current) {
        current = next;
        setPast(next);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(evaluate);
      }
    };

    evaluate(); // sync initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  return past;
}
