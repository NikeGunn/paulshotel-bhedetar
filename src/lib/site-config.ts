/**
 * Single source of truth for NAP + SEO constants.
 * Pulled from the verified Google/Facebook business listing.
 * Never hardcode these values elsewhere — import from here.
 */

export const siteConfig = {
  name: "Paul's Hotel & Lodge",
  shortName: "Paul's Hotel",
  tagline: "Wake up above the clouds in Bhedetar",
  description:
    "Paul's Hotel & Lodge sits at Charles Point in Bhedetar, Dhankuta, where cool hill air, sunrise over the valley and warm Nepali food wait for you. Comfortable rooms, a lively bar and lounge, and sweeping views just a short drive above Dharan.",

  // Contact / NAP
  phone: "970-1406587",
  phoneE164: "+9779701406587", // tel:/wa.me
  whatsapp: "9779701406587", // wa.me number (no +)
  email: "paulshotelbhedetar@gmail.com",

  address: {
    street: "Charles Point, Dharan-Dhankuta Highway",
    locality: "Bhedetar",
    region: "Dhankuta",
    postalCode: "56804",
    country: "Nepal",
    full: "Charles Point, Dharan-Dhankuta Highway, Bhedetar 56804, Dhankuta, Nepal",
  },

  // Approx coordinates for Bhedetar / Charles Point (used for JSON-LD geo + map)
  geo: { lat: 26.8467, lng: 87.3145 },

  rating: { value: 4.5, count: 86 },
  priceRange: "$$",

  // URLs — production base read from env so OG/canonical work on Vercel + custom domain
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://hotelpauls.com",
  futureDomain: "https://hotelpauls.com",

  social: {
    facebook: "https://www.facebook.com/paulshotelbhedetar/",
    instagram: "https://www.instagram.com/paulshotelbhedetar/",
  },

  hours: "Open daily · Reception 24/7",

  // Google Maps directions deep link
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Paul%27s+Hotel+Bhedetar+Charles+Point",
  mapEmbedQuery: "Paul's Hotel Bhedetar Charles Point",

  // SEO keyword targets
  keywords: [
    "hotel in Bhedetar",
    "Paul's Hotel Bhedetar",
    "Bhedetar resort",
    "where to stay in Bhedetar",
    "Charles Point hotel",
    "Sky Walk Bhedetar hotel",
    "Bhedetar Dhankuta accommodation",
    "hotel near Dharan",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

// Convenience deep links
export const links = {
  call: `tel:${siteConfig.phoneE164}`,
  whatsapp: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    "Hi Paul's Hotel, I'd like to enquire about a room.",
  )}`,
  mailto: `mailto:${siteConfig.email}`,
  directions: siteConfig.directionsUrl,
};

// Primary navigation
export const navItems = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/dining", label: "Dining" },
  { href: "/gallery", label: "Gallery" },
  { href: "/experiences", label: "Experiences" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;
