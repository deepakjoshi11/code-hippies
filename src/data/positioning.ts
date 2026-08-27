/**
 * Audience positioning.
 *
 * The same work has to convince three different readers who arrive on the same
 * page: someone with no technical background who is nervous about being
 * overcharged, someone who understands both engineering and business and is
 * assessing judgement, and someone inside a company weighing this against
 * hiring a team. Each gets a track written for them — the claims underneath
 * are identical, only the frame changes.
 */

export type AudienceTrack = {
  id: "plain" | "technical" | "enterprise";
  navLabel: string;
  /** The one-line version of who this is for. */
  who: string;
  headline: string;
  intro: string;
  /** Three concrete points, in that reader's own terms. */
  points: { title: string; body: string }[];
  /** The objection this reader actually has, answered. */
  objection: { q: string; a: string };
  cta: { label: string; href: string };
};

export const audienceTracks: AudienceTrack[] = [
  {
    id: "plain",
    navLabel: "I'm not technical",
    who: "You know what your business needs. You do not know, and should not have to know, how it gets built.",
    headline: "You describe the problem. I handle everything with a screen on it.",
    intro:
      "Most people who need software have been burned once already — a developer who went quiet, a site that broke and nobody could fix, an invoice that doubled. So here is how this works in plain terms, with no jargon and nothing hidden.",
    points: [
      {
        title: "You get a price before I start, and it does not move",
        body: "We talk first, I write down exactly what you are getting, and I quote a fixed number against that. If you later want something extra, I tell you what it costs before I build it. You will never open an invoice and find a surprise.",
      },
      {
        title: "You can see it being built, on your own phone",
        body: "From the first week there is a live link you can open any time. You are not waiting until the end to find out whether I understood you. If something looks wrong, you say so while it is still cheap to change.",
      },
      {
        title: "It is yours, and it keeps working after I leave",
        body: "The site or app is registered in your name, on your accounts, with your card. I hand over instructions written so that any other developer can pick it up. You are never stuck with me because you cannot leave.",
      },
    ],
    objection: {
      q: "How do I know you will not disappear like the last one?",
      a: "Because everything is in your name from day one — the domain, the accounts, the code. Thirteen sites I have built are live right now and you can click every one of them. And if you want the safety of a platform that holds your money in escrow until you are happy, I work on Fiverr and Upwork too. You do not have to trust me on faith.",
    },
    cta: { label: "Tell me what you need, in your own words", href: "/contact" },
  },
  {
    id: "technical",
    navLabel: "I know the stack",
    who: "You can read a diff and a P&L. You are assessing judgement, not vocabulary.",
    headline: "The interesting question is not what I can build. It is what I will talk you out of.",
    intro:
      "You already know a competent engineer can ship most things. What separates a good engagement from an expensive one is whether the person you hire will tell you when the interesting solution is the wrong one. So here is the evidence, not the pitch.",
    points: [
      {
        title: "Six stacks in one portfolio, on purpose",
        body: "Next.js for regional news properties that need stories crawlable in seconds. WordPress left in place for a newsroom that would have lost weeks migrating. 21 KB of static HTML for an ashram that cannot carry a maintenance contract. Each of those was the cheaper answer for that constraint, and two of them were less interesting to build.",
      },
      {
        title: "The site is the work sample, and it is falsifiable",
        body: "Every technology claim on the case studies was read off the live response headers — you can re-run the curl yourself, the method is in the repo. This site holds 100/100/100/100 on Lighthouse desktop with a budget enforced in CI, zero WCAG 2.1 AA violations, and an AI assistant that refuses out-of-scope questions with the refusal path tested on every deploy.",
      },
      {
        title: "AI where it earns its place, not where it demos well",
        body: "Retrieval-grounded systems with a relevance floor, an explicit refusal path, and a golden question set in CI where half the cases must be declined. I will not sell you a guarantee of zero hallucination, because nobody can deliver one. What I will do is make the failure mode a visible refusal instead of a confident invention, and prove it with a test you can read.",
      },
    ],
    objection: {
      q: "Why you instead of an agency with twenty people?",
      a: "For a defined product build, twenty people is mostly coordination overhead you are paying for. One senior engineer who scopes the work, writes it, and owns the outcome removes an entire communication layer. Where scale genuinely helps — parallel workstreams, a hard deadline, ongoing multi-product delivery — that is what the Dharmarthlabs partnership exists for, and I will point you there rather than pretend I am a team.",
    },
    cta: { label: "Read the engineering notes", href: "/blog" },
  },
  {
    id: "enterprise",
    navLabel: "I'm weighing a team",
    who: "You have a budget line for headcount and a delivery date you do not control.",
    headline: "A senior engineer who ships, without the eighteen-month hiring cycle.",
    intro:
      "Replacing a team is the wrong frame, and I will not sell it that way. What actually happens is narrower and more useful: for a defined scope, one accountable senior engineer with modern tooling delivers what a small team used to, at a fraction of the coordination cost — and for anything beyond that scope, there is a partner network to escalate into rather than a solo bottleneck.",
    points: [
      {
        title: "What one engineer plus modern tooling genuinely covers",
        body: "A production web application, a cross-platform mobile release, a retrieval-grounded AI feature with an evaluation harness, a CI/CD pipeline with performance and security gates, and the technical SEO underneath all of it. That was a four-to-six person scope five years ago. It is not any more, and pretending otherwise costs you money.",
      },
      {
        title: "What it does not cover, said plainly",
        body: "24/7 on-call rotation. Multiple parallel product lines. A team that survives one person going on holiday. If you need those, you need a team or a partner — and that is exactly the conversation Dharmarthlabs exists for. An engineer who tells you this before the contract is worth more than one who finds out during it.",
      },
      {
        title: "Governance you can put in front of a procurement review",
        body: "Ex-Deloitte USI, which is where I learned what production actually costs: review gates, audit trails, and a change nobody can trace being a change nobody can defend. Every engagement ships with a documented pipeline, an OWASP Top 10 review, dependency scanning that fails the build, and handover written so your next hire needs fifteen minutes, not a meeting with me.",
      },
    ],
    objection: {
      q: "What is our exposure if you are unavailable?",
      a: "Contained by design, and worth checking rather than trusting. The repository sits in your organisation with full history, every credential is in your accounts, the pipeline runs without me, and the handover gets a new developer running locally in under fifteen minutes. Where continuity is a formal requirement, the Dharmarthlabs partnership provides a named backup team under the same agreement.",
    },
    cta: { label: "See the enterprise engagement model", href: "/enterprise" },
  },
];

