import { siteConfig } from "./site-config";

/** Hotel + LocalBusiness structured data for home/contact. */
export function hotelJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    image: `${siteConfig.url}/images/hotel/exterior-blue-dusk.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.rating.value,
      reviewCount: siteConfig.rating.count,
    },
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
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
