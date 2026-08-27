/**
 * Case study data.
 *
 * Every `verified` signal in this file was observed directly by fetching the
 * live URL and reading the response headers, HTML source and embedded JSON-LD.
 * Nothing here is inferred marketing copy. If a signal could not be observed it
 * is simply absent — see NOTES.md for the verification method.
 */

export type CaseStudy = {
  slug: string;
  name: string;
  url: string;
  displayUrl: string;
  category: "News & Publishing" | "Marketing & Agency" | "Health & Coaching" | "Community & Non-profit";
  year: string;
  /** One-line positioning used on cards. */
  summary: string;
  /** Section 1 requirement: engineering layer, 1-2 lines. */
  engineering: string;
  /** Section 1 requirement: layman layer, 1 line. */
  layman: string;
  /** Observed technology signals, each traceable to the live response. */
  verified: string[];
  stack: string[];
  services: string[];
  /** Slugs of 2-3 related case studies for internal linking. */
  related: string[];
  /** Primary service page this study links to. */
  serviceSlug: string;
  problem: string;
  approach: string[];
  outcome: string[];
  accentFrom: string;
  accentTo: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "uttaranchal-kesari",
    name: "Uttaranchal Kesari",
    url: "https://www.uttaranchalkesari.com/",
    displayUrl: "uttaranchalkesari.com",
    category: "News & Publishing",
    year: "2026",
    summary: "Hindi regional news platform for Uttarakhand, served from a Next.js app behind Caddy.",
    engineering:
      "Next.js application server (confirmed by an `x-powered-by: Next.js` response header) fronted by Caddy for TLS termination, serving server-rendered Hindi article markup at `lang=\"hi\"` with `NewsMediaOrganization`, `WebSite` and `SearchAction` JSON-LD emitted on the document.",
    layman:
      "Publishes Uttarakhand's daily Hindi news in a form Google News and search engines can read the moment a story goes live.",
    verified: [
      "Response header `x-powered-by: Next.js`",
      "Response header `server: Caddy`",
      "`<html lang=\"hi\">` with server-rendered Devanagari headlines in the initial HTML",
      "JSON-LD graph containing NewsMediaOrganization, WebSite and SearchAction",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
    ],
    stack: ["Next.js", "React", "Caddy", "Server-side rendering", "JSON-LD / Schema.org"],
    services: ["Web development", "SEO engineering", "DevOps & CI/CD"],
    related: ["himachal-kesari", "haryana-kesari", "readynews"],
    serviceSlug: "web-development",
    problem:
      "Regional Hindi publishers are usually stuck on heavyweight themes that render slowly on the mid-range Android phones most of their readers use, and that bury article structure behind client-side JavaScript that crawlers never execute.",
    approach: [
      "Server-render every article and section page so the full Devanagari headline and body text is present in the initial HTML payload rather than hydrated in later.",
      "Emit a NewsMediaOrganization + WebSite JSON-LD graph on the document so search engines can attribute the publication and expose a sitelinks search box.",
      "Terminate TLS and serve at the edge through Caddy, keeping certificate renewal automatic rather than a manual annual chore.",
      "Publish a machine-generated sitemap and robots policy so newly published stories are discoverable without manual submission.",
    ],
    outcome: [
      "Article HTML is readable by crawlers without executing JavaScript.",
      "Publication identity is machine-declared through structured data.",
      "The editorial team publishes without touching infrastructure.",
    ],
    accentFrom: "oklch(0.7 0.16 165)",
    accentTo: "oklch(0.63 0.16 45)",
  },
  {
    slug: "himachal-kesari",
    name: "Himachal Kesari",
    url: "https://www.himachalkesari.com/",
    displayUrl: "himachalkesari.com",
    category: "News & Publishing",
    year: "2026",
    summary: "The same Hindi publishing platform, deployed for Himachal Pradesh behind Cloudflare.",
    engineering:
      "A second tenant of the same Next.js publishing platform, this one served through Cloudflare (`server: cloudflare`, `x-powered-by: Next.js`) with the heaviest editorial payload of the three regional editions and the same NewsMediaOrganization / SearchAction structured-data graph.",
    layman:
      "Gives Himachal Pradesh its own Hindi news brand without rebuilding the publishing system from scratch.",
    verified: [
      "Response header `x-powered-by: Next.js`",
      "Response header `server: cloudflare` — CDN in front of the origin",
      "`<html lang=\"hi\">`; server-rendered section headings such as मुख्य समाचार present in source",
      "JSON-LD graph containing NewsMediaOrganization, WebSite and SearchAction",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
    ],
    stack: ["Next.js", "React", "Cloudflare CDN", "Multi-tenant content platform", "JSON-LD / Schema.org"],
    services: ["Web development", "SEO engineering", "DevOps & CI/CD"],
    related: ["uttaranchal-kesari", "haryana-kesari", "indianews16"],
    serviceSlug: "web-development",
    problem:
      "Launching a second regional edition is where most publishing projects go wrong: the usual answer is to clone the codebase, and from that point every fix has to be applied twice.",
    approach: [
      "Run the new edition as another tenant of the existing platform rather than a forked codebase, so a fix ships to every edition at once.",
      "Keep per-edition branding, sections and structured-data identity configurable instead of hard-coded.",
      "Put Cloudflare in front of the origin so cacheable pages are served close to the reader.",
    ],
    outcome: [
      "A new regional edition launches as configuration, not as a fork.",
      "One codebase, one deployment pipeline, three published mastheads.",
    ],
    accentFrom: "oklch(0.72 0.15 220)",
    accentTo: "oklch(0.7 0.16 165)",
  },
  {
    slug: "haryana-kesari",
    name: "Haryana Kesari",
    url: "https://www.haryanakesari.com/",
    displayUrl: "haryanakesari.com",
    category: "News & Publishing",
    year: "2026",
    summary: "Newest edition of the Kesari network — platform live and awaiting its editorial launch.",
    engineering:
      "Third tenant of the same Next.js + Caddy publishing stack, live and serving a correctly structured empty state (the homepage renders अभी कोई प्रकाशित खबर उपलब्ध नहीं — \"no published stories yet\") with its NewsMediaOrganization and WebSite JSON-LD identity already in place.",
    layman:
      "The Haryana masthead is built, deployed and search-ready; it starts ranking from day one of publishing rather than from month three.",
    verified: [
      "Response header `x-powered-by: Next.js`",
      "Response header `server: Caddy`",
      "`<html lang=\"hi\">`; homepage renders an explicit empty state rather than an error",
      "JSON-LD graph containing NewsMediaOrganization and WebSite",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
    ],
    stack: ["Next.js", "React", "Caddy", "Multi-tenant content platform", "JSON-LD / Schema.org"],
    services: ["Web development", "SEO engineering", "DevOps & CI/CD"],
    related: ["uttaranchal-kesari", "himachal-kesari", "carbonmedia"],
    serviceSlug: "web-development",
    problem:
      "A masthead that launches the same day its first story is written spends its first months invisible: no indexed sitemap, no declared publisher identity, no crawl history.",
    approach: [
      "Deploy the edition ahead of editorial go-live so robots, sitemap and publisher structured data are already discoverable.",
      "Render a deliberate, human-readable empty state instead of a 404 or a broken template while the desk staffs up.",
      "Reuse the tenant configuration path proven by the Uttarakhand and Himachal editions.",
    ],
    outcome: [
      "Infrastructure and search identity are live before the first story is filed.",
      "Editorial launch becomes a content decision, not an engineering project.",
    ],
    accentFrom: "oklch(0.75 0.15 90)",
    accentTo: "oklch(0.63 0.16 45)",
  },
  {
    slug: "newslive24",
    name: "NewsLive24",
    url: "https://www.newslive24.in/",
    displayUrl: "newslive24.in",
    category: "News & Publishing",
    year: "2025",
    summary: "English-language India news portal on WordPress, tuned for news structured data and ad revenue.",
    engineering:
      "WordPress origin behind nginx, instrumented with GA4 via Google Tag Manager and monetised with Google AdSense; the document carries the richest structured-data graph of the portfolio — NewsArticle, NewsMediaOrganization, CollectionPage, ItemList, ContactPoint and SearchAction — plus hreflang alternates.",
    layman:
      "Runs a full English news desk on a CMS the editors already know, while the technical SEO and ad plumbing is handled underneath them.",
    verified: [
      "Response header `Server: nginx`",
      "71 references to `wp-content` in the served HTML — WordPress origin",
      "Google Tag Manager / gtag GA4 loader present",
      "Google AdSense (`adsbygoogle`) present",
      "JSON-LD includes NewsArticle, NewsMediaOrganization, CollectionPage, ItemList, ListItem, ImageObject, ContactPoint, SearchAction",
      "2 `hreflang` alternate declarations",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
    ],
    stack: ["WordPress", "nginx", "GA4 / Tag Manager", "Google AdSense", "JSON-LD / Schema.org"],
    services: ["Web development", "SEO engineering"],
    related: ["readynews", "indianews16", "carbonmedia"],
    serviceSlug: "seo-performance",
    problem:
      "A newsroom that already lives in WordPress will not migrate off it — so the engineering has to happen around the CMS, not instead of it.",
    approach: [
      "Keep the WordPress editorial workflow intact and do the technical work in the theme and head: structured data, hreflang, canonical discipline.",
      "Emit a NewsArticle graph per story and a CollectionPage/ItemList graph per section so Google can distinguish an article from an index.",
      "Wire GA4 through Tag Manager so measurement changes do not require a code deploy.",
      "Place AdSense inventory in the template rather than inline in article bodies, keeping layout shift bounded.",
    ],
    outcome: [
      "Editors publish exactly as before; every story ships with news structured data attached.",
      "Analytics and ad configuration are changeable without a developer.",
    ],
    accentFrom: "oklch(0.7 0.16 165)",
    accentTo: "oklch(0.72 0.15 220)",
  },
  {
    slug: "readynews",
    name: "ReadyNews",
    url: "https://readynews.in/",
    displayUrl: "readynews.in",
    category: "News & Publishing",
    year: "2026",
    summary: "Lean custom-built news portal — no CMS bloat, versioned assets, full news schema.",
    engineering:
      "A purpose-built PHP news portal (single `/assets/js/app.js` bundle with a cache-busting version query, no CMS footprint in the markup) behind Cloudflare, carrying a complete news structured-data graph — NewsMediaOrganization, CollectionPage, ItemList, BreadcrumbList, ImageObject, SearchAction — with GA4 and AdSense wired in.",
    layman:
      "A news site that loads fast on a cheap phone because there is no plugin stack sitting between the reader and the story.",
    verified: [
      "Single application bundle `/assets/js/app.js?v=…` with version-pinned cache busting",
      "No CMS signature in the served HTML (no wp-content, no generator meta)",
      "Cloudflare references in the document",
      "GA4 property `G-BF3RMPWB9W` via gtag",
      "Google AdSense present (`ca-pub-4835452789612`)",
      "JSON-LD includes NewsMediaOrganization, CollectionPage, ItemList, ListItem, BreadcrumbList, ImageObject, SearchAction",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
    ],
    stack: ["PHP", "Custom CMS", "Cloudflare", "GA4", "Google AdSense", "JSON-LD / Schema.org"],
    services: ["Web development", "SEO engineering"],
    related: ["indianews16", "carbonmedia", "newslive24"],
    serviceSlug: "web-development",
    problem:
      "Off-the-shelf news themes ship dozens of plugins a publisher never uses, and every one of them is weight on the reader's connection and surface area for an attacker.",
    approach: [
      "Build the publishing surface directly instead of adopting a theme, so the shipped JavaScript is one reviewed bundle.",
      "Version every asset URL so a deploy invalidates cache deterministically instead of relying on a purge.",
      "Serve behind Cloudflare so static assets and cacheable pages never touch the origin.",
      "Emit BreadcrumbList and ItemList alongside NewsMediaOrganization so section hierarchy is explicit to crawlers.",
    ],
    outcome: [
      "One reviewed JavaScript bundle instead of a plugin dependency tree.",
      "Deterministic cache invalidation on every release.",
    ],
    accentFrom: "oklch(0.75 0.15 90)",
    accentTo: "oklch(0.7 0.16 165)",
  },
  {
    slug: "indianews16",
    name: "IndiaNews16",
    url: "https://indianews16.com/",
    displayUrl: "indianews16.com",
    category: "News & Publishing",
    year: "2026",
    summary: "Highest-density edition of the custom news platform — 90 crawlable links from the homepage.",
    engineering:
      "Same custom PHP news engine as ReadyNews, deployed behind Cloudflare with dated build tags on its assets (`app.js?v=20260705atlas1`), serving a dense homepage — 90 internal links and 28 images in the initial HTML — under a NewsMediaOrganization / CollectionPage / BreadcrumbList / ItemList structured-data graph.",
    layman:
      "Puts a large amount of the day's news one click from the front page, without making the front page slow.",
    verified: [
      "Application bundle `/assets/js/app.js?v=20260705atlas1` — dated release tagging",
      "90 anchor elements and 28 images in the server-rendered homepage HTML",
      "Cloudflare references in the document",
      "JSON-LD includes NewsMediaOrganization, CollectionPage, ItemList, ListItem, BreadcrumbList, ImageObject, SearchAction",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
    ],
    stack: ["PHP", "Custom CMS", "Cloudflare", "JSON-LD / Schema.org"],
    services: ["Web development", "SEO engineering", "DevOps & CI/CD"],
    related: ["readynews", "carbonmedia", "himachal-kesari"],
    serviceSlug: "seo-performance",
    problem:
      "A news homepage is an internal-linking instrument. Too few links and deep sections never get crawled; too many rendered badly and the page stops being usable on mobile.",
    approach: [
      "Render the full link graph server-side so crawl depth to any section is one hop.",
      "Ship dated release identifiers on assets so any production issue maps to a known build.",
      "Declare section hierarchy through BreadcrumbList rather than leaving it implicit in URL structure.",
    ],
    outcome: [
      "Every section is one hop from the homepage for both readers and crawlers.",
      "Any reported issue is traceable to a dated build.",
    ],
    accentFrom: "oklch(0.72 0.15 220)",
    accentTo: "oklch(0.63 0.16 45)",
  },
  {
    slug: "carbonmedia",
    name: "CarbonMedia",
    url: "https://carbonmedia.in/",
    displayUrl: "carbonmedia.in",
    category: "News & Publishing",
    year: "2026",
    summary: "Multi-vertical news brand on a current PHP 8.2 runtime with reader-facing forms.",
    engineering:
      "Runs on PHP 8.2.30 (declared in `x-powered-by`) — a maintained, current runtime rather than a legacy 7.x install — serving a custom news application with three reader-facing forms, GA4 property `G-BVNH0Z14GM` and AdSense inventory, with WebSite + SearchAction JSON-LD.",
    layman:
      "Covers news, business, tech, sport and politics under one brand, and lets readers search and subscribe without leaving the page.",
    verified: [
      "Response header `x-powered-by: PHP/8.2.30`",
      "Application bundle `/assets/js/app.js?v=20260719b`",
      "3 `<form>` elements in the served homepage",
      "GA4 property `G-BVNH0Z14GM` via Google Tag Manager",
      "Google AdSense present (`ca-pub-4835452789612`)",
      "JSON-LD includes WebSite and SearchAction",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
    ],
    stack: ["PHP 8.2", "Custom CMS", "GA4", "Google AdSense", "JSON-LD / Schema.org"],
    services: ["Web development", "SEO engineering", "Security & compliance"],
    related: ["readynews", "indianews16", "newslive24"],
    serviceSlug: "security-compliance",
    problem:
      "A great many Indian publishing sites are still running end-of-life PHP 7. That is not a performance problem, it is an unpatched-runtime problem.",
    approach: [
      "Run the application on a supported PHP 8.2 runtime that still receives security patches.",
      "Keep reader-facing forms — search, subscribe — server-validated rather than trusting client-side checks.",
      "Declare a SearchAction so the brand can surface a sitelinks search box in results.",
    ],
    outcome: [
      "The runtime under the site is one that still receives security fixes.",
      "Reader interaction happens on-page instead of bouncing to third-party forms.",
    ],
    accentFrom: "oklch(0.65 0.14 300)",
    accentTo: "oklch(0.72 0.15 220)",
  },
  {
    slug: "fitwithnash",
    name: "FitWithNash — Consultation",
    url: "https://consult.fitwithnash.com/",
    displayUrl: "consult.fitwithnash.com",
    category: "Health & Coaching",
    year: "2026",
    summary: "A one-page consultation funnel for a private dietitian, built static and deployed to Vercel.",
    engineering:
      "Astro site (public source at github.com/codehippies11/fitwithnash) deployed to Vercel's edge network — the served page is essentially all content and almost no asset weight, and it carries the deepest structured-data graph in the portfolio: Person, ProfessionalService, Service, OfferCatalog, Offer, EducationalOccupationalCredential, Audience and a full FAQPage.",
    layman:
      "Turns a nutritionist's practice into a single page that answers every question a prospective client has, then books them.",
    verified: [
      "Response header `server: Vercel`",
      "Public repository `codehippies11/fitwithnash` — primary language Astro",
      "One `<h1>`: \"Build a stronger body\" — correct single-h1 document outline",
      "JSON-LD includes Person, ProfessionalService, Service, OfferCatalog, Offer, EducationalOccupationalCredential, Audience, Country, Place, FAQPage, Question, Answer, WebSite, WebPage",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
      "A single image request in the initial document — content-first, near-zero media weight",
    ],
    stack: ["Astro", "Vercel", "Static generation", "JSON-LD / Schema.org", "FAQ schema"],
    services: ["Web development", "SEO engineering"],
    related: ["coremediasolutions", "influenceaxis", "nantinbaba"],
    serviceSlug: "seo-performance",
    problem:
      "An independent practitioner does not need a nine-page website. They need one page that survives being the only thing a stranger reads before deciding to pay.",
    approach: [
      "Build in Astro and ship static HTML, so there is no framework runtime between the reader and the offer.",
      "Model the practice in structured data properly — Person for the practitioner, ProfessionalService for the practice, OfferCatalog for the packages, EducationalOccupationalCredential for qualifications.",
      "Answer objections on-page with an FAQPage graph, so the same answers can surface directly in search results.",
      "Deploy to Vercel so TLS, the CDN and preview builds are handled without a server to maintain.",
    ],
    outcome: [
      "Credentials, services and pricing are machine-readable, not just human-readable.",
      "FAQ answers are eligible to appear directly in search results.",
      "No server to patch, no CMS to update.",
    ],
    accentFrom: "oklch(0.78 0.15 145)",
    accentTo: "oklch(0.7 0.16 165)",
  },
  {
    slug: "coremediasolutions",
    name: "Core Media Solutions",
    url: "https://coremediasolutions.in/",
    displayUrl: "coremediasolutions.in",
    category: "Marketing & Agency",
    year: "2026",
    summary: "Full agency site with a service catalogue and FAQ modelled in structured data.",
    engineering:
      "Content-rich agency site (35 images, an enquiry form, a full section outline) whose entire commercial offer is mirrored in JSON-LD — Service, OfferCatalog, Offer, ContactPoint, PostalAddress, ImageObject and an FAQPage graph — so the service list is legible to search engines, not just to visitors.",
    layman:
      "Explains everything the agency sells, answers the usual questions up front, and captures enquiries on the same page.",
    verified: [
      "35 `<img>` elements and 1 `<form>` in the served HTML",
      "JSON-LD includes Service, OfferCatalog, Offer, ContactPoint, PostalAddress, ImageObject, FAQPage, Question, Answer, WebPage, WebSite",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
      "Served from Hostinger's CDN (`server: hcdn`)",
    ],
    stack: ["Static site", "Hostinger CDN", "JSON-LD / Schema.org", "FAQ schema", "Lead capture form"],
    services: ["Web development", "SEO engineering"],
    related: ["influenceaxis", "belongdigital", "scalewell"],
    serviceSlug: "seo-performance",
    problem:
      "Agency websites list services as decorative headings. Search engines cannot tell a service catalogue from a paragraph unless you say so explicitly.",
    approach: [
      "Model every offering as a Service inside an OfferCatalog so the catalogue is structured data, not styling.",
      "Attach an FAQPage graph to the objections the sales conversation always hits.",
      "Declare ContactPoint and PostalAddress so local and brand search have something authoritative to resolve against.",
      "Keep the enquiry form on-page rather than routing prospects to a third-party form.",
    ],
    outcome: [
      "The service catalogue is machine-readable and eligible for rich results.",
      "The FAQ does double duty: it closes objections and it targets question queries.",
    ],
    accentFrom: "oklch(0.63 0.16 45)",
    accentTo: "oklch(0.75 0.15 90)",
  },
  {
    slug: "influenceaxis",
    name: "Influence Axis",
    url: "https://influenceaxis.in/",
    displayUrl: "influenceaxis.in",
    category: "Marketing & Agency",
    year: "2026",
    summary: "Next.js brand site for a digital agency, with a clean single-h1 editorial structure.",
    engineering:
      "Next.js application (`x-powered-by: Next.js`, `_next` asset routes) served behind LiteSpeed, with an Organization + WebSite + PostalAddress JSON-LD identity and a disciplined document outline — one `<h1>` carrying the positioning statement, section `<h2>`s beneath it.",
    layman:
      "A brand site that reads like the agency it is selling — sharp, fast, and unmistakably positioned in the first line.",
    verified: [
      "Response header `x-powered-by: Next.js`",
      "Response header `server: LiteSpeed`",
      "`_next` asset routes present in the document",
      "Single `<h1>`: \"We build digital brands that look sharper, move faster…\"",
      "JSON-LD includes Organization, WebSite, PostalAddress",
      "`/robots.txt` and `/sitemap.xml` both return HTTP 200",
    ],
    stack: ["Next.js", "React", "LiteSpeed", "JSON-LD / Schema.org"],
    services: ["Web development", "SEO engineering"],
    related: ["coremediasolutions", "scalewell", "belongdigital"],
    serviceSlug: "web-development",
    problem:
      "An agency's own website is the only work sample a prospect judges before they will look at any other. It cannot be the slowest thing they sell.",
    approach: [
      "Build on Next.js so the positioning copy is server-rendered and present for crawlers on first byte.",
      "Keep one h1 per page and a strict heading hierarchy under it — the document outline is the SEO structure.",
      "Declare Organization and PostalAddress so brand search resolves to the right entity.",
    ],
    outcome: [
      "The positioning statement is the first thing both a reader and a crawler see.",
      "Brand identity is declared in structured data, not left to inference.",
    ],
    accentFrom: "oklch(0.65 0.14 300)",
    accentTo: "oklch(0.63 0.16 45)",
  },
  {
    slug: "scalewell",
    name: "ScaleWell Digital Solutions",
    url: "https://scalewelldigitalsolutions.in/",
    displayUrl: "scalewelldigitalsolutions.in",
    category: "Marketing & Agency",
    year: "2026",
    summary: "Vite + React single-page app with a deliberately minimal 1 KB HTML shell.",
    engineering:
      "Vite-built React SPA — an ES-module entry at `/assets/index-<hash>.js` with content-hashed CSS beside it — shipping a roughly 1 KB HTML shell, Tailwind design tokens (`bg-primary`, `text-secondary`, `font-body`) and preconnected Google Fonts (Space Grotesk / Sora).",
    layman:
      "A fast, app-like marketing site where every interaction happens instantly without a page reload.",
    verified: [
      "ES-module entry `<script type=\"module\" crossorigin src=\"/assets/index-DS0bXq7u.js\">` — Vite content-hashed build output",
      "Content-hashed stylesheet `/assets/index-BVwgp9nJ.css`",
      "HTML shell is ~1 KB with a single `<div id=\"root\">` mount point",
      "Tailwind semantic token classes on `<body>`: `bg-primary text-secondary font-body`",
      "`preconnect` to fonts.googleapis.com and fonts.gstatic.com; Space Grotesk + Sora with `display=swap`",
      "Served from Hostinger's CDN (`server: hcdn`)",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "Hostinger CDN", "Client-side routing"],
    services: ["Web development"],
    related: ["belongdigital", "influenceaxis", "coremediasolutions"],
    serviceSlug: "web-development",
    problem:
      "A brochure site with a handful of routes does not need a server runtime — but it does need its fonts and its bundle to stop blocking the first paint.",
    approach: [
      "Build with Vite so the production bundle is content-hashed and cacheable indefinitely.",
      "Preconnect to the font origins and load faces with `display=swap` so text is never invisible while fonts fetch.",
      "Express the design system as Tailwind semantic tokens rather than hard-coded colour values, so a rebrand is a token change.",
    ],
    outcome: [
      "Immutable, content-hashed assets — cache once, never revalidate.",
      "Design system lives in tokens, so visual changes do not require touching components.",
    ],
    accentFrom: "oklch(0.78 0.15 145)",
    accentTo: "oklch(0.72 0.15 220)",
  },
  {
    slug: "belongdigital",
    name: "Belong Digital Solutions",
    url: "https://belongdigitalsolutions.in/",
    displayUrl: "belongdigitalsolutions.in",
    category: "Marketing & Agency",
    year: "2026",
    summary: "React SPA with a complete social-sharing and theming metadata layer.",
    engineering:
      "Vite + React single-page app whose document head is fully specified for distribution — Open Graph title/description/type/url/image, a Twitter summary-large-image card, `theme-color` for mobile browser chrome, plus author and keyword metadata — before a single line of application JavaScript executes.",
    layman:
      "Every time someone shares the site in a message or on social, it renders as a proper branded preview card instead of a bare link.",
    verified: [
      "Open Graph tags: og:title, og:description, og:type, og:url, og:image",
      "`twitter:card` set to summary_large_image",
      "`<meta name=\"theme-color\" content=\"#0b0b0b\">` — mobile browser chrome theming",
      "Author and keywords metadata declared",
      "Vite/React SPA document shell",
      "Served from Hostinger's CDN (`server: hcdn`)",
    ],
    stack: ["React", "Vite", "Open Graph", "Twitter Cards", "Hostinger CDN"],
    services: ["Web development", "SEO engineering"],
    related: ["scalewell", "coremediasolutions", "influenceaxis"],
    serviceSlug: "web-development",
    problem:
      "A single-page app renders its content in JavaScript — which means unless the head is written properly, every share on WhatsApp, LinkedIn or X is a naked URL.",
    approach: [
      "Specify the full Open Graph and Twitter card set statically in the document head, where crawlers and messaging previews actually read it.",
      "Declare `theme-color` so mobile browser chrome matches the brand instead of defaulting to grey.",
      "Keep the shell metadata independent of the client bundle, so a JavaScript failure still leaves a shareable, described page.",
    ],
    outcome: [
      "Shared links render as branded preview cards across social and messaging.",
      "The page describes itself correctly even if the app bundle never loads.",
    ],
    accentFrom: "oklch(0.7 0.16 165)",
    accentTo: "oklch(0.65 0.14 300)",
  },
  {
    slug: "nantinbaba",
    name: "Nantin Baba Ashram",
    url: "https://www.nantinbaba.org/",
    displayUrl: "nantinbaba.org",
    category: "Community & Non-profit",
    year: "2025",
    summary: "A deliberately tiny static Hindi site for an ashram — 21 KB, no build step, no maintenance.",
    engineering:
      "Static HTML deployed to Vercel, built on Bootstrap 5 with jQuery slim and Popper — the whole document is roughly 21 KB, has no application framework and no build pipeline, so it will still render correctly with no intervention years from now.",
    layman:
      "Gives the ashram a permanent, free-to-run web presence that loads instantly even on a weak rural connection.",
    verified: [
      "Response header `server: Vercel`",
      "Bootstrap 5, jQuery slim and Popper loaded from local `node_modules` paths",
      "Total served document ≈ 21 KB — the lightest page in the portfolio",
      "Static HTML with no framework runtime and no CMS signature",
      "Hindi-language content with locally hosted imagery",
    ],
    stack: ["Static HTML", "Bootstrap 5", "jQuery", "Vercel"],
    services: ["Web development"],
    related: ["fitwithnash", "uttaranchal-kesari", "scalewell"],
    serviceSlug: "web-development",
    problem:
      "A community organisation cannot carry an annual maintenance contract, and it cannot afford a site that breaks the first time a framework has a breaking release.",
    approach: [
      "Choose boring, permanent technology deliberately — static HTML and a stable CSS framework, no build step to rot.",
      "Keep the payload under a few tens of kilobytes so the site is usable on a weak mobile connection in the hills.",
      "Deploy to a platform with a free tier and automatic TLS so there is no renewal to forget.",
    ],
    outcome: [
      "No dependency upgrade treadmill and no recurring hosting bill.",
      "Loads on a poor connection, which is the actual constraint for this audience.",
    ],
    accentFrom: "oklch(0.75 0.15 90)",
    accentTo: "oklch(0.78 0.15 145)",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getRelated(slug: string): CaseStudy[] {
  const study = getCaseStudy(slug);
  if (!study) return [];
  return study.related
    .map((s) => getCaseStudy(s))
    .filter((s): s is CaseStudy => Boolean(s));
}

export const featuredCaseStudies = ["uttaranchal-kesari", "fitwithnash", "newslive24"]
  .map((s) => getCaseStudy(s))
  .filter((s): s is CaseStudy => Boolean(s));
