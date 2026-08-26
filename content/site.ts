export const site = {
  name: "Code Hippies",
  founder: "Deepak Joshi",
  role: "Founder & Lead Engineer",
  email: "djdeepakjoshi6@gmail.com",
  github: "https://github.com/codehippies11",
  githubPersonal: "https://github.com/deepakjoshi11",
  calendly: "mailto:djdeepakjoshi6@gmail.com?subject=Project%20enquiry",
  tagline: "Editorial web engineering",
  bases: ["Remote — Europe (CET)", "India (IST)"],
};

export const stats = [
  { value: 98, suffix: "+", label: "Lighthouse performance", note: "median across shipped builds" },
  { value: 24, suffix: "", label: "Repositories shipped", note: "client + studio work" },
  { value: 3, suffix: " wks", label: "Typical delivery", note: "brief to launch, signature build" },
  { value: 100, suffix: "%", label: "WCAG AA baseline", note: "every page, every build" },
];

export const services = [
  {
    title: "Editorial marketing sites",
    description:
      "Corporate profiles and brand sites with the typographic discipline of print — built in Astro so they load in under a second on a phone in a lift.",
    tag: "Most requested",
    span: "md:col-span-2",
  },
  {
    title: "Headless CMS builds",
    description:
      "Your team edits copy, plans, posts and people. Static pages regenerate on publish. No plugin soup, no monthly surprise.",
    tag: "Content",
    span: "md:col-span-1",
  },
  {
    title: "Motion & interaction",
    description:
      "Framer Motion choreography that guides attention instead of showing off — and respects prefers-reduced-motion.",
    tag: "Craft",
    span: "md:col-span-1",
  },
  {
    title: "Performance & accessibility rescue",
    description:
      "An existing site that ranks badly, fails audits, or fails people using screen readers. Measured, fixed, documented — with before/after numbers you can show a board.",
    tag: "Remediation",
    span: "md:col-span-2",
  },
];

export const work = [
  {
    name: "Media Lexis",
    kind: "Corporate profile",
    year: "2026",
    summary:
      "A corporate profile built like a printed annual report: editorial grid, restrained motion, and a structure that survives a legal review.",
    outcomes: [
      "Editorial layout system across every section",
      "Framer Motion choreography on scroll",
      "Accessibility and SEO baked into the build",
    ],
    stack: ["Astro", "React", "Framer Motion", "TypeScript"],
    href: "https://github.com/codehippies11/media-lexis-profile",
    accent: "from-brass-500/22 to-transparent",
  },
  {
    name: "Fit With Nash",
    kind: "Brand site + CMS",
    year: "2026",
    summary:
      "A coaching brand that needed to publish without a developer. Blog posts, plans and instructor pages generate statically from a headless CMS at build time.",
    outcomes: [
      "Static generation from a headless CMS API",
      "Tailwind v4 design system, Vercel delivery",
      "Deploys cleanly with or without the CMS attached",
    ],
    stack: ["Astro 7", "Tailwind v4", "Vercel", "Headless CMS"],
    href: "https://github.com/codehippies11/fitwithnash",
    accent: "from-brass-400/22 to-transparent",
  },
  {
    name: "Orb",
    kind: "Interactive toy",
    year: "2026",
    summary:
      "A browser game written in plain HTML, CSS and JavaScript — the studio's reminder that the platform is fast when you stop fighting it.",
    outcomes: [
      "Zero dependencies, zero build step",
      "Runs at 60fps on low-end hardware",
      "Sub-100KB total payload",
    ],
    stack: ["HTML", "Canvas", "Vanilla JS"],
    href: "https://github.com/codehippies11/orb-game",
    accent: "from-brass-600/22 to-transparent",
  },
];

export const process = [
  {
    step: "01",
    title: "Positioning call",
    duration: "45 minutes, free",
    body: "We talk about who you sell to and what currently stops them buying. If a website is not the answer, I will tell you so on this call rather than take the project.",
  },
  {
    step: "02",
    title: "Written proposal",
    duration: "Within 3 working days",
    body: "A fixed scope, a fixed price, and a fixed date. Everything the build includes, and the things it deliberately excludes, in plain English — not a slide deck.",
  },
  {
    step: "03",
    title: "Design in the browser",
    duration: "Week 1",
    body: "No static mockups to argue over. You get a real, deployed URL from day three and watch it become the site, reviewing on your own phone.",
  },
  {
    step: "04",
    title: "Build & harden",
    duration: "Weeks 2–3",
    body: "Content modelling, CMS wiring, motion, and the unglamorous part: Core Web Vitals, structured data, WCAG AA, and cross-browser testing.",
  },
  {
    step: "05",
    title: "Launch & handover",
    duration: "Launch week",
    body: "DNS, analytics, and a recorded walkthrough of your CMS. You own the repository and the hosting account. Nothing is held hostage.",
  },
  {
    step: "06",
    title: "Thirty days of aftercare",
    duration: "Included",
    body: "Bugs, tweaks and questions are on me for a month after launch. Most studios charge for this. It should not be a line item.",
  },
];

