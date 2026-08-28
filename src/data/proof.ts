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
    value: "21 KB",
    label: "lightest page shipped",
    detail: "nantinbaba.org — static HTML, no framework runtime, no maintenance contract.",
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
