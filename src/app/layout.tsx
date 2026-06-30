import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { getSettings, contactLinks } from "@/lib/settings";
import { hotelJsonLd, jsonLdScript } from "@/lib/jsonld";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Title/description/keywords come from owner-editable settings (DB) with a safe
// fallback to siteConfig. `metadataBase`/canonical stay env-derived so OG/canonical
// are always correct on the Vercel URL and the custom domain (CLAUDE rule #6).
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const shortName = siteConfig.shortName;
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${s.name} · Hotel in Bhedetar, Dhankuta`,
      template: `%s · ${shortName}`,
    },
    description: s.description,
    keywords: [...s.keywords],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: s.name,
      title: `${s.name} · Hotel in Bhedetar`,
      description: s.description,
      images: [{ url: "/images/hotel/exterior-blue-dusk.webp", width: 1200, height: 630, alt: s.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${s.name} · Hotel in Bhedetar`,
      description: s.description,
      images: ["/images/hotel/exterior-blue-dusk.webp"],
    },
    robots: { index: true, follow: true },
  };
}

// Explicit viewport so phones/tablets (incl. iOS Safari) scale correctly and
// the address bar/status bar pick up the brand colour. `viewport-fit=cover`
// lets us honour iOS safe-area insets on notched devices.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1f3a",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Owner-editable settings (safe fallback to siteConfig). Drives JSON-LD and
  // the floating contact buttons. getSettings() never throws.
  const settings = await getSettings();

  const floating = {
    showWhatsapp: settings.showWhatsappButton,
    showCall: settings.showCallButton,
    name: settings.name,
    ...contactLinks(settings),
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(hotelJsonLd(settings))}
        />
        <SiteChrome floating={floating} footer={<Footer />}>
          {children}
        </SiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
