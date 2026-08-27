export type EngagementModel = {
  slug: string;
  name: string;
  priceLabel: string;
  priceNote: string;
  bestFor: string;
  description: string;
  includes: string[];
  notIncluded: string[];
  commitment: string;
  featured?: boolean;
};

export const engagementModels: EngagementModel[] = [
  {
    slug: "project",
    name: "Fixed-scope project",
    priceLabel: "Quoted per project",
    priceNote: "Priced after discovery, not before",
    bestFor: "A defined outcome with a known shape — a site, an app, an integration, a rebuild.",
    description:
      "We agree the scope in discovery, I quote a fixed price against it, and that price holds. Changes outside the agreed scope get quoted separately rather than silently absorbed or silently dropped.",
    includes: [
      "Discovery, wireframes and a written scope you sign off",
      "Full design and build to the agreed scope",
      "QA, accessibility and security review before launch",
      "CI/CD pipeline and production deployment",
      "Handover documentation and code ownership transfer",
      "30 days of post-launch defect fixes at no charge",
    ],
    notIncluded: [
      "Scope added after sign-off (quoted separately)",
      "Ongoing content production",
      "Third-party licences, hosting and domain costs",
    ],
    commitment: "Typically 2–12 weeks",
    featured: true,
  },
  {
    slug: "retainer",
    name: "Monthly retainer",
    priceLabel: "Fixed monthly fee",
    priceNote: "Based on the days per month reserved",
    bestFor: "A product that is live and needs to keep moving without a full-time hire.",
    description:
      "A reserved block of engineering days each month covering feature work, maintenance, security patching and incident response. Predictable for your budget, predictable for my calendar.",
    includes: [
      "A reserved number of engineering days each month",
      "Dependency and security patching on a defined cadence",
      "Feature development against your priorities",
      "Monitoring and an agreed incident response time",
      "A monthly written summary of what shipped and what is next",
    ],
    notIncluded: [
      "Unused days rolling over indefinitely (one month's carry-over)",
      "24/7 on-call — response times are business-hours unless separately agreed",
    ],
    commitment: "3-month minimum, then monthly",
  },
  {
    slug: "staff-augmentation",
    name: "Staff augmentation",
    priceLabel: "Day rate",
    priceNote: "Weekly or monthly blocks",
    bestFor: "An existing engineering team that needs a specific capability for a defined period.",
    description:
      "I join your team, your repository and your standups as an engineer for an agreed number of days per week — usually to bring in a capability you do not have in-house yet, such as mobile, LLM integration or performance work.",
    includes: [
      "Working directly in your repository and workflow",
      "Participation in your ceremonies and code review",
      "Knowledge transfer to your team as an explicit goal",
      "Documented decisions so the capability stays after I leave",
    ],
    notIncluded: [
      "Line-management responsibility",
      "Fixed delivery commitments (you own the backlog and the priorities)",
    ],
    commitment: "4-week minimum",
  },
];

export const budgetBands = [
  "Under ₹1,00,000 / under $1,200",
  "₹1,00,000 – ₹3,00,000 / $1,200 – $3,600",
  "₹3,00,000 – ₹8,00,000 / $3,600 – $9,600",
  "₹8,00,000+ / $9,600+",
  "Retainer — monthly budget",
  "Not sure yet",
] as const;

export const timelineBands = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "3+ months",
  "Exploring options",
] as const;

export const projectTypes = [
  "Web application",
  "Marketing or brand website",
  "News or publishing platform",
  "iOS / Android app",
  "AI or LLM feature",
  "SEO & performance work",
  "Security review",
  "Something else",
] as const;
