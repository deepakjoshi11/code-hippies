export type Faq = {
  q: string;
  a: string;
  category: FaqCategory;
  /**
   * Alternate phrasings a visitor might type. Used by the assistant's exact
   * matcher so "what does it cost" reaches the same answer as the canonical
   * question, without going through retrieval at all.
   */
  aka?: string[];
};

export type FaqCategory =
  | "Working together"
  | "Scope & pricing"
  | "Timelines & delivery"
  | "Technology"
  | "Mobile apps"
  | "AI & LLM"
  | "SEO & performance"
  | "Security & ownership"
  | "After launch";

export const faqCategories: FaqCategory[] = [
  "Working together",
  "Scope & pricing",
  "Timelines & delivery",
  "Technology",
  "Mobile apps",
  "AI & LLM",
  "SEO & performance",
  "Security & ownership",
  "After launch",
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
    aka: ["Who are you?", "Tell me about Code Hippies", "Who runs this studio?"],
  },
  {
    category: "Working together",
    q: "Do I work with you directly, or with a team I have never met?",
    a: "Directly. The person who scopes your project is the person who writes the code. When a project genuinely needs more hands — a large build on a hard deadline — that is discussed with you before anyone else touches the repository, and I stay accountable for the delivery.",
    aka: ["Do you outsource?", "Is this an agency?", "Who actually writes the code?"],
  },
  {
    category: "Working together",
    q: "How do I start a project?",
    a: "Send the project brief through the form on the contact page — it takes about two minutes and asks for project type, budget band and timeline so the first conversation can be useful rather than exploratory. Or message on WhatsApp using the button on any page if you would rather just ask a question first.",
    aka: ["How do I get started?", "How do I hire you?", "I want to work with you"],
  },
  {
    category: "Working together",
    q: "What happens in the first call?",
    a: "We establish what the software has to do, who uses it, what makes it a failure, and what constraints already exist — budget, deadline, systems you cannot replace. You leave with a stack recommendation and an honest read on feasibility, whether or not we work together.",
    aka: ["What is the discovery call like?", "What do we discuss first?"],
  },
  {
    category: "Working together",
    q: "Can you take over a project another developer started?",
    a: "Yes, and it is common. It starts with a short audit — what state the code is in, what is salvageable, what is a rewrite — delivered as a written assessment before any code changes. Sometimes the honest answer is that continuing costs more than restarting, and I will tell you that.",
    aka: ["Can you fix someone else's code?", "Can you rescue a failing project?", "Our last developer left"],
  },
  {
    category: "Scope & pricing",
    q: "How much does a website or app cost?",
    a: "A focused marketing or consultation site is typically two to four weeks of work. A full web application with authentication, a database and an admin surface is usually six to twelve weeks. A first mobile release is eight to fourteen weeks. Exact pricing comes after discovery, because quoting before understanding the scope produces a number that is wrong in one direction or the other.",
    aka: ["What are your rates?", "What does it cost?", "How much do you charge?", "What is your pricing?"],
  },
  {
    category: "Scope & pricing",
    q: "Do you work fixed-price or hourly?",
    a: "Fixed-scope projects are fixed-price, quoted after discovery against a scope you have signed off. Ongoing work runs as a monthly retainer with a reserved number of days. Joining an existing team runs on a day rate. Hourly billing on an undefined scope serves neither of us.",
    aka: ["Do you bill hourly?", "Is it a fixed price?", "How do you price work?"],
  },
  {
    category: "Scope & pricing",
    q: "What happens if the scope changes mid-project?",
    a: "It gets quoted as a change, in writing, before it is built. What does not happen is silent absorption — which ends in a rushed delivery — or silent omission, which ends in a launch missing something you assumed was included.",
    aka: ["What if we change our minds?", "Can we add features later?", "How do change requests work?"],
  },
  {
    category: "Scope & pricing",
    q: "Do you offer ongoing maintenance after launch?",
    a: "Yes, as a monthly retainer covering dependency and security patching, platform compatibility work, monitoring and a budgeted allowance for small changes. Declining a retainer is a legitimate choice — you just get a documented pipeline your own team can run, and you make that decision knowingly.",
    aka: ["Do you offer support?", "Is there ongoing support?"],
  },
  {
    category: "Technology",
    q: "What technologies do you build with?",
    a: "Web on React/Next.js, Vue/Nuxt or Astro; backends on Node/NestJS, Python/Django or FastAPI, Go, or PHP 8.2+; mobile on Swift and SwiftUI for iOS, Kotlin for Android, or React Native and Flutter for cross-platform. The stack is chosen per project against your constraints — not every project uses every one of these.",
    aka: ["What is your tech stack?", "What languages do you use?", "What frameworks do you work with?"],
  },
  {
    category: "Technology",
    q: "Why is your portfolio built on so many different stacks?",
    a: "Because the right answer differs. An ashram that cannot carry a maintenance contract got 21 KB of static HTML on Bootstrap that will still work in a decade. A publisher whose editors will not leave WordPress got engineering work done around WordPress. Regional news editions that need stories crawlable immediately got server-rendered Next.js. Picking one stack for every client is a preference, not an engineering decision.",
    aka: ["Why so many technologies?", "Which stack is best?"],
  },
  {
    category: "Mobile apps",
    q: "Should I choose native or cross-platform for my mobile app?",
    a: "If the app is mostly forms, lists and API calls, React Native or Flutter gets you two platforms for close to the price of one and your users will not notice the difference. If it leans on the camera, background location, widgets, HealthKit or heavy animation, native Swift and Kotlin costs less in total than fighting a bridge. That decision is made in discovery, with the tradeoff written down.",
    aka: ["React Native or Swift?", "Is Flutter good enough?", "Native vs cross platform"],
  },
  {
    category: "Technology",
    q: "Can you make my existing site faster?",
    a: "Usually, yes — and usually the cause is rendering strategy, unbounded third-party scripts, or images shipped at the wrong size, in that order. A one-week audit gives you before-and-after Lighthouse numbers, a rendering audit showing what crawlers actually see, and a prioritised fix list with effort estimates.",
    aka: ["Can you speed up my website?", "My site needs optimising"],
  },
  {
    category: "Technology",
    q: "Do you do design as well as development?",
    a: "Yes — as a design system rather than a set of pictures: tokens, type scale, spacing, and every component designed with its loading, empty and error states, since those are most of what users actually see. Accessibility is checked at design time, not retrofitted after.",
    aka: ["Do you design too?", "Can you do UI design?", "Do I need a separate designer?"],
  },
  {
    category: "AI & LLM",
    q: "What can the AI assistant on this site actually answer?",
    a: "It answers from a knowledge base of documents about the services, the case studies, the process and the pricing models on this site. Ask it something outside that and it will tell you it does not have the information and offer to connect you on WhatsApp, rather than guessing.",
    aka: ["What can you help with?", "What do you know?", "What can I ask you?"],
  },
  {
    category: "AI & LLM",
    q: "Will an AI assistant make things up about my business?",
    a: "A retrieval-grounded assistant answers only from documents you control and refuses when nothing relevant is retrieved. That reduces fabrication substantially and turns the failure mode into a visible refusal rather than a confident invention. It is not an absolute guarantee, and I will not sell it as one — which is exactly why the evaluation harness includes questions that must be refused, run on every deploy.",
    aka: ["Does AI hallucinate?", "How do you stop hallucination?", "Is the AI accurate?"],
  },
  {
    category: "AI & LLM",
    q: "What does it cost to run an AI feature?",
    a: "Per-request token cost and latency are instrumented from the first build, so you see the running cost before launch rather than in your first invoice. Retrieval quality and caching are the two levers that actually move it — a well-built retrieval layer sends far fewer tokens to the model.",
    aka: ["How much does AI cost to run?", "What are LLM token costs?"],
  },
  {
    category: "AI & LLM",
    q: "Which AI model do you use?",
    a: "Whichever fits the constraint — cost, latency, data residency, quality. The retrieval layer and the generation layer are kept separate, so the model stays a swappable dependency rather than an architectural commitment you are locked into.",
    aka: ["Do you use ChatGPT?", "Which LLM do you use?", "Do you use Claude?"],
  },
  {
    category: "Security & ownership",
    q: "Who owns the code you write?",
    a: "You do, from the first commit. Work happens in your repository or is transferred to your organisation at handover, with full history, environment documentation and a local setup a new developer can run in under fifteen minutes.",
    aka: ["Do I own the code?", "Who owns the IP?", "Is the code mine?"],
  },
  {
    category: "Security & ownership",
    q: "What security practices are included as standard?",
    a: "Server-side input validation on every route that accepts input, CSRF protection and rate limiting on mutating endpoints, security headers including CSP and HSTS, no secrets in the client bundle, and dependency scanning in CI that fails the build on high and critical findings. These are part of the build, not a paid extra.",
    aka: ["Is the site secure?", "What security do you include?", "How do you handle security?"],
  },
  {
    category: "Security & ownership",
    q: "Can you handle domain registration, SSL and SOC 2 for us?",
    a: "SSL is automatic on the platforms used here and is handled as part of deployment. Domain registration and ICANN registrant verification require your legal identity and payment, so they stay in your name — with guidance through the process. SOC 2 and ISO 27001 require an accredited independent auditor; I implement and document the technical controls and prepare the evidence, but the audit itself cannot be automated by anyone, and I will not imply otherwise.",
    aka: ["Do you buy the domain?", "Can you get us SOC 2?", "Do you handle SSL?"],
  },
  {
    category: "Working together",
    q: "What time zones do you overlap with?",
    a: "Overlap is agreed at the start of the engagement rather than assumed. Working from India, mornings overlap comfortably with the Gulf, Europe and the UK, and late afternoons reach the US East Coast. West Coast work runs mostly asynchronously with two fixed calls a week. You get written updates either way, so you are never waiting on a call to know where the project stands.",
    aka: ["Do you work in my time zone?", "What hours are you available?", "Can you work US hours?"],
  },
  {
    category: "Working together",
    q: "How do we communicate during a project?",
    a: "A shared channel — Slack, WhatsApp or email, whichever you already live in — plus one scheduled review each week. Progress is visible continuously on a preview URL rather than reported at milestones, and decisions get written down in a running log so nobody has to reconstruct why something was built a particular way six months later.",
    aka: ["What project management tool do you use?", "How often will we talk?", "Do you do standups?"],
  },
  {
    category: "Working together",
    q: "Do you sign an NDA?",
    a: "Yes, before any commercially sensitive detail is shared. Send yours and it gets signed, or one can be provided. Client code and business detail are treated as confidential whether or not an NDA exists, and nothing appears in this portfolio without permission.",
    aka: ["Will you sign a non-disclosure agreement?", "Is my idea safe?", "Do you keep things confidential?"],
  },
  {
    category: "Scope & pricing",
    q: "Do you require a deposit?",
    a: "Fixed-scope projects are invoiced in stages tied to delivery — typically a deposit to start, one or more payments at agreed milestones, and a balance at handover. Retainers are invoiced monthly in advance. Nothing is billed for work that has not been done.",
    aka: ["How does payment work?", "What are your payment terms?", "Do I pay upfront?"],
  },
  {
    category: "Scope & pricing",
    q: "Is hosting and domain cost included in your price?",
    a: "No, and deliberately so. Hosting, domains and third-party licences stay in your name and on your card, because software you cannot pay the bills for is software you do not really own. Typical running costs are estimated during discovery so the total is not a surprise, and the platforms used here mostly have generous free tiers.",
    aka: ["Do you charge for hosting?", "Who pays for the domain?", "What are the running costs?"],
  },
  {
    category: "Timelines & delivery",
    q: "How quickly can you start?",
    a: "Usually within one to three weeks, depending on what is already committed. Discovery can often start sooner than the build, which is useful — it means the scope is ready the moment capacity opens up rather than starting from scratch then.",
    aka: ["When can you start?", "What is your availability?", "How busy are you?"],
  },
  {
    category: "Timelines & delivery",
    q: "How long does a website take to build?",
    a: "A focused marketing or consultation site is typically two to four weeks from discovery to launch. A content-managed site with multiple templates is four to six. A full web application with authentication, a database and an admin surface is six to twelve weeks, delivered in working increments rather than as one launch date.",
    aka: ["How long does a website take?", "What is the timeline for a website?", "How fast can you build a site?"],
  },
  {
    category: "Timelines & delivery",
    q: "Can you hit a hard deadline?",
    a: "Sometimes, and the honest answer comes in discovery rather than after you have paid. If the deadline is real — a funding round, a launch event, a regulatory date — we scope backwards from it and decide together what ships and what waits. A deadline met by quietly dropping the security review is not a deadline met.",
    aka: ["I have a launch date", "Can you work to a deadline?", "We need this by a certain date"],
  },
  {
    category: "Timelines & delivery",
    q: "Will I see progress before launch?",
    a: "From the first week. There is a deployed preview URL you can open on your own phone, updated continuously, rather than a demo at a milestone meeting. The MVP stage exists specifically so you are using a real thing while changing direction is still cheap.",
    aka: ["Can I see it as you build?", "Do I get a staging site?", "How do I track progress?"],
  },
  {
    category: "Timelines & delivery",
    q: "What slows projects down most often?",
    a: "Waiting on decisions and waiting on content, in that order — almost never the code. The stages in the process each name what is needed from you for exactly this reason. A business rule that takes two days to get answered is two days added to the timeline, and it is worth knowing that before it happens rather than after.",
    aka: ["Why do projects get delayed?", "What causes delays?", "What do you need from me to stay on schedule?"],
  },
  {
    category: "Technology",
    q: "Do you build e-commerce sites?",
    a: "Yes — either on a hosted platform when you want to run it yourself with no engineering on call, or custom when the catalogue, pricing rules or checkout genuinely do not fit an off-the-shelf platform. That choice gets made in discovery, and the honest recommendation is often the hosted one.",
    aka: ["Can you build an online store?", "Do you do Shopify?", "Can you build a shopping site?"],
  },
  {
    category: "Technology",
    q: "Can you integrate payments?",
    a: "Yes — Razorpay, Stripe, PayPal and similar. Payment work is done server-side with webhook verification and idempotency handling, because the failure mode that matters is not a broken checkout, it is a customer charged twice or an order that never records.",
    aka: ["Do you integrate Stripe?", "Can you add Razorpay?", "Can you take payments on my site?"],
  },
  {
    category: "Technology",
    q: "Can I edit the content myself after launch?",
    a: "Yes, if that is a requirement — say so in discovery, because it changes the build. Options run from a headless CMS to a simple admin surface to plain markdown files, and the right one depends on who is editing and how often. If nobody will actually edit it, a CMS is cost with no return.",
    aka: ["Do I get a CMS?", "Can I update the site myself?", "Is there an admin panel?"],
  },
  {
    category: "Technology",
    q: "Will my site work in Hindi or other languages?",
    a: "Yes. Four sites in this portfolio serve Hindi content, three of them as server-rendered Devanagari with the correct language declaration and structured data so search engines index them properly. Multi-language support is a build-time decision rather than a plugin, so raise it in discovery.",
    aka: ["Do you build multilingual sites?", "Can you do a Hindi website?", "Do you support other languages?"],
  },
  {
    category: "Mobile apps",
    q: "How much does a mobile app cost compared to a website?",
    a: "More, generally — a first app release is typically eight to fourteen weeks against two to four for a focused site, because there are two platforms, store review, and an API to design alongside. Cross-platform narrows that gap considerably when the app is mostly forms, lists and API calls. Exact pricing follows discovery.",
    aka: ["Is an app more expensive than a website?", "What does an app cost?", "App vs website cost"],
  },
  {
    category: "Mobile apps",
    q: "Do I need an app, or would a website do?",
    a: "Most businesses asking for an app need a fast mobile website. An app earns its cost when you need push notifications people actually act on, offline use, camera or background location, or when repeat usage is high enough that an icon on the home screen changes behaviour. If none of those apply, a website reaches everyone immediately with no store review and no install friction.",
    aka: ["Should I build an app or a website?", "Do I really need an app?", "Is a web app enough?"],
  },
  {
    category: "Mobile apps",
    q: "How long does App Store review take?",
    a: "Usually 24 to 48 hours once the submission is correct — the delay is almost always a rejection, not the queue. Privacy labels, account deletion, sign-in requirements and permission strings that do not explain themselves are the predictable causes, and they are handled before the first submission rather than after.",
    aka: ["How long to get on the App Store?", "What if Apple rejects the app?", "How does app review work?"],
  },
  {
    category: "Mobile apps",
    q: "Do you handle app updates after launch?",
    a: "Under a retainer, yes — and mobile is the clearest case for one. iOS and Android both ship releases every year that deprecate APIs, change permission behaviour or tighten store policy. An app nobody maintains does not stay working; it stays working until the next OS release.",
    aka: ["Who maintains the app?", "Do you support apps after release?", "What about OS updates?"],
  },
  {
    category: "SEO & performance",
    q: "Why is my current site slow?",
    a: "In order of how often it turns out to be the cause: rendering strategy, unbounded third-party scripts, and images shipped at the wrong size. A one-week audit gives you before-and-after Lighthouse numbers, a rendering audit showing what crawlers actually see per template, and a prioritised fix list with effort estimates against each item.",
    aka: ["My website is slow", "How do I make my site faster?", "Why does my site take so long to load?"],
  },
  {
    category: "SEO & performance",
    q: "Will a new site hurt my existing search rankings?",
    a: "It can, and that risk is managed rather than hoped away. URL structure is preserved wherever possible, every changed URL gets a 301 redirect, structured data and metadata are carried across, and the sitemap is resubmitted at launch. Rankings usually wobble for a week or two after any migration; without redirect discipline, they do not come back.",
    aka: ["Will I lose my rankings?", "Is a redesign bad for SEO?", "What about my existing traffic?"],
  },
  {
    category: "SEO & performance",
    q: "How long before I see SEO results?",
    a: "Technical fixes — rendering, structured data, Core Web Vitals — show up in weeks because they change how quickly and reliably you get crawled. Ranking for competitive terms is a content and authority problem measured in months, and no amount of engineering substitutes for it. Anyone promising a timeline for rankings is guessing.",
    aka: ["How fast does SEO work?", "When will I rank?", "How long until I see traffic?"],
  },
  {
    category: "SEO & performance",
    q: "Do you do keyword research and content writing?",
    a: "I write the structural copy that carries SEO weight — page titles, headings, service descriptions, FAQ answers — and the technical content. Ongoing editorial content is usually better produced by someone inside your business who knows the subject; I set up the structure and the internal linking so that content actually gets found.",
    aka: ["Can you write blog posts?", "Do you do content marketing?", "Will you do keyword research?"],
  },
  {
    category: "SEO & performance",
    q: "Can you set up analytics and tracking?",
    a: "Yes — GA4 through Tag Manager, or a lighter privacy-respecting option like Plausible or Vercel Analytics where you do not need the full stack. Measurement goes in before launch rather than after, because a launch you cannot measure is a launch you cannot learn from. No invasive tracking, and no third-party sharing you have not agreed to.",
    aka: ["Do you install Google Analytics?", "Can you set up conversion tracking?", "How do I measure results?"],
  },
  {
    category: "Security & ownership",
    q: "Is my site GDPR or privacy-law compliant?",
    a: "The technical controls are implemented — minimal data collection, no third-party sharing you have not agreed to, cookie and consent handling where analytics require it, and a documented record of what is collected and why. The policy text itself and the legal determination for your jurisdiction should come from a lawyer, not a developer, and I will tell you that rather than hand you a template and imply it is advice.",
    aka: ["Do you handle GDPR?", "Is the site privacy compliant?", "What about cookie consent?"],
  },
  {
    category: "Security & ownership",
    q: "What happens to my site if something happens to you?",
    a: "Nothing, and that is the point of doing handover properly. The repository is in your organisation with full history, the README gets a new developer running locally in under fifteen minutes, architecture decisions are documented, and every credential is in your accounts rather than mine. If your business depends on being able to reach me, the handoff was done badly.",
    aka: ["What if you disappear?", "Am I locked in to you?", "What is the bus factor?"],
  },
  {
    category: "After launch",
    q: "What is covered in the 30 days after launch?",
    a: "Defects — anything that does not do what the agreed scope said it would — are fixed at no charge for 30 days after launch. New features and changes of mind are quoted as changes. The distinction is deliberate and is written into the proposal so it is not being argued about while your site is live.",
    aka: ["Is there a warranty?", "What if something breaks after launch?", "Do you fix bugs for free?"],
  },
  {
    category: "After launch",
    q: "What does a maintenance retainer actually cover?",
    a: "Dependency and security patching on a defined cadence, platform and OS-release compatibility work, monitoring with an agreed incident response time, and a budgeted allowance for small changes each month. You also get a written monthly summary of what shipped and what is next, so the retainer is visible rather than a standing invoice.",
    aka: ["What do I get for a retainer?", "Is maintenance worth it?", "What does support include?"],
  },
  {
    category: "After launch",
    q: "What if I do not want a retainer?",
    a: "That is a legitimate choice and plenty of clients make it. You get a documented CI/CD pipeline your own team or your next developer can run, and a handover written so they do not need to call me. The only thing I ask is that the decision is made knowingly — software rots even when nobody touches it, because dependencies get CVEs and platforms deprecate APIs.",
    aka: ["Can I skip maintenance?", "Do I have to pay monthly?", "Is a retainer required?"],
  },
  {
    category: "After launch",
    q: "Can you train my team to take over?",
    a: "Yes, and under staff augmentation that is an explicit goal rather than a favour. Handover includes a recorded walkthrough of the admin surfaces, architecture notes, the decision log, and as many working sessions as your team needs. Knowledge that leaves when the contractor leaves was never really transferred.",
    aka: ["Will you train us?", "Can our developers take over?", "Do you do knowledge transfer?"],
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
