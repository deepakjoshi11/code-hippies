/**
 * Dharmarthlabs partnership.
 *
 * Code Hippies is one engineer. Some engagements are genuinely bigger than one
 * engineer — parallel workstreams, ongoing multi-product delivery, a team that
 * survives someone taking leave, an equity-style technical partnership. Rather
 * than either turning that work away or overselling a solo capability,
 * qualified visitors are handed to Dharmarthlabs, which is the company Deepak
 * founded.
 *
 * The funnel is deliberately honest: the escalation is offered when it is the
 * better answer for the client, and it says plainly when it is not.
 */

export const dharmarthlabs = {
  name: "Dharmarthlabs",
  url: process.env.NEXT_PUBLIC_DHARMARTHLABS_URL ?? "https://dharmarthlabs.com",
  tagline: "Productised digital and AI, built once and configured per client.",
  relationship:
    "Deepak Joshi founded Dharmarthlabs and works across both. Code Hippies is the individual engineering practice; Dharmarthlabs is the team and product company behind it.",
} as const;

export function dharmarthlabsHref(path = "/", utm = "codehippies"): string {
  const url = new URL(path, dharmarthlabs.url);
  url.searchParams.set("utm_source", utm);
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "portfolio_funnel");
  return url.toString();
}

export type PartnerRoute = {
  id: string;
  /** Who this route is for, in one line. */
  audience: string;
  title: string;
  body: string;
  /** What they actually get. */
  outcomes: string[];
  ctaLabel: string;
  /** Path on dharmarthlabs.com. */
  ctaPath: string;
  featured?: boolean;
};

export const partnerRoutes: PartnerRoute[] = [
  {
    id: "productised",
    audience: "You want a standard product, configured — not a bespoke build",
    title: "Buy it productised",
    body:
      "Most businesses asking for custom software need something that has been built four hundred times before: a booking flow, a news portal, a lead-capture site, a storefront, an internal dashboard. Dharmarthlabs builds those once, properly, and configures them per client. You pick the options, it ships in days rather than months, and you pay a fraction of a bespoke build because you are not funding someone's first attempt.",
    outcomes: [
      "Ships in days, not months — the product already exists",
      "Priced as a product, not as an open-ended engagement",
      "Options selected up front, so the scope conversation is a form rather than a workshop",
      "Same engineering standards as a custom build, because it is the same people",
    ],
    ctaLabel: "See the product catalogue",
    ctaPath: "/products",
    featured: true,
  },
  {
    id: "custom",
    audience: "You are technical and the standard options genuinely do not fit",
    title: "Specify it exactly",
    body:
      "If you can describe the data model, the constraints and the integration surface, you should not be forced through a menu. Dharmarthlabs keeps a route for people who know what they want: bring the specification, get a scoped technical response rather than a sales call. This is also where a productised base gets extended into something specific to your business.",
    outcomes: [
      "Technical specification in, scoped technical response out",
      "Productised foundation extended rather than rebuilt from zero",
      "Direct access to the engineers, not an account manager relaying questions",
      "Architecture decisions documented and defensible",
    ],
    ctaLabel: "Submit a technical specification",
    ctaPath: "/custom",
  },
  {
    id: "tech-partner",
    audience: "You are a startup that needs engineering leadership, not a vendor",
    title: "Take on a technical partner",
    body:
      "Startups without a technical founder usually get one of two bad outcomes: an agency that bills for a product it has no stake in, or a junior hire carrying architectural decisions they have never made before. The partnership route puts a technical team alongside the business with real skin in the game — including equity-inclusive structures where the fit and the stage justify it.",
    outcomes: [
      "Technical direction and architecture ownership, not just delivery",
      "Cash, equity, or blended structures depending on stage and fit",
      "A team that scales with you rather than a contract you renegotiate",
      "Diligence-ready documentation from the start, because investors will ask",
    ],
    ctaLabel: "Discuss a technical partnership",
    ctaPath: "/partnerships",
    featured: true,
  },
  {
    id: "enterprise",
    audience: "You are an established company with procurement and a delivery date",
    title: "Engage as a vendor with a team behind it",
    body:
      "Where continuity, parallel workstreams and a named backup team are contractual requirements rather than nice-to-haves, the engagement runs through Dharmarthlabs. Same engineering standards and the same person accountable for the technical outcome — with the company structure, capacity and paperwork an enterprise procurement process actually needs.",
    outcomes: [
      "Company contracting, invoicing and compliance paperwork",
      "Named backup team, so one person's leave is not a project risk",
      "Parallel workstreams across multiple products",
      "Defined SLAs and escalation paths",
    ],
    ctaLabel: "Start an enterprise conversation",
    ctaPath: "/enterprise",
  },
];

/**
 * When the honest answer is "stay here" rather than "go there". Shown on the
 * partnership page so the funnel does not read as a bait-and-switch — a
 * referral that is wrong for the client costs more trust than it earns.
 */
export const stayHereInstead = [
  "A single site, app or feature with a defined scope — that is exactly what Code Hippies is for, and routing it through a company adds cost without adding value.",
  "An audit, a rescue, or a second opinion on work someone else did.",
  "Anything where you specifically want one accountable engineer rather than a team.",
];
