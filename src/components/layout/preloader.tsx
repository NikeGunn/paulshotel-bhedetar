"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { LoaderGlobe } from "./loader-globe";

const WORDS = ["clouds", "comfort", "sunrise", "Bhedetar"];

export function Preloader({ name = "Paul's Hotel & Lodge" }: { name?: string }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [show, setShow] = useState(true);
  const [done, setDone] = useState(false);
  const [word, setWord] = useState(0);

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  const dash = useTransform(count, (v) => 283 - (283 * v) / 100);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isAdmin || sessionStorage.getItem("psh-loaded")) {
      setShow(false);
      return;
    }
    document.body.style.overflow = "hidden";

    const unsub = rounded.on("change", (v) => setDisplay(v));
    const controls = animate(count, 100, {
      duration: 2.4,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        setDone(true);
        setTimeout(() => {
          sessionStorage.setItem("psh-loaded", "1");
          document.body.style.overflow = "";
          setShow(false);
        }, 750);
      },
    });

    const wordTimer = setInterval(
      () => setWord((w) => (w + 1) % WORDS.length),
      650,
    );

    // Failsafe: the preloader must NEVER trap the site. If the count animation
    // stalls for any reason (JS error elsewhere, throttled tab, a chunk that
    // failed to load), force-dismiss after a hard ceiling so the page is always
    // reachable.
    const failsafe = setTimeout(() => {
      sessionStorage.setItem("psh-loaded", "1");
      document.body.style.overflow = "";
      setDone(true);
      setShow(false);
    }, 6000);

    return () => {
      controls.stop();
      unsub();
      clearInterval(wordTimer);
      clearTimeout(failsafe);
      document.body.style.overflow = "";
    };
  }, [isAdmin, count, rounded]);

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-brand-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* split curtains */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-brand-950"
            animate={done ? { x: "-100%" } : { x: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-brand-950"
            animate={done ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* ambient glows */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 translate-y-1/3 rounded-[100%] bg-brand-700/20 blur-3xl" />

          {/* center content (dead-center, both axes) */}
          <motion.div
            className="absolute inset-0 z-10 grid place-items-center px-6"
            animate={done ? { opacity: 0, scale: 1.04 } : { opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center text-center">
              {/* spinning earth with progress ring around it */}
              <div className="relative grid h-44 w-44 place-items-center sm:h-52 sm:w-52">
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(251,250,247,0.08)" strokeWidth="1.5" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="47"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="295"
                    style={{ strokeDashoffset: dash }}
                  />
                </svg>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LoaderGlobe size={150} />
                </motion.div>
              </div>

              <motion.h1
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-8 font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl"
              >
                {name}
              </motion.h1>

            {/* rotating tagline word */}
            <p className="mt-2 flex items-center gap-1.5 text-sm text-cream/60">
              Wake up to
              <span className="relative inline-grid h-5 min-w-[5.5rem] overflow-hidden text-left">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={word}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-semibold text-amber-300"
                  >
                    {WORDS[word]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </p>

            {/* big animated counter */}
            <div className="mt-8 flex items-end gap-1 font-display text-cream">
              <span className="text-6xl font-semibold tabular-nums sm:text-7xl">
                {display}
              </span>
              <span className="mb-2 text-2xl text-amber-300">%</span>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-[0.35em] text-cream/40">
              Bhedetar · Nepal
            </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
