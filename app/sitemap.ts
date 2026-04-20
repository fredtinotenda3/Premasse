// app/sitemap.ts
// Dynamic sitemap — covers all static pages + every active service slug.
// Next.js serves this at /sitemap.xml automatically.
// NEXT_PUBLIC_SITE_URL=https://premasse.co.zw

import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await prisma.service.findMany({
    where:  { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url:             `${SITE_URL}`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${SITE_URL}/services`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/about`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${SITE_URL}/contact`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${SITE_URL}/request`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.8,
    },
    {
      url:             `${SITE_URL}/portal/login`,
      lastModified:    new Date(),
      changeFrequency: "yearly",
      priority:        0.4,
    },
    {
      url:             `${SITE_URL}/portal/register`,
      lastModified:    new Date(),
      changeFrequency: "yearly",
      priority:        0.4,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url:             `${SITE_URL}/services/${s.slug}`,
    lastModified:    s.updatedAt,
    changeFrequency: "monthly" as const,
    priority:        0.85,
  }));

  return [...staticPages, ...servicePages];
}