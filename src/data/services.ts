export type Service = {
  slug: string;
  name: string;
  /** Short label used in navigation. */
  navLabel: string;
  /** Hero one-liner. */
  headline: string;
  /** Meta description + card copy. */
  summary: string;
  /** Section 5: one long-tail phrase this page is built to win. */
  longTailTarget: string;
  keywords: string[];
  icon: "code" | "smartphone" | "brain" | "gauge" | "shield";
  /** What the client actually buys. */
  deliverables: string[];
  /** Honest stack framing — Section 11. */
  stackOptions: { label: string; options: string[] }[];
  /** Copy blocks for the detail page. */
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  relatedCaseStudies: string[];
  startingPoint: string;
};

export const services: Service[] = [
  {
    slug: "web-development",
    name: "Web development",
    navLabel: "Web development",
    headline: "React and Next.js applications that hold up in production",
    summary:
      "Server-rendered web applications and marketing sites built on Next.js and React — typed end to end, indexable by default, and deployed through a pipeline that will not let a broken build reach users.",
    longTailTarget: "hire a React and Next.js developer for a production web application",
    keywords: [
      "React Next.js developer for hire",
      "hire full-stack developer India",
      "Next.js App Router development",
      "server-side rendering agency",
      "TypeScript web application development",
    ],
    icon: "code",
    deliverables: [
      "Next.js App Router application in TypeScript strict mode",
      "Server-rendered or statically generated routes — indexable without executing JavaScript",
      "Design system in Tailwind tokens, not hard-coded values",
      "Typed API layer with zod validation on both sides of every boundary",
      "GitHub Actions pipeline: lint, typecheck, test, build, Lighthouse budget, deploy",
      "Handover documentation and a runnable local environment",
    ],
    stackOptions: [
      { label: "Frontend", options: ["React / Next.js", "Vue / Nuxt", "Astro", "Vite + React SPA"] },
      { label: "Backend", options: ["Node / NestJS", "Python / FastAPI", "Python / Django", "Go", "PHP 8.2+"] },
      { label: "Data", options: ["PostgreSQL", "MySQL", "SQLite", "Redis", "Headless CMS"] },
      { label: "Hosting", options: ["Vercel", "Cloudflare", "Caddy / nginx on a VPS", "Hostinger"] },
    ],
    sections: [
      {
        heading: "The stack is chosen per project, not per fashion",
        body: "The portfolio on this site runs on Next.js, Astro, WordPress, a Vite SPA, hand-written PHP and plain static HTML — because those were the right answers for those clients. An ashram that cannot pay for maintenance gets static HTML that will still work in 2035. A publisher that needs stories crawlable in seconds gets server rendering. The stack follows the constraint.",
      },
      {
        heading: "Indexable by default, not as a later fix",
        body: "Anything that should rank is server-rendered or statically generated. Structured data is emitted as part of the page, not bolted on through a plugin. One h1 per page, a real heading hierarchy, canonical URLs, a generated sitemap. This is cheaper to do on day one than to retrofit in month six, and the difference shows up in how quickly a new site starts getting crawled.",
      },
      {
        heading: "The pipeline is part of the deliverable",
        body: "You get a GitHub Actions workflow that runs lint, typecheck, unit tests, a production build, a dependency audit and a Lighthouse performance budget on every push, with preview deployments per branch. If a change would regress Core Web Vitals below the agreed budget, the build fails before anyone sees it.",
      },
    ],
    faqs: [
      {
        q: "Do you work with an existing codebase or only greenfield projects?",
        a: "Both. Several projects in the portfolio were built around constraints that already existed — an editorial team that would not leave WordPress, a hosting account that was already paid for. Taking over an existing codebase starts with a short audit so we both know what we are dealing with before any code changes.",
      },
      {
        q: "How long does a typical web application take?",
        a: "A focused marketing or consultation site is usually two to four weeks. A full application with authentication, a database and an admin surface is typically six to twelve weeks, delivered in working increments rather than as one launch date.",
      },
      {
        q: "Who owns the code?",
        a: "You do, from the first commit. Work happens in your repository or is transferred to it at handover, along with environment documentation and a runnable local setup.",
      },
    ],
    relatedCaseStudies: ["uttaranchal-kesari", "influenceaxis", "scalewell"],
    startingPoint: "Two-week discovery and build for a focused site; six weeks and up for an application.",
  },
  {
    slug: "mobile-development",
    name: "iOS & Android development",
    navLabel: "Mobile apps",
    headline: "Native and cross-platform apps for startups shipping their first release",
    summary:
      "iOS and Android applications — native Swift and Kotlin where the platform matters, React Native or Flutter where shared code matters more — taken through store review and into a release pipeline you can run yourself.",
    longTailTarget: "hire an iOS and Android developer for a startup MVP app",
    keywords: [
      "iOS Android developer for startups",
      "hire mobile app developer India",
      "React Native developer for hire",
      "Swift SwiftUI freelance developer",
      "Kotlin Android app development",
    ],
    icon: "smartphone",
    deliverables: [
      "iOS and Android builds from a single agreed codebase strategy",
      "App Store and Play Console submission, including review responses",
      "Offline-tolerant data layer — apps that survive a bad connection",
      "Push notifications, deep links and analytics wired in",
      "Signed release pipeline with versioned builds",
      "Store listing assets and metadata guidance",
    ],
    stackOptions: [
      { label: "iOS native", options: ["Swift", "SwiftUI", "UIKit"] },
      { label: "Android native", options: ["Kotlin", "Jetpack Compose"] },
      { label: "Cross-platform", options: ["React Native", "Flutter"] },
      { label: "Backend for mobile", options: ["Node / NestJS", "FastAPI", "Firebase", "Supabase"] },
    ],
    sections: [
      {
        heading: "Native or cross-platform is a budget decision, made honestly",
        body: "If the app is mostly forms, lists and API calls, React Native or Flutter will get two platforms for close to the price of one, and the difference will be invisible to your users. If it leans on the camera, background location, widgets, HealthKit or heavy animation, native Swift and Kotlin will cost less in the long run than fighting a bridge. That call gets made in discovery, in front of you, with the tradeoff written down.",
      },
      {
        heading: "Store review is part of the project, not your problem afterwards",
        body: "App Store rejections are predictable — privacy labels, account deletion, sign-in requirements, permission strings that do not explain themselves. These are handled before the first submission, and if a rejection does come back, responding to it is part of the engagement rather than a change request.",
      },
      {
        heading: "Assume the network is bad",
        body: "Most of the users these apps serve are on mid-range Android phones on patchy mobile data. That means a local cache that renders instantly, writes that queue and retry, and screens that show real state rather than a spinner that never resolves. It is the difference between an app people keep and one they delete.",
      },
    ],
    faqs: [
      {
        q: "Can you publish under my developer account?",
        a: "Yes — that is the recommended setup, because your company should own the listing, the reviews and the user base. I work inside your App Store Connect and Play Console as a delegated user. Enrolling the accounts themselves requires your legal identity and payment, so that step stays with you.",
      },
      {
        q: "Do you build the backend too?",
        a: "Usually yes, and it is generally cheaper that way — a mobile app and its API designed together avoid the round-trip-per-screen problem that makes apps feel slow.",
      },
      {
        q: "What happens after launch?",
        a: "OS releases break things every year. A maintenance retainer covers SDK upgrades, store policy changes and crash triage. Without one, you get a documented release pipeline your own team can run.",
      },
    ],
    relatedCaseStudies: ["fitwithnash", "readynews", "belongdigital"],
    startingPoint: "Eight to fourteen weeks for a first release, depending on native or cross-platform.",
  },
  {
    slug: "ai-llm-engineering",
    name: "AI & LLM engineering",
    navLabel: "AI & LLM",
    headline: "Retrieval-grounded AI features that answer from your data, not from imagination",
    summary:
      "RAG systems, AI assistants and LLM-backed workflows built so the model answers from retrieved source documents and says it does not know when nothing relevant is retrieved — with the evaluation harness to prove it.",
    longTailTarget: "hire an AI LLM engineer to build a RAG chatbot for a startup",
    keywords: [
      "AI LLM engineer for startups",
      "RAG chatbot development",
      "hire AI engineer India",
      "LLM application development",
      "retrieval augmented generation consultant",
    ],
    icon: "brain",
    deliverables: [
      "Retrieval pipeline: chunking strategy, embeddings, vector store, reranking",
      "Grounded generation — answers cite retrieved chunks or decline",
      "Refusal path when retrieval returns nothing relevant",
      "Evaluation harness with a fixed question set, run in CI",
      "Cost and latency instrumentation per request",
      "Logged unanswered questions so content gaps become visible",
    ],
    stackOptions: [
      { label: "Models", options: ["Anthropic Claude", "OpenAI", "Open-weight models via vLLM / Ollama"] },
      { label: "Retrieval", options: ["pgvector", "SQLite + vector extension", "Managed vector DB", "Local lexical index"] },
      { label: "Orchestration", options: ["TypeScript / Next.js route handlers", "Python / FastAPI"] },
      { label: "Evaluation", options: ["Golden question sets in CI", "Retrieval hit-rate metrics", "Human review queue"] },
    ],
    sections: [
      {
        heading: "The chat widget on this site is the demonstration",
        body: "The assistant in the corner of this page runs the same architecture I build for clients. It indexes a knowledge base of markdown documents — one per service, one per case study, one for the process and bio — retrieves the most relevant chunks for each question, and answers only from those chunks. Ask it something outside the knowledge base and it says it does not have that information and offers to connect you directly. That is the whole point.",
      },
      {
        heading: "Grounding reduces hallucination substantially — it does not eliminate it",
        body: "Anyone selling you a guarantee of zero hallucination is selling you something they cannot deliver. What retrieval grounding does is make the failure mode honest: with no relevant source, the correct behaviour is a refusal rather than an invention, and that behaviour is testable. The evaluation harness runs a fixed question set on every deploy, including questions that should be refused, so a regression in the refusal path is caught by CI rather than by a customer.",
      },
      {
        heading: "Retrieval quality is the whole game",
        body: "Most disappointing AI features are not model problems, they are retrieval problems: chunks split mid-sentence, no metadata, one embedding pass and no reranking. The work is unglamorous — chunking on semantic boundaries, keeping document titles attached to their chunks, measuring hit rate against a real question set — and it is where the improvement actually comes from.",
      },
    ],
    faqs: [
      {
        q: "Will the AI make things up about my business?",
        a: "The system is built so it answers only from documents you control, and refuses when retrieval returns nothing relevant. That reduces fabrication substantially and makes the failure mode a visible refusal rather than a confident invention. It is not an absolute guarantee, and I will not claim it is — which is why the evaluation harness includes questions that must be refused.",
      },
      {
        q: "Which model do you use?",
        a: "Whichever fits the constraint. The retrieval layer and the generation layer are kept separate, so the model is a swappable dependency rather than an architectural commitment.",
      },
      {
        q: "What does it cost to run?",
        a: "Per-request token cost and latency are instrumented from the first build, so you see the running cost before launch rather than in the first invoice. Retrieval and caching are the two levers that actually move it.",
      },
    ],
    relatedCaseStudies: ["fitwithnash", "coremediasolutions", "newslive24"],
    startingPoint: "Three to six weeks for a grounded assistant with an evaluation harness.",
  },
  {
    slug: "seo-performance",
    name: "SEO & performance engineering",
    navLabel: "SEO & performance",
    headline: "Technical SEO and Core Web Vitals treated as engineering, not as a checklist",
    summary:
      "Structured data, rendering strategy, crawl architecture and a Core Web Vitals budget enforced in CI — the technical half of SEO, which is the half a developer is actually responsible for.",
    longTailTarget: "technical SEO engineer for a Next.js site with Core Web Vitals problems",
    keywords: [
      "technical SEO for Next.js",
      "Core Web Vitals optimisation service",
      "structured data JSON-LD implementation",
      "news publisher SEO India",
      "Lighthouse CI performance budget",
    ],
    icon: "gauge",
    deliverables: [
      "Rendering audit — what a crawler sees without JavaScript, per template",
      "JSON-LD graph appropriate to the site: Organization, Article, Service, FAQPage, BreadcrumbList",
      "Core Web Vitals budget enforced by Lighthouse CI on every push",
      "Crawl architecture: internal linking, sitemap generation, canonical discipline",
      "Metadata system — unique titles, descriptions and OG images per route",
      "A prioritised remediation list with the estimated effort of each item",
    ],
    stackOptions: [
      { label: "Rendering", options: ["Static generation", "Incremental static regeneration", "Server-side rendering", "Edge rendering"] },
      { label: "Structured data", options: ["Organization / Person", "Article / NewsArticle", "Service / OfferCatalog", "FAQPage", "BreadcrumbList"] },
      { label: "Measurement", options: ["Lighthouse CI", "Vercel Analytics", "Plausible", "GA4 via Tag Manager"] },
    ],
    sections: [
      {
        heading: "Rendering strategy is the largest single SEO decision",
        body: "A client-rendered page can be indexed, eventually, sometimes. A server-rendered page is indexed reliably. Every project in the portfolio that needed to rank — the Kesari regional editions, the news portals, the consultation funnel — puts its content in the initial HTML response. That single decision does more than any amount of keyword work.",
      },
      {
        heading: "Structured data describes the business, not just the page",
        body: "The FitWithNash consultation site declares Person, ProfessionalService, OfferCatalog, credentials and an FAQPage. Core Media Solutions mirrors its entire service catalogue in Service and Offer types. The news properties declare NewsMediaOrganization with ItemList and BreadcrumbList section hierarchy. Structured data is how you tell a search engine what a business is, in a form it does not have to guess at.",
      },
      {
        heading: "A performance budget that fails the build",
        body: "Performance work that is not enforced regresses within two sprints. The budget on this site — LCP under 2.5s, CLS under 0.1, INP under 200ms — is checked by Lighthouse CI in GitHub Actions on every push. The same setup is part of every delivery, because a number nobody checks is a number that drifts.",
      },
    ],
    faqs: [
      {
        q: "Can you guarantee a number-one ranking?",
        a: "No, and nobody honest can — ranking depends on competition and on content quality that no amount of engineering substitutes for. What I can do is make sure nothing technical is standing in the way: that your pages render for crawlers, load fast, describe themselves in structured data and link to each other sensibly.",
      },
      {
        q: "Do you write the content as well?",
        a: "I write technical content and the structural copy that carries SEO weight — page titles, headings, FAQ answers, service descriptions. Ongoing editorial content is usually better produced by someone inside your business who knows the subject.",
      },
      {
        q: "How do you report on the work?",
        a: "Before-and-after Lighthouse reports, a rendering audit showing what crawlers see per template, and the structured data validated against Google's Rich Results Test. Concrete artefacts, not a monthly slide.",
      },
    ],
    relatedCaseStudies: ["newslive24", "fitwithnash", "indianews16"],
    startingPoint: "One-week audit; two to six weeks of remediation depending on findings.",
  },
  {
    slug: "security-compliance",
    name: "Security & compliance consulting",
    navLabel: "Security & compliance",
    headline: "OWASP-grade hardening, dependency hygiene and honest compliance advice",
    summary:
      "Application security review against the OWASP Top 10, security headers, dependency scanning in CI, and straight guidance on what compliance work you can automate and what genuinely requires auditors and money.",
    longTailTarget: "OWASP security review and hardening for a web application before launch",
    keywords: [
      "OWASP Top 10 security review",
      "web application security consultant India",
      "security headers CSP implementation",
      "dependency vulnerability scanning CI",
      "pre-launch security audit",
    ],
    icon: "shield",
    deliverables: [
      "Review against the OWASP Top 10 with reproducible findings",
      "Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy",
      "Server-side input validation and output encoding on every mutating route",
      "CSRF protection and rate limiting on public endpoints",
      "Dependency scanning wired into CI, failing the build on high and critical findings",
      "Secrets audit — nothing sensitive reaching the client bundle",
    ],
    stackOptions: [
      { label: "Application", options: ["Input validation (zod)", "Output encoding", "CSRF tokens", "Rate limiting", "Session hardening"] },
      { label: "Transport", options: ["Strict-Transport-Security", "Content-Security-Policy", "Referrer-Policy", "Permissions-Policy"] },
      { label: "Supply chain", options: ["npm audit in CI", "Lockfile discipline", "Runtime version currency"] },
    ],
    sections: [
      {
        heading: "Most breaches are boring, and so is preventing them",
        body: "Unvalidated input, a mutating endpoint with no CSRF token, an unauthenticated form with no rate limit, a secret that ended up in the client bundle, a runtime three major versions past end of life. The work is checking each of these deliberately rather than assuming the framework did it. One portfolio project runs PHP 8.2.30 specifically because a supported runtime that still receives patches is a security control, not a preference.",
      },
      {
        heading: "Validate on the server, always",
        body: "Client-side validation is a user-experience feature. Every schema on this site is defined once with zod and enforced again inside the route handler, because the client is not a trust boundary. That is also why every mutating route here is CSRF-protected and rate-limited by IP.",
      },
      {
        heading: "What I will not pretend to automate",
        body: "Domain registration, ICANN registrant verification, EV certificate issuance, SOC 2 and ISO 27001 audits, penetration test attestation letters — these require legal identity, payment and independent third parties. I will scope them, prepare the evidence, implement the technical controls an auditor will ask for, and tell you plainly what it costs and how long it takes. What I will not do is imply that a script can produce a compliance certificate.",
      },
    ],
    faqs: [
      {
        q: "Is this a penetration test?",
        a: "No. This is an engineering review: reading the code and configuration, checking controls against the OWASP Top 10, and fixing what is found. A formal penetration test with an attestation letter comes from an independent testing firm, and I will help you scope and prepare for one.",
      },
      {
        q: "Can you get us SOC 2 compliant?",
        a: "I can implement and document the technical controls an auditor will look for, and prepare the evidence. The audit itself must be performed by an accredited third-party firm — that is what makes the certificate mean anything. Anyone claiming to automate the audit is describing the preparation, not the audit.",
      },
      {
        q: "How often should dependencies be scanned?",
        a: "On every push, as a build step that fails on high and critical findings. A monthly manual check means you are, on average, two weeks behind a published exploit.",
      },
    ],
    relatedCaseStudies: ["carbonmedia", "readynews", "newslive24"],
    startingPoint: "One-week review and hardening pass; ongoing coverage under a retainer.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
