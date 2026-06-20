import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight, Star } from "lucide-react";
import { navItems, links, siteConfig } from "@/lib/site-config";

const year = new Date().getFullYear();

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-cream/80">
      {/* string-light top accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-[100%] bg-amber-500/10 blur-3xl" />

      {/* CTA band */}
      <div className="relative mx-auto max-w-7xl px-5 pt-16 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-amber-400/20 bg-gradient-to-br from-brand-900 to-brand-950 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-display text-2xl font-semibold text-cream md:text-3xl">
              Plan your stay above the clouds
            </p>
            <p className="mt-2 max-w-md text-sm text-cream/70">
              Rooms, food and sunrise views at Charles Point, Bhedetar. Message us
              for live availability and rates.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-brand-950 transition-transform hover:-translate-y-0.5"
            >
              WhatsApp us <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              Enquire
            </Link>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 font-display text-xl font-bold text-brand-950">
              P
            </span>
            <span className="font-display text-xl font-semibold text-cream">
              Paul&apos;s Hotel &amp; Lodge
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/65">
            {siteConfig.tagline}.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream/5 px-3 py-1.5 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-cream">{siteConfig.rating.value}</span>
            <span className="text-cream/55">· {siteConfig.rating.count} Google reviews</span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-amber-200/90">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-cream/70 transition-colors hover:text-amber-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-amber-200/90">
            Reach us
          </h3>
          <ul className="mt-4 space-y-3.5 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <span className="text-cream/70">{siteConfig.address.full}</span>
            </li>
            <li>
              <a href={links.call} className="flex gap-3 text-cream/70 hover:text-amber-200">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={links.mailto} className="flex gap-3 break-all text-cream/70 hover:text-amber-200">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-amber-200/90">
            Follow
          </h3>
          <div className="mt-4 flex gap-3">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 transition-colors hover:border-amber-300 hover:text-amber-300"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 transition-colors hover:border-amber-300 hover:text-amber-300"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
          <a
            href={links.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-cream/70 hover:text-amber-200"
          >
            Get directions <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-cream/50 sm:flex-row lg:px-8">
          <p>© {year} Paul&apos;s Hotel &amp; Lodge, Bhedetar. All rights reserved.</p>
          <p>Charles Point · Dharan-Dhankuta Highway · Nepal</p>
        </div>
      </div>
    </footer>
  );
}
