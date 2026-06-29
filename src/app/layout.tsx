import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { getSettings } from "@/lib/settings";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Hotel in Bhedetar, Dhankuta`,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} · Hotel in Bhedetar`,
    description: siteConfig.description,
    images: [{ url: "/images/hotel/exterior-blue-dusk.webp", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · Hotel in Bhedetar`,
    description: siteConfig.description,
    images: ["/images/hotel/exterior-blue-dusk.webp"],
  },
  robots: { index: true, follow: true },
};

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
    whatsappHref: `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
      "Hi Paul's Hotel, I'd like to enquire about a room.",
    )}`,
    callHref: `tel:${settings.phoneE164}`,
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
