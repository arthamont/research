import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/markets", "/markets/futures", "/markets/forex", "/markets/india", "/journal", "/outlook", "/playbook", "/about", "/workspace"].map(
    (path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() })
  );

  const [articles, cases] = await Promise.all([
    db.researchArticle.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    db.caseStudy.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  return [
    ...staticRoutes,
    ...articles.map((a) => ({ url: `${siteUrl}/outlook/${a.slug}`, lastModified: a.updatedAt })),
    ...cases.map((c) => ({ url: `${siteUrl}/journal/${c.slug}`, lastModified: c.updatedAt })),
  ];
}
