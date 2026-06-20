import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Navigation } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { jsonLdScript, breadcrumbJsonLd } from "@/lib/jsonld";
import { links, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact & Book",
  description:
    "Enquire about a stay at Paul's Hotel & Lodge in Bhedetar. Call, WhatsApp or send us a message and we will reply with live availability and rates.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    siteConfig.mapEmbedQuery,
  )}&output=embed`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        )}
      />
      <PageHero
        crumb="Contact"
        kicker="Plan your stay"
        title="Let's get you booked in"
        intro="Tell us your dates and we will reply with availability and the best rate. Prefer to talk? Call or WhatsApp us any time."
        image="/images/views/night-valley-citylights.webp"
        alt="Night view of the valley from Paul's Hotel Bhedetar"
      />

      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: contact details */}
            <Reveal direction="left">
              <h2 className="font-display text-3xl font-semibold text-brand-900">
                Reach us directly
              </h2>
              <p className="mt-3 text-lg text-muted">
                We are happy to help with rooms, food, group bookings or directions.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={links.call}
                  className="flex items-center gap-4 rounded-2xl border border-brand-800/10 bg-white p-5 transition-colors hover:border-amber-400/50"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">Call us</span>
                    <span className="font-semibold text-brand-900">{siteConfig.phone}</span>
                  </span>
                </a>
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-brand-800/10 bg-white p-5 transition-colors hover:border-amber-400/50"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366]/10 text-[#1da851]">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">WhatsApp</span>
                    <span className="font-semibold text-brand-900">Chat with us now</span>
                  </span>
                </a>
                <a
                  href={links.mailto}
                  className="flex items-center gap-4 rounded-2xl border border-brand-800/10 bg-white p-5 transition-colors hover:border-amber-400/50"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">Email</span>
                    <span className="break-all font-semibold text-brand-900">
                      {siteConfig.email}
                    </span>
                  </span>
                </a>
                <div className="flex items-start gap-4 rounded-2xl border border-brand-800/10 bg-white p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">Visit us</span>
                    <span className="font-semibold text-brand-900">
                      {siteConfig.address.full}
                    </span>
                    <a
                      href={links.directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-amber-600"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Get directions
                    </a>
                  </span>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
                <iframe
                  title="Map to Paul's Hotel Bhedetar"
                  src={mapSrc}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>

            {/* Right: form */}
            <Reveal direction="right" delay={0.1}>
              <InquiryForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
