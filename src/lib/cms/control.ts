import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { caseStudies } from "@/data/case-studies";
import { services } from "@/data/services";
import { faqs, faqCategories } from "@/data/faq";
import { partnerRoutes } from "@/data/partnership";
import { buildChannels } from "@/data/channels";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

/**
 * What the CMS can see and what it can change.
 *
 * The split is deliberate. The CMS gets full READ visibility — every route,
 * every claim, every configured channel — so the Dharmarthlabs dashboard can
 * show an accurate picture of this site. Its WRITE surface is narrow on
 * purpose: cache, availability, and a short announcement.
 *
 * Content is not writable over the network. Case study claims are verified
 * against live sites and live in version control; a remote endpoint that could
 * silently rewrite them would turn an audit trail into a liability.
 */

export function cmsSnapshot() {
  return {
    site: {
      name: site.name,
      url: site.url,
      founder: site.founder,
      generatedAt: new Date().toISOString(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    },
    counts: {
      caseStudies: caseStudies.length,
      services: services.length,
      faqs: faqs.length,
      faqCategories: faqCategories.length,
      posts: getAllPosts().length,
      partnerRoutes: partnerRoutes.length,
      activeChannels: buildChannels().length,
    },
    routes: [
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
      ...caseStudies.map((c) => `/work/${c.slug}`),
      ...services.map((s) => `/services/${s.slug}`),
      ...getAllPosts().map((p) => `/blog/${p.slug}`),
    ],
    caseStudies: caseStudies.map((c) => ({
      slug: c.slug,
      name: c.name,
      liveUrl: c.url,
      category: c.category,
      stack: c.stack,
      verifiedSignals: c.verified.length,
    })),
    services: services.map((s) => ({ slug: s.slug, name: s.name, target: s.longTailTarget })),
    faq: faqCategories.map((category) => ({
      category,
      count: faqs.filter((f) => f.category === category).length,
    })),
    partnerRoutes: partnerRoutes.map((r) => ({ id: r.id, title: r.title, ctaPath: r.ctaPath })),
    channels: buildChannels().map((c) => ({ id: c.id, label: c.label, kind: c.kind })),
  };
}

export const controlSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("revalidate"),
    /** Site-relative paths only — no absolute URLs, no wildcards beyond the tag form. */
    paths: z.array(z.string().regex(/^\/[a-zA-Z0-9\-/_]*$/, "paths must be site-relative")).min(1).max(50),
  }),
  z.object({
    action: z.literal("revalidate_tag"),
    tags: z.array(z.string().max(60).regex(/^[a-zA-Z0-9:_-]+$/)).min(1).max(20),
  }),
  z.object({
    action: z.literal("ping"),
    note: z.string().max(200).optional(),
  }),
]);

export type ControlDirective = z.infer<typeof controlSchema>;

export async function applyControl(directive: ControlDirective) {
  switch (directive.action) {
    case "revalidate": {
      for (const path of directive.paths) revalidatePath(path);
      return { ok: true, action: "revalidate", count: directive.paths.length };
    }
    case "revalidate_tag": {
      // Next.js 16 requires an explicit cache profile alongside the tag.
      for (const tag of directive.tags) revalidateTag(tag, "max");
      return { ok: true, action: "revalidate_tag", count: directive.tags.length };
    }
    case "ping": {
      return { ok: true, action: "ping", at: new Date().toISOString() };
    }
  }
}
