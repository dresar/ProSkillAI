import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Claude-User",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "meta-webindexer",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "meta-externalfetcher",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
      {
        userAgent: "Diffbot",
        allow: "/",
        disallow: ["/admin/", "/login", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
