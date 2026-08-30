import { caseStudies, liveCaseStudies } from "./case-studies";

/**
 * Proof metrics. Every number here is computed from, or directly observed in,
 * the live-site verification recorded in case-studies.ts. Nothing is estimated.
 */
const countStack = (needle: string) =>
  caseStudies.filter((c) => c.stack.some((s) => s.toLowerCase().includes(needle.toLowerCase()))).length;

export const proofMetrics = [
  {
    value: String(caseStudies.length),
    label: "sites shipped to production",
    detail: `${liveCaseStudies().length} are reachable right now and independently verifiable — links below.`,
  },
  {
    value: String(countStack("Next.js")),
    label: "running on Next.js",
    detail: "Confirmed by x-powered-by response headers on the live origins.",
  },
  {
    value: String(caseStudies.filter((c) => c.verified.some((v) => v.includes("JSON-LD"))).length),
    label: "shipping structured data",
    detail: "Schema.org JSON-LD emitted in the served HTML, not injected client-side.",
  },
  {
    /**
     * Not a portfolio count like the other three — this one is about how the
     * work is held to a standard. It replaced a "21 KB lightest page" metric
     * that pointed at the one case study whose site is no longer reachable,
     * which made the weakest link the loudest number.
     *
     * The claim is checkable two ways: read lighthouserc.json in the public
     * repository, or run Lighthouse against this page yourself.
     *
     * Deliberately says nothing about LCP. The desktop config asserts it at
     * 2.5s but the mobile config sets it to off, because on Lighthouse's
     * simulated slow-4G a content-rich page lands around 2.6s — so a combined
     * claim would be false for half the runs.
     */
    value: "90+",
    label: "Lighthouse floor, enforced in CI",
    detail:
      "Performance, accessibility, best practices and SEO — all four asserted on desktop and on throttled mobile, three runs each, every push. Below 90 on any one and the build fails.",
  },
] as const;

export const trustSignals = [
  "Previously at Deloitte USI",
  "Founder, Dharmarthlabs",
  "Full-stack · Mobile · AI/LLM",
  "Working with startups & agencies",
] as const;

/**
 * Client testimonials.
 *
 * Intentionally empty. Testimonials are statements made by real people about
 * real engagements — writing them here would be fabricating a record, so the
 * section renders verified engineering evidence instead until the site owner
 * adds quotes they have permission to publish.
 *
 * To add one, append an object below; the section renders automatically.
 */
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  /** Public URL backing the engagement, if there is one. */
  projectUrl?: string;
};

export const testimonials: Testimonial[] = [];
