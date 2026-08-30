/**
 * The free learning track.
 *
 * Code Hippies runs two things at once, and the site says so plainly rather
 * than blurring them: paid client engineering, and a free body of material for
 * developers becoming AI-era professionals.
 *
 * The honest framing matters here. "AI visibility" is a real and currently
 * under-served discipline — making your work legible and citable to the
 * systems people increasingly ask instead of searching. It is not a
 * certification, it is not a bootcamp, and nothing here promises anyone a job.
 * Overclaiming on education is worse than overclaiming on services, because
 * the people who believe it lose more.
 */

export type LearningTrack = {
  slug: string;
  title: string;
  /** One line on who this is for. */
  who: string;
  summary: string;
  /** Concrete, checkable outcomes — never "become a 10x engineer". */
  outcomes: string[];
  /** Existing articles on this site that cover part of the track. */
  articles: string[];
  status: "published" | "in-progress" | "planned";
};

export const learnIntro = {
  eyebrow: "Free, and staying free",
  headline: "The craft did not stop mattering. It changed shape.",
  body:
    "Generating a working page takes a sentence now. Knowing whether the thing that came out is correct, secure, accessible and going to survive its second year in production — that is the job, and it is a bigger job than it was. Everything on this page is free, has no sign-up, and is not a funnel into a paid course, because there isn't one.",
  honesty:
    "What this is not: a certification, a bootcamp, or a promise of employment. It is the material I use, written down. Some tracks are complete, some are being written, and the status of each is marked so nobody wastes an afternoon on a stub.",
} as const;

export const aiVisibility = {
  title: "AI visibility",
  definition:
    "Making your work legible and citable to AI systems — the assistants people increasingly ask instead of running a search. It is the discipline that sits next to SEO, not a replacement for it.",
  why:
    "When someone asks an assistant to recommend a developer, compare two frameworks, or explain a technique, the assistant answers from what it can parse and trust. A site that publishes clear factual claims, structured data and a machine-readable summary gets quoted. One that hides its substance behind rendered JavaScript and marketing adjectives does not.",
  practices: [
    {
      title: "Publish a machine-readable summary",
      body:
        "The llms.txt convention gives models a clean markdown statement of what a site is, instead of leaving them to infer it from navigation and styling. This site publishes one at /llms.txt, generated from the same data as the pages so it cannot drift.",
    },
    {
      title: "Make claims specific and checkable",
      body:
        "\"Fast, modern websites\" is unquotable — there is nothing in it to cite. \"Server-rendered Next.js behind Caddy, verified in the response headers\" is a fact an assistant can repeat and a reader can check. Specificity is the whole mechanism.",
    },
    {
      title: "State what is not true, as well as what is",
      body:
        "This site's llms.txt says there are no published testimonials and no published prices. A model that quotes an overclaim damages the brand far more than one that quotes nothing, so ruling out the wrong answer is worth as much as supplying the right one.",
    },
    {
      title: "Put content in the HTML",
      body:
        "Everything that applies to search crawlers applies harder to AI retrieval. If the substance only exists after hydration, it may as well not exist. Server-render anything you want quoted.",
    },
    {
      title: "Use structured data properly",
      body:
        "Person, Organization, Service, FAQPage, Article — an explicit graph with @id links is unambiguous in a way prose is not. It is the difference between a system inferring who you are and being told.",
    },
    {
      title: "Do not try to trick the model",
      body:
        "Prompt injection in page text, hidden keyword blocks, contradictory claims across pages — these get filtered, and increasingly get sites down-weighted. The technique that works is the boring one: be genuinely clear about genuinely true things.",
    },
  ],
} as const;

export const learningTracks: LearningTrack[] = [
  {
    slug: "ai-visibility",
    title: "AI visibility for developers and businesses",
    who: "Anyone whose work should show up when a person asks an assistant rather than a search engine.",
    summary:
      "How AI systems find, parse, trust and cite a website — llms.txt, structured data, rendering strategy, and why specific checkable claims outperform marketing copy.",
    outcomes: [
      "Publish a valid llms.txt generated from your own content",
      "Emit a correct Schema.org graph with @id linking, not isolated fragments",
      "Audit what a crawler or model actually receives, using curl alone",
      "Write claims that are specific enough to be quoted and checked",
    ],
    articles: ["what-crawlers-actually-see"],
    status: "published",
  },
  {
    slug: "grounded-ai",
    title: "Building AI features that refuse to guess",
    who: "Developers shipping their first retrieval-grounded assistant.",
    summary:
      "Retrieval, chunking, relevance floors, and the refusal path — the part almost every tutorial skips and the part that decides whether the feature is trustworthy.",
    outcomes: [
      "Chunk on semantic boundaries and keep breadcrumbs attached",
      "Set an empirical relevance floor and let retrieval return nothing",
      "Make refusal an explicitly correct outcome in the prompt",
      "Run a golden question set in CI where half the cases must be refused",
    ],
    articles: ["rag-that-refuses-to-answer"],
    status: "published",
  },
  {
    slug: "performance",
    title: "Core Web Vitals that survive a sprint",
    who: "Anyone who has optimised a site once and watched it regress.",
    summary:
      "Why performance work decays, and how a budget enforced in CI is the only version that holds.",
    outcomes: [
      "Wire Lighthouse CI with assertions that fail the build",
      "Diagnose LCP by phase rather than by guesswork",
      "Eliminate layout shift at the source, including from fixed elements",
      "Tell a lab regression apart from a field problem",
    ],
    articles: ["performance-budget-that-fails-the-build"],
    status: "published",
  },
  {
    slug: "shipping-safely",
    title: "The pre-launch security pass",
    who: "Developers shipping to production without a security team behind them.",
    summary:
      "Nine checks derived from the OWASP Top 10, in the order they actually catch things.",
    outcomes: [
      "Validate on the server with a schema shared with the client",
      "Protect mutating routes with CSRF tokens and rate limits",
      "Set the six security headers that matter, and know what each stops",
      "Prove no secret reached the client bundle",
    ],
    articles: ["owasp-checklist-before-launch"],
    status: "published",
  },
  {
    slug: "choosing-a-stack",
    title: "Choosing a stack you will not regret",
    who: "Anyone deciding what to build something in, especially for a client.",
    summary:
      "Four questions that decide the answer, and why the most interesting option is frequently the wrong one.",
    outcomes: [
      "Ask who maintains this in two years, first",
      "Match rendering strategy to how often content changes",
      "Treat existing constraints as inputs rather than obstacles",
      "Recommend against your own preference when the constraint says so",
    ],
    articles: ["choosing-a-stack-per-client"],
    status: "published",
  },
];

export function getTrack(slug: string): LearningTrack | undefined {
  return learningTracks.find((t) => t.slug === slug);
}

/**
 * Tracks that have their own page. A track earns one by being written — a
 * stub page for a planned track is thin content, which costs more in ranking
 * than the extra URL gains.
 */
export function publishedTracks(): LearningTrack[] {
  return learningTracks.filter((t) => t.status === "published");
}
