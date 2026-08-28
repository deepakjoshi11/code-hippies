<div align="center">

<img src="./public/logo-mark.svg" alt="Code Hippies" width="72" height="72" />

# Code Hippies

**Deepak Joshi** — full-stack, mobile and AI/LLM engineer
*ex-Deloitte USI · Founder, [Dharmarthlabs](https://dharmarthlabs.com)*

Portfolio and lead-generation platform.
The site is the work sample: everything it argues software should do, it does to itself.

[![CI](https://github.com/deepakjoshi11/code-hippies/actions/workflows/ci.yml/badge.svg)](https://github.com/deepakjoshi11/code-hippies/actions/workflows/ci.yml)
[![Search distribution](https://github.com/deepakjoshi11/code-hippies/actions/workflows/distribution.yml/badge.svg)](https://github.com/deepakjoshi11/code-hippies/actions/workflows/distribution.yml)

`Lighthouse 100/100/100/100` · `WCAG 2.1 AA — 0 violations` · `CLS 0.000` · `300 tests` · `0 vulnerabilities`

</div>

---

## Why this repository is worth reading

Most portfolios assert competence. This one is falsifiable.

Every technology claim about the 13 client sites was **read off the live HTTP
response** — headers, served HTML, embedded JSON-LD — and the verification
command is documented so anyone can re-run it. Nothing is inferred, and where
a signal could not be observed it is simply absent.

There are **no invented testimonials**. The array is empty, with a comment
explaining why, and the proof section renders verifiable engineering evidence
instead. There is **no invented phone number, domain or booking link** —
unconfigured channels hide themselves rather than shipping a dead link.

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router, RSC | Content in the initial HTML — the single largest SEO decision |
| Language | TypeScript strict, `noUncheckedIndexedAccess` | Index access is a real source of production bugs |
| Styling | Tailwind CSS v4, design tokens | A rebrand is a token change, not a component sweep |
| Motion | IntersectionObserver + CSS, Lenis on idle | An animation runtime on every page cost ~150ms TBT |
| Content | MDX with frontmatter | The blog is content, not hardcoded JSX |
| Forms | react-hook-form + Zod | One schema, enforced again server-side |
| AI | Local retrieval index + Anthropic API | Works with no key; never ungrounded |
| CI/CD | GitHub Actions → Lighthouse CI → Vercel | A budget nobody checks is a number that drifts |

---

## What's in here

**13 case studies** — one per live production site, each pairing an engineering
layer with a plain-language layer, listing the exact signals observed on the
live response.

**5 service pages** — each targeting one realistic long-tail phrase, with its
own FAQ and `Service` structured data.

**A 50-question FAQ** across nine categories, emitted as `FAQPage` JSON-LD and
loaded into the assistant as a browsable, searchable set.

**A retrieval-grounded AI assistant** with a three-layer pipeline — curated
answer → retrieval → refusal — so common questions are answered verbatim and
anything outside the knowledge base is declined rather than guessed at.

**A multi-channel contact dock** — WhatsApp, Instagram, Messenger, Telegram,
email, phone, Cal.com, plus Fiverr/Upwork/Freelancer/Toptal for buyers who
want escrow. Every channel env-driven and hidden until configured.

**An audience switcher** writing the same claims three ways: for a
non-technical buyer, an engineer assessing judgement, and someone weighing this
against headcount.

**A partnership funnel** routing work that is genuinely bigger than one
engineer to Dharmarthlabs — including a *"when you should stay here instead"*
block, because a wrong referral costs more trust than it earns.

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

## CI/CD

Every push runs: install → knowledge base → lint → typecheck → 300 tests →
build → `npm audit` → client-bundle secret scan → Lighthouse budgets on desktop
and mobile. `main` deploys to Vercel.

Budget: all four Lighthouse categories ≥ 90, LCP < 2.5s, CLS < 0.1, TBT < 200ms.
Three runs per URL — a single run on a shared runner is noisy enough to fail a
good build, and a flaky gate gets disabled within a month.

`distribution.yml` submits every URL to IndexNow (Bing, Yandex, Seznam, Naver)
every 72 hours, free and forever. It skips cleanly when its secrets are absent.

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

## Licence

All rights reserved. © Code Hippies / Deepak Joshi.
