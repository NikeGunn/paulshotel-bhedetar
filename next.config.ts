import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // Pin workspace root: avoids Next picking a parent lockfile (C:\Users\Nautilus\pnpm-lock.yaml)
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage public bucket (blog/gallery uploads)
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : []),
      // Allow any *.supabase.co host as a fallback so prod image loads never 400
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
    // Image uploads run through Server Actions. The default request body cap is
    // 1MB, which silently rejects normal phone/camera photos (2–6MB) and leaves
    // the upload spinner stuck forever. Lift it above our 8MB per-file guard.
    serverActions: { bodySizeLimit: "12mb" },
  },
  // Security headers — applied to every response at the edge.
  // No CSP here: a strict policy would block Next's inline runtime + motion;
  // the headers below cover the high-value, zero-risk hardening.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Force HTTPS for 2 years incl. subdomains (HSTS).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Block MIME-type sniffing.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't let the site be framed (clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Send only the origin on cross-origin navigations.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Lock down powerful browser features we never use.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
