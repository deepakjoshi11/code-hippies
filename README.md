<div align="center">

<img src="./public/logo-mark.svg" alt="Code Hippies logo — Deepak Joshi full-stack and AI engineering studio" width="76" height="76" />

# Code Hippies — Deepak Joshi

### Full-Stack, Mobile & AI/LLM Engineer · India · Available for hire

**[codehippies.com](https://codehippies.com)** &nbsp;·&nbsp; ex-Deloitte USI &nbsp;·&nbsp; Founder, [Dharmarthlabs](https://dharmarthlabs.com)

[![CI](https://github.com/deepakjoshi11/code-hippies/actions/workflows/ci.yml/badge.svg)](https://github.com/deepakjoshi11/code-hippies/actions/workflows/ci.yml)
[![Search distribution](https://github.com/deepakjoshi11/code-hippies/actions/workflows/distribution.yml/badge.svg)](https://github.com/deepakjoshi11/code-hippies/actions/workflows/distribution.yml)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Lighthouse 100](https://img.shields.io/badge/Lighthouse-100%2F100%2F100%2F100-0cce6b)](https://developer.chrome.com/docs/lighthouse)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG%202.1%20AA-0%20violations-0cce6b)](https://www.w3.org/WAI/WCAG21/quickref/)

</div>

---

**Code Hippies** is the engineering studio of **Deepak Joshi** — a senior
full-stack, mobile and AI/LLM engineer based in India, building production
software for startups, agencies and enterprise teams worldwide. This repository
is the source code of [codehippies.com](https://codehippies.com), the portfolio
and lead-generation platform for that practice.

Hire for: **React & Next.js development**, **iOS and Android apps**,
**retrieval-grounded AI/LLM systems**, **technical SEO and Core Web Vitals**,
and **OWASP application-security review**.

> The site is the work sample. Everything it argues software should do, it does
> to itself — and every claim in it is independently checkable.

---

## Why this repository is worth reading

Most portfolios assert competence. This one is falsifiable.

Every technology claim about the **13 client sites** was **read off the
live HTTP response** — headers, served HTML, embedded JSON-LD — and the
verification command is documented so anyone can re-run it. Nothing is
inferred; where a signal could not be observed, it is simply absent.

There are **no invented testimonials**. The array is empty, with a comment
explaining why, and the proof section renders verifiable engineering evidence
instead. There is **no invented phone number, domain or booking link** —
unconfigured channels hide themselves rather than shipping a dead link.

---

## Live production work

Thirteen sites shipped to production, each with a case study pairing the
engineering detail with a plain-language explanation of what it does for the
business. Twelve are reachable right now — the thirteenth was taken offline
after handover and is marked as such rather than quietly removed.

| Project | Sector | Stack signals verified on the live response |
| --- | --- | --- |
| [Uttaranchal Kesari](https://www.uttaranchalkesari.com) | Hindi news, Uttarakhand | Next.js · Caddy · NewsMediaOrganization JSON-LD |
| [Himachal Kesari](https://www.himachalkesari.com) | Hindi news, Himachal | Next.js · Cloudflare · multi-tenant platform |
| [Haryana Kesari](https://www.haryanakesari.com) | Hindi news, Haryana | Next.js · Caddy · search-ready before launch |
| [NewsLive24](https://www.newslive24.in) | English news, India | WordPress · nginx · NewsArticle · GA4 · AdSense |
| [ReadyNews](https://readynews.in) | News portal | Custom PHP · Cloudflare · versioned assets |
| [IndiaNews16](https://indianews16.com) | News portal | Custom PHP · 90 crawlable links from the homepage |
| [CarbonMedia](https://carbonmedia.in) | Multi-vertical news | PHP 8.2 · supported runtime as a security control |
| [FitWithNash](https://consult.fitwithnash.com) | Health coaching | Astro · Vercel · Person/Service/FAQPage schema |
| [Core Media Solutions](https://coremediasolutions.in) | Agency | Service + OfferCatalog + FAQPage structured data |
| [Influence Axis](https://influenceaxis.in) | Agency | Next.js · LiteSpeed · single-h1 outline |
| [ScaleWell](https://scalewelldigitalsolutions.in) | Agency | React · Vite · Tailwind · 1 KB HTML shell |
| [Belong Digital](https://belongdigitalsolutions.in) | Agency | React · Vite · full Open Graph / Twitter cards |
| Nantin Baba Ashram *(offline)* | Non-profit | 21 KB static HTML · no build step · no maintenance |

Six different stacks, on purpose. An ashram that cannot carry a maintenance
contract gets static HTML that still works in a decade. A newsroom that will
not leave WordPress gets engineering done *around* the CMS. Regional editions
that need stories crawlable in seconds get server-rendered Next.js. **The
technology follows the constraint, not the preference.**

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router, React Server Components | Content in the initial HTML — the single largest SEO decision |
| Language | TypeScript strict, `noUncheckedIndexedAccess` | Index access is a real source of production bugs |
| Styling | Tailwind CSS v4, design tokens | A rebrand is a token change, not a component sweep |
| Motion | IntersectionObserver + CSS, Lenis on idle | An animation runtime on every page cost ~150ms TBT |
| Content | MDX with frontmatter | The blog is content, not hardcoded JSX |
| Forms | react-hook-form + Zod | One schema, enforced again server-side |
| AI | Local retrieval index + Anthropic API | Works with no key; never ungrounded |
| Analytics | Consent-gated, first-party | No ad networks, no data sold, no IP stored |
| CI/CD | GitHub Actions → Lighthouse CI → Vercel | A budget nobody checks is a number that drifts |

Also worked with: **Vue/Nuxt**, **Astro**, **Node/NestJS**, **Python
FastAPI/Django**, **Go**, **PHP 8.2+**, **Swift/SwiftUI**, **Kotlin**,
**React Native**, **Flutter**, **PostgreSQL**, **Redis**, **Docker**.

---

## Features

**13 case studies** — engineering layer + plain-language layer, listing the
exact signals observed on each live response.

**5 service pages** — each targeting one realistic long-tail search phrase,
with its own FAQ and `Service` structured data.

**A 50-question FAQ** across nine categories, emitted as `FAQPage` JSON-LD and
loaded into the AI assistant as a browsable, searchable set.

**A retrieval-grounded AI assistant** with a three-layer pipeline — curated
answer → retrieval → refusal — so common questions are answered verbatim and
anything outside the knowledge base is *declined rather than guessed at*.

**A multi-channel contact dock** — WhatsApp, Instagram, Messenger, Telegram,
email, phone, Cal.com, plus Fiverr/Upwork/Freelancer/Toptal for buyers who want
escrow protection. Every channel env-driven and hidden until configured.

**An audience switcher** writing the same claims three ways: for a
non-technical buyer, an engineer assessing judgement, and someone weighing this
against headcount.

**A partnership funnel** routing work genuinely bigger than one engineer to
Dharmarthlabs — including a *"when you should stay here instead"* block,
because a wrong referral costs more trust than it earns.

---

## Engineering standards

| Metric | Result |
| --- | --- |
| Lighthouse desktop | **100 / 100 / 100 / 100** |
| Lighthouse mobile | **≥ 90** all four categories |
| Cumulative Layout Shift | **0.000** on every route |
| WCAG 2.1 A/AA (axe-core) | **0 violations**, 17 pages × 2 breakpoints |
| Tests | **300 passing** across 7 suites |
| Dependency vulnerabilities | **0** |
| Responsive | 360 / 390 / 768 / 1024 / 1440px, no overflow |

Enforced in CI on every push — a performance budget that nobody checks is a
number that drifts.

---

## Architecture

```
src/
├── app/                    App Router. Server Components by default.
│   ├── api/                chat · lead · csrf · telemetry · cms · indexnow
│   └── og/                 Per-page Open Graph image generation
├── components/
│   ├── chat/               AI assistant — launcher split from panel
│   ├── consent/            Consent banner, controls, telemetry
│   ├── forms/              Multi-step lead form
│   ├── layout/             Header, footer, contact dock, smooth scroll
│   ├── sections/           Composed page sections
│   └── ui/                 Primitives
├── content/blog/           MDX articles
├── data/                   Typed source of truth — see below
└── lib/
    ├── analytics/          Consent model, event contract, sink
    ├── cms/                HMAC signing, control surface
    ├── distribution/       IndexNow, sitemap pings
    ├── rag/                Chunking, retrieval, answer, gap log
    ├── scoring/            Lead triage model
    └── security/           CSRF, rate limiting
knowledge-base/             BUILD OUTPUT — never hand-edit
```

**`src/data` is the single source of truth.** It feeds the pages, the JSON-LD,
the generated knowledge base and the assistant's browse panel — which is what
makes it impossible for them to drift apart.

---

## Non-negotiable rules

**Never claim a technical fact you have not observed.** Before adding a
`verified` signal, run the check in [`NOTES.md`](./NOTES.md) and paste what you
actually saw.

**`"use client"` goes on the smallest component that needs it** — never on a
page file. If content must be in the HTML for a crawler, the directive belongs
further down the tree.

**Validate on the server.** Every route handler re-parses with the same Zod
schema the client used. The client is not a trust boundary.

**Nothing sensitive behind `NEXT_PUBLIC_`.** CI greps the built client bundle
for secret-shaped strings and fails on a hit.

---

## Quick start

```bash
git clone https://github.com/deepakjoshi11/code-hippies.git
cd code-hippies
npm ci
npm run kb:build        # generate the assistant's knowledge base
npm run dev
```

Nothing needs configuring to run. The assistant answers extractively without an
API key, the contact form logs briefs server-side, and unset channels hide.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | 300 tests — content, SEO, security, RAG evals, scoring |
| `npm run lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `npm run kb:build` | Regenerate knowledge base from `src/data` |
| `npm run audit:quality` | Links, metadata, axe-core WCAG, responsive |
| `npm run audit:ci` | `npm audit`, production deps, fails on high |
| `npm run train:leads` | Fit the lead model on labelled outcomes |

---

## Testing

Seven suites, 300 tests:

- **`content`** — data integrity, internal links resolve, every case study
  pairs engineering with plain language
- **`seo`** — JSON-LD validity, `@id` linking, canonicals, script-tag escaping
- **`security`** — schema validation, honeypot, rate limits, constant-time CSRF
- **`rag-eval`** — retrieval harness where **half the cases must be refused**
- **`faq-bot`** — all 50 questions and 63 aliases resolve to their own entry
- **`integration`** — channels, CMS signing and replay, telemetry contract
- **`lead-score`** — monotonicity, explainability, model integrity

The refusal cases matter most. Adding knowledge-base content can quietly pull a
should-refuse question above the relevance floor; this is what catches it.

---

## Deployment

Deployed on **Vercel**, auto-updating from `main` on every push. Preview
deployments on every branch and pull request.

Every push runs: install → knowledge base → lint → typecheck → 300 tests →
build → `npm audit` → client-bundle secret scan → Lighthouse budgets on desktop
and mobile.

`distribution.yml` submits every URL to **IndexNow** (Bing, Yandex, Seznam,
Naver) every 72 hours — free, no account, forever. It skips cleanly when its
secrets are absent.

Full setup in **[`DEPLOY.md`](./DEPLOY.md)**.

---

## Documentation

| Document | Contents |
| --- | --- |
| [`DEPLOY.md`](./DEPLOY.md) | Vercel, DNS, environment variables, indexing |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Architecture, conventions, adding content |
| [`NOTES.md`](./NOTES.md) | What is placeholder, what stays manual, known limits |
| [`docs/CMS-INTEGRATION.md`](./docs/CMS-INTEGRATION.md) | Dharmarthlabs CMS contract |
| [`docs/WIREFRAMES.md`](./docs/WIREFRAMES.md) | Layout, breakpoints, responsive rules |
| [`public/BRAND-ASSETS.md`](./public/BRAND-ASSETS.md) | Dropping in your logo and favicon |
| [`.env.example`](./.env.example) | Every variable, annotated. All optional. |
| [`SECURITY.md`](./SECURITY.md) | Reporting a vulnerability, scope, controls already in place |
| [`CHANGELOG.md`](./CHANGELOG.md) | Release history and known limitations |
| [`CLAUDE.md`](./CLAUDE.md) | Conventions for AI-assisted sessions in this repo |

---

## Privacy

Consent is per-category with a reject button of equal visual weight, and
enforced server-side as well as client-side — a tampered client cannot widen
what is stored.

**Never collected:** IP address (used in memory to rate-limit, then discarded),
precise location, cross-site identifiers, or anything shared with an ad network
or sold. Country from existing edge headers is the maximum granularity, and
only with consent.

This gathers less than a covert setup would. It also survives a GDPR or DPDP
complaint, and it is the version an enterprise prospect can read without
concern — which is worth more than the extra rows.

---

## Hire Deepak Joshi

Available for **fixed-scope projects**, **monthly retainers** and **staff
augmentation** — remote from India, working with clients across India, the
Gulf, the UK and North America.

**[Start a project →](https://codehippies.com/contact)** &nbsp;·&nbsp;
[Services](https://codehippies.com/services) &nbsp;·&nbsp;
[Case studies](https://codehippies.com/work) &nbsp;·&nbsp;
[For enterprise teams](https://codehippies.com/enterprise) &nbsp;·&nbsp;
[Ways to hire](https://codehippies.com/hire) &nbsp;·&nbsp;
[FAQ](https://codehippies.com/faq)

Prefer a platform that holds the money in escrow until you approve the work?
That is a reasonable thing to want on a first engagement — the marketplace
options are on [codehippies.com/hire](https://codehippies.com/hire).

<div align="center">

**[codehippies.com](https://codehippies.com)**

</div>

---

## Licence

**All rights reserved** — see [`LICENSE`](./LICENSE). This repository is public
so the claims on codehippies.com can be verified, not so it can be reused.

Reading, cloning, running it locally and quoting excerpts with attribution are
all fine. Redeploying it as your own site, or reusing the written content and
brand, is not. Permission is usually given when asked —
[just ask](https://codehippies.com/contact).

© 2026 Deepak Joshi / Code Hippies.