export function getTrack(id: AudienceTrack["id"]): AudienceTrack | undefined {
  return audienceTracks.find((t) => t.id === id);
}

/**
 * The craft-to-AI story. This is the positioning spine of the whole site: not
 * "I use AI" — everyone says that — but "I learned the fundamentals first,
 * which is what makes the modern tooling safe to use."
 */
export const craftToAi = {
  eyebrow: "How I work now",
  headline: "I learned the slow way first. That is what makes the fast way safe.",
  intro:
    "Anyone can generate a website this year. Far fewer people can tell you whether the thing that came out is correct, secure, accessible, and going to survive its second year in production. The fundamentals are not nostalgia — they are the review layer that makes modern tooling worth using.",
  columns: [
    {
      label: "The foundation",
      period: "Learned first",
      items: [
        "Semantic HTML and the document outline — still what search engines and screen readers actually read",
        "CSS layout from first principles, so a broken grid is diagnosed rather than guessed at",
        "Relational data modelling and query plans, because the slow page is usually the query",
        "HTTP, caching and the request lifecycle — the layer most performance problems actually live in",
        "OWASP Top 10 and defensive server-side validation as a habit, not a checklist",
      ],
    },
    {
      label: "The modern stack",
      period: "Used daily",
      items: [
        "React Server Components and edge rendering, chosen per route rather than by default",
        "TypeScript in strict mode with validation schemas shared across the client/server boundary",
        "Retrieval-grounded LLM systems with evaluation harnesses that run in CI",
        "AI-assisted development held to the same review bar as anything else — generated code is reviewed, not trusted",
        "Infrastructure as configuration, with performance and security budgets that fail the build",
      ],
    },
  ],
  closing:
    "The combination is the point. Fundamentals without modern tooling is slow. Modern tooling without fundamentals is fast, confident and wrong — and you will not find out until it is in production.",
} as const;
