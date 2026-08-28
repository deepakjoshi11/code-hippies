import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { caseStudies } from "@/data/case-studies";
import { services } from "@/data/services";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { path: "/", changeFrequency: "weekly", priority: 1 },
      { path: "/work", changeFrequency: "monthly", priority: 0.9 },
      { path: "/services", changeFrequency: "monthly", priority: 0.9 },
      { path: "/enterprise", changeFrequency: "monthly", priority: 0.9 },
      { path: "/partner", changeFrequency: "monthly", priority: 0.85 },
      { path: "/hire", changeFrequency: "monthly", priority: 0.85 },
      { path: "/process", changeFrequency: "yearly", priority: 0.7 },
      { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
      { path: "/about", changeFrequency: "monthly", priority: 0.8 },
      { path: "/faq", changeFrequency: "monthly", priority: 0.8 },
      { path: "/learn", changeFrequency: "monthly", priority: 0.85 },
      { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
      { path: "/contact", changeFrequency: "yearly", priority: 0.9 },
      { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    ] as const
  ).map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const workRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: absoluteUrl(`/work/${c.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...workRoutes, ...postRoutes];
}
