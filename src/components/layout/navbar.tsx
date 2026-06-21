"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollFlag } from "@/lib/use-scroll-flag";
import { navItems, links, siteConfig } from "@/lib/site-config";

export function Navbar() {
  const scrolled = useScrollFlag(24);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        // Transition only colors — never backdrop-filter/shadow/layout — so
        // toggling the scrolled state can't trigger an expensive animated
        // repaint of the blurred bar on every frame near the threshold.
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-cream/85 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(15,34,56,0.25)] border-b border-brand-800/10"
          : "bg-gradient-to-b from-brand-950/50 to-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full font-display text-lg font-bold transition-colors",
              scrolled
                ? "bg-brand-800 text-amber-300"
                : "bg-amber-400 text-brand-950",
            )}
          >
            P
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "font-display text-lg font-semibold tracking-tight transition-colors",
                scrolled ? "text-brand-900" : "text-cream",
              )}
            >
              Paul&apos;s Hotel
            </span>
            <span
              className={cn(
                "text-[10px] uppercase tracking-[0.25em] transition-colors",
                scrolled ? "text-muted" : "text-amber-200/90",
              )}
            >
              Bhedetar · Lodge
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    scrolled
                      ? active
                        ? "text-brand-700"
                        : "text-ink/70 hover:text-brand-700"
                      : active
                        ? "text-amber-200"
                        : "text-cream/80 hover:text-cream",
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-amber-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href={links.call}
            className={cn(
              "hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 sm:inline-flex",
              scrolled
                ? "bg-brand-700 text-cream hover:bg-brand-800"
                : "bg-amber-400 text-brand-950 hover:bg-amber-300",
            )}
          >
            <Phone className="h-4 w-4" />
            {siteConfig.phone}
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full lg:hidden",
              scrolled ? "text-brand-900" : "text-cream",
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-brand-800/10 bg-cream/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-ink/80 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-xl bg-brand-700 px-4 py-3 text-center font-semibold text-cream"
              >
                Enquire on WhatsApp
              </a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