export const pricing = [
  {
    name: "Landing",
    eur: "1,200",
    inr: "1,10,000",
    fit: "One product, one audience, one decision.",
    timeline: "2 weeks",
    features: [
      "Single long-form page, fully bespoke",
      "Copy structure and wireframe included",
      "Lead form with spam protection",
      "Analytics, SEO and social cards",
      "Lighthouse 95+ on mobile",
      "30 days of aftercare",
    ],
    featured: false,
  },
  {
    name: "Signature",
    eur: "2,900",
    inr: "2,60,000",
    fit: "The site a serious company is judged by.",
    timeline: "3–4 weeks",
    features: [
      "Six to eight bespoke pages",
      "Headless CMS your team actually edits",
      "Editorial design system + motion",
      "Blog or case-study architecture",
      "WCAG AA audit with written report",
      "Structured data and technical SEO",
      "Recorded handover + 30 days aftercare",
    ],
    featured: true,
  },
  {
    name: "Platform",
    eur: "4,800",
    inr: "4,30,000",
    fit: "Multi-market, multi-language, integrated.",
    timeline: "6 weeks+",
    features: [
      "Everything in Signature",
      "Multi-language routing and hreflang",
      "CRM, booking or payment integrations",
      "Component library documented for your team",
      "Performance budget enforced in CI",
      "Staging environment and review workflow",
      "90 days of aftercare",
    ],
    featured: false,
  },
];

export const retainer = {
  eur: "900",
  inr: "80,000",
  points: [
    "A standing block of engineering hours each month",
    "New pages, campaigns and experiments",
    "Dependency, security and performance upkeep",
    "Same-day response on weekdays",
  ],
};

export const testimonials = [
  {
    quote:
      "We had been quoted three times this by a London agency for something slower and uglier. The profile site reads like our printed report, which is exactly what we asked for and nobody else understood.",
    name: "Marketing Director",
    title: "Media Lexis",
    initials: "ML",
  },
  {
    quote:
      "The handover video was fifteen minutes and I have not needed to email him since. My team publishes plans and posts on their own now.",
    name: "Founder",
    title: "Fit With Nash",
    initials: "FN",
  },
  {
    quote:
      "He told us on the first call that half of what we wanted would not move the needle, and to spend the budget elsewhere. That is why we signed.",
    name: "Managing Partner",
    title: "Professional services, Rotterdam",
    initials: "RT",
  },
  {
    quote:
      "Working across CET and IST sounded like a risk. In practice it meant work landed overnight and I reviewed it with my morning coffee.",
    name: "Head of Brand",
    title: "D2C, Berlin",
    initials: "BE",
  },
];

export const faqs = [
  {
    q: "Why are your prices below a European agency?",
    a: "Because you are not paying for an agency. There is no account manager, no sales team and no office in a capital city — the person you brief is the person who writes the code. I keep the studio small on purpose and price it so the work is worth doing well, not so it is the cheapest quote in your inbox.",
  },
  {
    q: "How does working across time zones actually go?",
    a: "I work an overlapping CET morning every weekday, so European clients get live hours for calls and reviews. Work that starts in your evening is usually waiting for you at breakfast. Indian clients get full IST overlap.",
  },
  {
    q: "Do you use templates?",
    a: "No. Every layout is designed for your content and your market. I do reuse my own engineering foundations — build config, accessibility helpers, CMS adapters — because rewriting solved problems is something you should not be billed for.",
  },
  {
    q: "Who owns the code?",
    a: "You do, completely, from the first commit. The repository is yours, hosting is in your own account, and the CMS is a service you control. If you want to move to another developer, nothing is locked to me.",
  },
  {
    q: "Can you work with our designer?",
    a: "Gladly. Hand me a Figma file and I will build it faithfully and tell you honestly which parts will hurt performance or accessibility before I start, not after.",
  },
  {
    q: "What if we need changes after launch?",
    a: "The first thirty days are included — bugs, copy tweaks, small adjustments. After that, either book work ad hoc or move onto a monthly retainer if you are shipping continuously.",
  },
  {
    q: "How do payments work?",
    a: "Fifty percent to reserve the dates, fifty percent on launch. European clients are invoiced in euros by bank transfer; Indian clients in rupees. Fixed price means fixed — scope changes are quoted separately before any work begins.",
  },
];

export const stack = [
  "Astro", "Next.js", "React", "TypeScript", "Tailwind CSS",
  "Framer Motion", "Node.js", "Headless CMS", "Vercel",
  "Core Web Vitals", "WCAG AA", "Structured Data", "Android",
];
