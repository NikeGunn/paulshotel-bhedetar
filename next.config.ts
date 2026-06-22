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
};

export default nextConfig;
