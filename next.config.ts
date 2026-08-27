import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    return [
      // IndexNow requires its key served as plain text at /<key>.txt. Routing
      // it through an API handler keeps the key in the environment rather than
      // committed as a static file.
      { source: "/:key([A-Za-z0-9-]{8,128}).txt", destination: "/api/indexnow-key/:key" },
    ];
  },
};

export default nextConfig;
