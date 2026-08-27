export const bio = {
  name: "Deepak Joshi",
  studio: "Code Hippies",
  role: "Full-stack, mobile and AI/LLM engineer",
  positioning:
    "I build and ship production software for startups and agencies — web applications, iOS and Android apps, and AI systems that answer from your data instead of inventing answers.",
  paragraphs: [
    "I started at Deloitte USI, which is where I learned what \"production\" actually costs — the review gates, the audit trails, the fact that a change nobody can trace is a change nobody can defend. That experience is the reason a CI pipeline, a security review and a handover document are part of every project here rather than something you pay extra for.",
    "I am also the founder of Dharmarthlabs, which means I have been on the other side of the table: paying for engineering, waiting on a delivery, and discovering exactly which shortcuts cost more later. It changed how I scope work. Discovery happens before a price, the price is fixed against a written scope, and changes get quoted instead of quietly absorbed.",
    "Code Hippies is the studio I build under. The work runs from regional Hindi news platforms serving Uttarakhand, Himachal and Haryana, to a consultation funnel for a private dietitian, to a 21-kilobyte static site for an ashram that cannot carry a maintenance contract. Different stacks, because those were different problems — the technology choice follows the constraint rather than a preference.",
    "The current focus is AI and LLM engineering: retrieval-grounded assistants that answer from documents a business controls, with an evaluation harness that runs in CI and includes questions the system is supposed to refuse. The assistant on this site is built exactly that way, and you are welcome to try to break it.",
  ],
  credentials: [
    { label: "Previously", value: "Deloitte USI" },
    { label: "Founder", value: "Dharmarthlabs" },
    { label: "Studio", value: "Code Hippies" },
    { label: "Based in", value: "India — working globally" },
  ],
  /**
   * Repositories observed on the public GitHub profiles at build authoring time.
   * The About page also fetches live stats from the GitHub REST API on an ISR
   * revalidate cycle; this list is the verified fallback when that call fails.
   */
  knownRepos: [
    {
      name: "codehippies11/fitwithnash",
      language: "Astro",
      description: "Consultation site powering consult.fitwithnash.com.",
      url: "https://github.com/codehippies11/fitwithnash",
    },
    {
      name: "codehippies11/media-lexis-profile",
      language: "Astro",
      description:
        "World-class Astro corporate profile for Media Lexis, with editorial design, Framer Motion, accessibility, and SEO.",
      url: "https://github.com/codehippies11/media-lexis-profile",
    },
    {
      name: "codehippies11/orb-game",
      language: "HTML",
      description: "Orb game.",
      url: "https://github.com/codehippies11/orb-game",
    },
    {
      name: "deepakjoshi11/Web-Development",
      language: "HTML",
      description: "Web development work and experiments.",
      url: "https://github.com/deepakjoshi11/Web-Development",
    },
    {
      name: "deepakjoshi11/Android_dev",
      language: "Java / Kotlin",
      description: "Android development work.",
      url: "https://github.com/deepakjoshi11/Android_dev",
    },
  ],
} as const;
