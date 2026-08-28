import { absoluteUrl, site } from "@/lib/site";
import { caseStudies } from "@/data/case-studies";
import { services } from "@/data/services";
import { getAllPosts } from "@/lib/blog";

/**
 * IndexNow submission.
 *
 * IndexNow is a free, open protocol (Microsoft Bing, Yandex, Seznam, Naver)
 * that lets a site push URLs for crawling instead of waiting to be polled. No
 * account, no API key, no fee — the "key" is just a file you host to prove you
 * control the domain.
 *
 * Google does not participate in IndexNow. For Google, the sitemap plus normal
 * crawling is the supported route, and Search Console's URL Inspection is the
 * manual push. Anyone claiming to "instantly index on Google" for free is
 * describing something that does not exist.
 */

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "";

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
] as const;

export function allIndexableUrls(): string[] {
  const staticRoutes = [
    "/",
    "/work",
    "/services",
    "/enterprise",
    "/partner",
    "/hire",
    "/process",
    "/pricing",
    "/about",
    "/faq",
    "/learn",
    "/blog",
    "/contact",
    "/privacy",
  ];

  return [
    ...staticRoutes,
    ...caseStudies.map((c) => `/work/${c.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
    ...getAllPosts().map((p) => `/blog/${p.slug}`),
  ].map((path) => absoluteUrl(path));
}

export type SubmissionResult = {
  endpoint: string;
  status: number | "error";
  detail?: string;
};

export async function submitToIndexNow(urls: string[]): Promise<SubmissionResult[]> {
  if (!INDEXNOW_KEY) {
    return [{ endpoint: "none", status: "error", detail: "INDEXNOW_KEY is not configured" }];
  }

  const host = new URL(site.url).host;
  const body = JSON.stringify({
    host,
    key: INDEXNOW_KEY,
    keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`),
    // The protocol caps a submission at 10,000 URLs.
    urlList: urls.slice(0, 10_000),
  });

  return Promise.all(
    ENDPOINTS.map(async (endpoint): Promise<SubmissionResult> => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json; charset=utf-8" },
          body,
          signal: AbortSignal.timeout(15_000),
        });
        return { endpoint, status: response.status };
      } catch (error) {
        return { endpoint, status: "error", detail: String(error).slice(0, 200) };
      }
    }),
  );
}

/**
 * Sitemap ping.
 *
 * Google retired its /ping sitemap endpoint in 2023, so it is deliberately not
 * called here — sending requests to a removed endpoint is noise, not SEO.
 * Bing still accepts it and Yandex does too.
 */
export async function pingSitemapConsumers(): Promise<SubmissionResult[]> {
  const sitemap = encodeURIComponent(absoluteUrl("/sitemap.xml"));
  const targets = [
    `https://www.bing.com/ping?sitemap=${sitemap}`,
    `https://webmaster.yandex.com/ping?sitemap=${sitemap}`,
  ];

  return Promise.all(
    targets.map(async (endpoint): Promise<SubmissionResult> => {
      try {
        const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) });
        return { endpoint, status: response.status };
      } catch (error) {
        return { endpoint, status: "error", detail: String(error).slice(0, 200) };
      }
    }),
  );
}
