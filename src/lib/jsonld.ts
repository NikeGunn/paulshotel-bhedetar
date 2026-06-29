import { siteConfig } from "./site-config";
import type { ResolvedSettings } from "./settings";

/**
 * Hotel + LocalBusiness structured data for home/contact. Accepts resolved
 * settings (owner-editable) and falls back to the compiled siteConfig if none
 * is passed, so callers that don't have settings still render valid JSON-LD.
 */
export function hotelJsonLd(s?: ResolvedSettings) {
  const c = s ?? siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: c.name,
    description: c.description,
    url: siteConfig.url,
    telephone: c.phoneE164,
    email: c.email,
    priceRange: c.priceRange,
    image: `${siteConfig.url}/images/hotel/exterior-blue-dusk.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address.street,
      addressLocality: c.address.locality,
      addressRegion: c.address.region,
      postalCode: c.address.postalCode,
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: c.geo.lat,
      longitude: c.geo.lng,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: c.rating.value,
      reviewCount: c.rating.count,
    },
    sameAs: [c.social.facebook, c.social.instagram],
  };
}

/** Article structured data for blog posts. */
export function articleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  cover_url?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_url ?? `${siteConfig.url}/images/hotel/exterior-blue-dusk.webp`,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/hotel/signage-pauls-hotel-lodge.webp`,
      },
    },
  };
}

/** Breadcrumb structured data. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteConfig.url}${it.path}`,
    })),
  };
}

/** Render helper: <JsonLd data={...} /> */
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data) };
}
