import { publishedTracks } from "@/data/learn";
import { absoluteUrl } from "@/lib/site";

/**
 * A sitemap for the free learning section alone.
 *
 * /learn is a different product from the studio pages: it is given away, it
 * targets a different search intent, and it will grow at a different rate.
 * Submitting it as its own sitemap in Search Console and Bing Webmaster Tools
 * means the coverage numbers for each are read separately — an indexing
 * problem in the learning material cannot hide inside the site's totals, and
 * neither can the reverse.
 *
 * It is a plain route handler rather than Next's generateSitemaps() because
 * that helper produces /sitemap/0.xml, and a named file is what actually gets
 * pasted into a webmaster console.
 */
export const revalidate = 86400;

export function GET(): Response {
  const now = new Date().toISOString();

  const urls = [
    { loc: absoluteUrl("/learn"), priority: "0.9", changefreq: "weekly" },
    ...publishedTracks().map((t) => ({
      loc: absoluteUrl(`/learn/${t.slug}`),
      priority: "0.8",
      changefreq: "monthly",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
