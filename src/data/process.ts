export type ProcessStep = {
  n: string;
  title: string;
  duration: string;
  summary: string;
  youGet: string[];
  /** What the client is responsible for at this stage. */
  fromYou: string;
};

export const processSteps: ProcessStep[] = [
  {
    n: "01",
    title: "Discovery",
    duration: "3–5 days",
    summary:
      "Before anything is estimated, we establish what the software has to do, who it is for, and what makes it a failure. Most bad projects were mis-scoped, not badly coded.",
    youGet: [
      "A written problem statement we both signed off on",
      "Constraints made explicit: budget, deadline, existing systems, team skills",
      "A recommendation on stack, with the tradeoff stated in plain language",
      "A fixed-scope proposal with a price, not an hourly guess",
    ],
    fromYou: "Two hours of your time and access to whoever actually understands the business rules.",
  },
  {
    n: "02",
    title: "Planning & wireframing",
    duration: "3–7 days",
    summary:
      "Screens and data model are decided on paper, where changing your mind is free. Every screen is mapped to the data it needs and the actions it allows.",
    youGet: [
      "Low-fidelity wireframes for every screen in scope",
      "Data model and API surface sketched before implementation",
      "A build order that puts the riskiest thing first",
      "An explicit out-of-scope list",
    ],
    fromYou: "One review pass with real objections. Silence at this stage costs money later.",
  },
  {
    n: "03",
    title: "Design",
    duration: "1–2 weeks",
    summary:
      "A design system rather than a set of pictures — tokens, type scale, spacing, states. Components are designed with their loading, empty and error states, because those are most of what users actually see.",
    youGet: [
      "Design tokens: colour, type scale, spacing, radii, motion",
      "Component states designed, including empty and error",
      "Accessibility checked at design time — WCAG AA contrast, focus treatment",
      "Responsive behaviour defined at 360, 390, 768, 1024 and 1440px",
    ],
    fromYou: "Brand assets if they exist. If they do not, we make defensible choices and move on.",
  },
  {
    n: "04",
    title: "MVP",
    duration: "2–3 weeks",
    summary:
      "The thinnest version that a real user can complete a real task on, deployed somewhere you can open on your phone. Not a demo — a deployment.",
    youGet: [
      "A working deployment on a preview URL from the first week",
      "The single most valuable user journey, working end to end",
      "Early feedback while changing direction is still cheap",
    ],
    fromYou: "Use it. Genuinely use it, on your own phone, and tell me what is wrong.",
  },
  {
    n: "05",
    title: "Development",
    duration: "3–10 weeks",
    summary:
      "Full build in increments, each one merged behind a passing pipeline. You see progress on a preview URL continuously rather than at a milestone meeting.",
    youGet: [
      "Weekly increments, each deployed and reviewable",
      "Every change through CI: lint, typecheck, tests, build, performance budget",
      "Conventional commits, so the history is a readable record",
      "A running list of decisions and why they were made",
    ],
    fromYou: "A weekly review and quick answers when a business rule turns out to be ambiguous.",
  },
  {
    n: "06",
    title: "QA & security review",
    duration: "3–5 days",
    summary:
      "Cross-device testing, accessibility audit and a pass against the OWASP Top 10 before anything is called done — not after a user finds it.",
    youGet: [
      "Tested at 360, 390, 768, 1024 and 1440px on real devices",
      "Keyboard navigation and screen-reader pass; WCAG AA contrast verified",
      "OWASP Top 10 review of every route that accepts input",
      "Dependency audit with high and critical findings resolved",
      "Lighthouse scores against the agreed budget",
    ],
    fromYou: "Sign-off on the findings list — including anything you decide to accept rather than fix.",
  },
  {
    n: "07",
    title: "Deployment",
    duration: "1–2 days",
    summary:
      "Production release through the same pipeline that has been running all along. Nothing about launch day should be novel.",
    youGet: [
      "Production deploy from the pipeline, not from a laptop",
      "Security headers, TLS, caching and redirects verified in production",
      "Analytics and error reporting live before traffic arrives",
      "sitemap.xml and robots.txt verified and submitted",
    ],
    fromYou: "DNS access, or an hour with whoever holds it. Domain purchase stays in your name.",
  },
  {
    n: "08",
    title: "Handoff",
    duration: "2–3 days",
    summary:
      "You leave with a codebase your next developer can pick up without calling me. That is the test of whether handoff was done properly.",
    youGet: [
      "Repository in your organisation, with full history",
      "README that gets a new developer running locally in under fifteen minutes",
      "Architecture notes and the decision log",
      "Credentials transferred to your accounts, mine revoked",
      "A recorded walkthrough of the admin surfaces",
    ],
    fromYou: "Somewhere to transfer ownership to — your GitHub organisation and hosting accounts.",
  },
  {
    n: "09",
    title: "Maintenance",
    duration: "Ongoing, optional",
    summary:
      "Software rots even when nobody touches it: dependencies get CVEs, platforms deprecate APIs, mobile OS releases break things every year. A retainer covers that. Not taking one is a legitimate choice — you just make it knowingly.",
    youGet: [
      "Dependency and security patching on a defined cadence",
      "Platform and OS-release compatibility work",
      "Monitoring and an agreed response time for incidents",
      "A budgeted allowance for small changes each month",
    ],
    fromYou: "A decision, either way. Undecided is the expensive option.",
  },
];
