// app/robots.ts
// Serves /robots.txt — allows all crawlers on public pages,
// blocks /dashboard and /portal from being indexed.

import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  ["/dashboard/", "/portal/", "/api/", "/payment/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host:    SITE_URL,
  };
}