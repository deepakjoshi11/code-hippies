export type Faq = { q: string; a: string; category: FaqCategory };
export type FaqCategory =
  | "Working together"
  | "Scope & pricing"
  | "Technology"
  | "AI & LLM"
  | "Security & ownership";

export const faqCategories: FaqCategory[] = [
  "Working together",
  "Scope & pricing",
  "Technology",
  "AI & LLM",
  "Security & ownership",
];

/**
 * Site-wide FAQ. Rendered as an FAQPage JSON-LD graph on /faq and as a
 * question-targeted content block, because question queries are the most
 * realistically winnable search terms for an independent studio.
 */
export const faqs: Faq[] = [
  {
    category: "Working together",
    q: "Who is Deepak Joshi and what is Code Hippies?",
    a: "Deepak Joshi is a full-stack, mobile and AI/LLM engineer who previously worked at Deloitte USI and is the founder of Dharmarthlabs. Code Hippies is the studio he builds under — an independent engineering practice serving startups and agencies, not a reseller and not a body shop. Every project is delivered by the person you talk to in the first call.",
  },
  {
    category: "Working together",
    q: "Do I work with you directly, or with a team I have never met?",
    a: "Directly. The person who scopes your project is the person who writes the code. When a project genuinely needs more hands — a large build on a hard deadline — that is discussed with you before anyone else touches the repository, and I stay accountable for the delivery.",
  },
  {
    category: "Working together",
    q: "Where are you based, and do you work with clients in other time zones?",
    a: "India, working with clients across India, the Gulf, the UK and North America. Overlap hours are agreed at the start of the engagement rather than assumed, and asynchronous updates mean you are not waiting on a call to know where the project stands.",
  },
  {
    category: "Working together",
    q: "How do I start a project?",
    a: "Send the project brief through the form on the contact page — it takes about two minutes and asks for project type, budget band and timeline so the first conversation can be useful rather than exploratory. Or message on WhatsApp using the button on any page if you would rather just ask a question first.",
  },
  {
    category: "Working together",
    q: "What happens in the first call?",
    a: "We establish what the software has to do, who uses it, what makes it a failure, and what constraints already exist — budget, deadline, systems you cannot replace. You leave with a stack recommendation and an honest read on feasibility, whether or not we work together.",
  },
  {
    category: "Working together",
    q: "Can you take over a project another developer started?",
    a: "Yes, and it is common. It starts with a short audit — what state the code is in, what is salvageable, what is a rewrite — delivered as a written assessment before any code changes. Sometimes the honest answer is that continuing costs more than restarting, and I will tell you that.",
  },
  {
    category: "Scope & pricing",
    q: "How much does a website or app cost?",
    a: "A focused marketing or consultation site is typically two to four weeks of work. A full web application with authentication, a database and an admin surface is usually six to twelve weeks. A first mobile release is eight to fourteen weeks. Exact pricing comes after discovery, because quoting before understanding the scope produces a number that is wrong in one direction or the other.",
  },
  {
    category: "Scope & pricing",
    q: "Do you work fixed-price or hourly?",
    a: "Fixed-scope projects are fixed-price, quoted after discovery against a scope you have signed off. Ongoing work runs as a monthly retainer with a reserved number of days. Joining an existing team runs on a day rate. Hourly billing on an undefined scope serves neither of us.",
  },
  {
    category: "Scope & pricing",
    q: "What is your smallest engagement?",
    a: "A one-week audit — technical SEO, performance, or a security review — which produces a prioritised findings list with effort estimates. Clients often use it to decide whether a larger engagement is worth it.",
  },
  {
    category: "Scope & pricing",
    q: "What happens if the scope changes mid-project?",
    a: "It gets quoted as a change, in writing, before it is built. What does not happen is silent absorption — which ends in a rushed delivery — or silent omission, which ends in a launch missing something you assumed was included.",
  },
  {
    category: "Scope & pricing",
    q: "Do you offer ongoing maintenance after launch?",
    a: "Yes, as a monthly retainer covering dependency and security patching, platform compatibility work, monitoring and a budgeted allowance for small changes. Declining a retainer is a legitimate choice — you just get a documented pipeline your own team can run, and you make that decision knowingly.",
  },
  {
    category: "Technology",
    q: "What technologies do you build with?",
    a: "Web on React/Next.js, Vue/Nuxt or Astro; backends on Node/NestJS, Python/Django or FastAPI, Go, or PHP 8.2+; mobile on Swift and SwiftUI for iOS, Kotlin for Android, or React Native and Flutter for cross-platform. The stack is chosen per project against your constraints — not every project uses every one of these.",
  },
  {
    category: "Technology",
    q: "Why is your portfolio built on so many different stacks?",
    a: "Because the right answer differs. An ashram that cannot carry a maintenance contract got 21 KB of static HTML on Bootstrap that will still work in a decade. A publisher whose editors will not leave WordPress got engineering work done around WordPress. Regional news editions that need stories crawlable immediately got server-rendered Next.js. Picking one stack for every client is a preference, not an engineering decision.",
  },
  {
    category: "Technology",
    q: "Should I choose native or cross-platform for my mobile app?",
    a: "If the app is mostly forms, lists and API calls, React Native or Flutter gets you two platforms for close to the price of one and your users will not notice the difference. If it leans on the camera, background location, widgets, HealthKit or heavy animation, native Swift and Kotlin costs less in total than fighting a bridge. That decision is made in discovery, with the tradeoff written down.",
  },
  {
    category: "Technology",
    q: "Can you make my existing site faster?",
    a: "Usually, yes — and usually the cause is rendering strategy, unbounded third-party scripts, or images shipped at the wrong size, in that order. A one-week audit gives you before-and-after Lighthouse numbers, a rendering audit showing what crawlers actually see, and a prioritised fix list with effort estimates.",
  },
  {
    category: "Technology",
    q: "Do you do design as well as development?",
    a: "Yes — as a design system rather than a set of pictures: tokens, type scale, spacing, and every component designed with its loading, empty and error states, since those are most of what users actually see. Accessibility is checked at design time, not retrofitted after.",
  },
  {
    category: "AI & LLM",
    q: "What can the AI assistant on this site actually answer?",
    a: "It answers from a knowledge base of documents about the services, the case studies, the process and the pricing models on this site. Ask it something outside that and it will tell you it does not have the information and offer to connect you on WhatsApp, rather than guessing.",
  },
  {
    category: "AI & LLM",
    q: "Will an AI assistant make things up about my business?",
    a: "A retrieval-grounded assistant answers only from documents you control and refuses when nothing relevant is retrieved. That reduces fabrication substantially and turns the failure mode into a visible refusal rather than a confident invention. It is not an absolute guarantee, and I will not sell it as one — which is exactly why the evaluation harness includes questions that must be refused, run on every deploy.",
  },
  {
    category: "AI & LLM",
    q: "What does it cost to run an AI feature?",
    a: "Per-request token cost and latency are instrumented from the first build, so you see the running cost before launch rather than in your first invoice. Retrieval quality and caching are the two levers that actually move it — a well-built retrieval layer sends far fewer tokens to the model.",
  },
  {
    category: "AI & LLM",
    q: "Which AI model do you use?",
    a: "Whichever fits the constraint — cost, latency, data residency, quality. The retrieval layer and the generation layer are kept separate, so the model stays a swappable dependency rather than an architectural commitment you are locked into.",
  },
  {
    category: "Security & ownership",
    q: "Who owns the code you write?",
    a: "You do, from the first commit. Work happens in your repository or is transferred to your organisation at handover, with full history, environment documentation and a local setup a new developer can run in under fifteen minutes.",
  },
  {
    category: "Security & ownership",
    q: "What security practices are included as standard?",
    a: "Server-side input validation on every route that accepts input, CSRF protection and rate limiting on mutating endpoints, security headers including CSP and HSTS, no secrets in the client bundle, and dependency scanning in CI that fails the build on high and critical findings. These are part of the build, not a paid extra.",
  },
  {
    category: "Security & ownership",
    q: "Can you handle domain registration, SSL and SOC 2 for us?",
    a: "SSL is automatic on the platforms used here and is handled as part of deployment. Domain registration and ICANN registrant verification require your legal identity and payment, so they stay in your name — with guidance through the process. SOC 2 and ISO 27001 require an accredited independent auditor; I implement and document the technical controls and prepare the evidence, but the audit itself cannot be automated by anyone, and I will not imply otherwise.",
  },
  {
    category: "Security & ownership",
    q: "What happens to my credentials and access when the project ends?",
    a: "Everything is transferred into your accounts at handover and my access is revoked. You should not need to contact me to keep your own software running — if you do, the handoff was done badly.",
  },
];

export const homeFaqs = faqs.filter((f) =>
  [
    "How much does a website or app cost?",
    "Who is Deepak Joshi and what is Code Hippies?",
    "What technologies do you build with?",
    "Who owns the code you write?",
    "Do you work fixed-price or hourly?",
    "Can you take over a project another developer started?",
  ].includes(f.q),
);
