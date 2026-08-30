import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes are functional endpoints, not content.
        disallow: ["/api/"],
      },
    ],
    // Two sitemaps, listed separately so Google and Bing discover and report
    // the studio and the free learning section independently.
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/sitemap-learn.xml")],
    host: site.url,
  };
}
