import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; connect-src 'self' https: wss: ws:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self'; object-src 'none'; media-src 'self' https: blob: data:; frame-src 'self' blob: https://www.youtube.com https://www.youtube-nocookie.com https://www.loom.com; base-uri 'self'; form-action 'self';",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const noStoreHeaders = [
  {
    key: "Cache-Control",
    value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  },
  {
    key: "Pragma",
    value: "no-cache",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "shiki"],
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  allowedDevOrigins: [
    "proskill.agentai.my.id",
    "proskillai.agentai.my.id",
    "*.agentai.my.id",
    "localhost:3000",
    "localhost:3001",
    "127.0.0.1:3001",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: noStoreHeaders,
      },
      {
        source: "/login",
        headers: noStoreHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
