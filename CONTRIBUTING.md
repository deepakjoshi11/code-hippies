# Contributing

How this repository is built, tested and deployed.

## Local setup

```bash
git clone git@github.com:deepakjoshi11/code-hippies.git
cd code-hippies
npm ci
cp .env.example .env.local     # fill in what you need; nothing is required to run
npm run kb:build               # generate the AI assistant's knowledge base
npm run dev
```

The site runs at http://localhost:3000. Nothing in `.env.local` is required for
local development — the AI assistant falls back to extractive answers without an
API key, and the contact form logs briefs server-side without a webhook.

If a new developer cannot get from clone to a running site in under fifteen
minutes, that is a bug in this document. Please fix it.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals` + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit`, strict mode |
| `npm test` | Vitest: content, SEO, security and retrieval evals |
| `npm run kb:build` | Regenerate `/knowledge-base` from `src/data` |
| `npm run audit:ci` | `npm audit`, failing on high and critical |

## Architecture

```
src/
  app/           App Router routes. Server Components by default.
    api/         Route handlers: chat, lead, csrf. All validated and rate-limited.
    og/          Per-page Open Graph image generation.
  components/
    layout/      Header, footer, WhatsApp button, smooth scroll
    sections/    Composed page sections
    ui/          Primitives (button, card, section, reveal)
    chat/        AI assistant widget
    forms/       Multi-step lead form
  content/blog/  MDX articles — the blog is content, not hardcoded JSX
  data/          Typed source of truth: case studies, services, process, FAQ
  lib/
    rag/         Chunking, retrieval, answer generation, gap logging
    security/    CSRF, rate limiting
    schema.ts    JSON-LD builders
    seo.ts       Metadata API helpers
  proxy.ts       Security headers (Next.js 16 renamed middleware to proxy)
knowledge-base/  BUILD OUTPUT — never hand-edit. Regenerate with npm run kb:build.
```

### Rules that are not negotiable

**Content lives in `src/data` and `src/content`, never in JSX.** Pages read from
typed data. This is what lets the AI assistant's knowledge base be generated
from the same source the pages render — they cannot drift apart.

**Never claim a technical fact you have not observed.** Every entry in the
`verified` array of a case study was read off the live response. Before adding
one, run the verification in `NOTES.md` and paste what you actually saw.

**`"use client"` goes on the smallest component that needs it.** Never on a page
file. If content needs to be in the HTML for a crawler, the directive belongs
further down the tree. See `src/content/blog/what-crawlers-actually-see.mdx`.

**Validate on the server.** Every route handler re-parses with the same zod
schema the client used. The client is not a trust boundary.

**Nothing sensitive behind `NEXT_PUBLIC_`.** That prefix compiles the value into
the browser bundle. CI greps `.next/static` for secret-shaped strings and fails
the build if it finds any.

## Testing

```bash
npm test
```

Four suites:

- **`content.test.ts`** — data integrity: all 13 case studies present, internal
  links resolve, every study pairs an engineering layer with a layman layer,
  every service has a long-tail target and its own FAQ.
- **`seo.test.ts`** — JSON-LD graph validity, `@id` linking between nodes,
  canonical URLs, per-page OG images, script-tag escaping.
- **`security.test.ts`** — schema validation including the honeypot, rate-limit
  windows, constant-time CSRF comparison.
- **`rag-eval.test.ts`** — the retrieval evaluation harness. Half of it is
  questions the assistant **must refuse**. Adding knowledge-base content can
  pull a previously-refused question above the relevance floor; this suite is
  what catches that before a visitor does.

If you add a knowledge-base document, run the tests. If a must-refuse case
starts passing retrieval, either the content genuinely now covers it — in which
case move the question to `MUST_ANSWER` with the document you expect — or the
floor needs re-tuning.

## CI/CD

`.github/workflows/ci.yml` runs on every push:

1. **verify** — install, build knowledge base, lint, typecheck, test, build.
2. **security** — `npm audit` failing on high/critical, then a grep of
   `.next/static` for secret-shaped strings.
3. **lighthouse** — Lighthouse CI against the budget in `lighthouserc.json`:
   Performance, Accessibility, Best Practices and SEO all ≥ 90, LCP < 2.5s,
   CLS < 0.1, TBT < 200ms. Three runs per URL, because a single run on a shared
   runner is noisy enough to fail a good build — and a flaky gate gets disabled
   within a month, which returns you to having no gate at all.
4. **deploy** — on `main` only, after all three pass, to Vercel.

`.github/workflows/preview.yml` deploys a preview on every pull request.

Required repository secrets for deployment: `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
`VERCEL_PROJECT_ID`. Both deploy jobs skip cleanly with a notice when
`VERCEL_TOKEN` is absent, so a fork's CI still passes.

## Commits

Conventional commits:

- `feat:` new capability
- `fix:` bug fix
- `content:` copy, case studies, blog articles
- `chore:` tooling, dependencies, config
- `docs:` documentation
- `refactor:`, `test:`, `perf:` as usual

Work on a branch, open a pull request, let CI go green, then merge.

## Adding things

**A case study.** Verify the live site first (see `NOTES.md`), add an entry to
`src/data/case-studies.ts` with real `verified` signals, point `related` at two
or three existing slugs and `serviceSlug` at a real service. Run
`npm run kb:build && npm test`. The index page, detail page, sitemap, footer and
assistant knowledge base all pick it up automatically.

**A blog post.** Add an MDX file to `src/content/blog/` with complete
frontmatter, including `relatedService` and `relatedCaseStudy` so the internal
linking holds. Run `npm test` — the content suite checks frontmatter and that
those references resolve.

**An FAQ entry.** Add it to `src/data/faq.ts` under an existing category. It
appears on `/faq`, in the `FAQPage` structured data, and in the assistant's
knowledge base after `npm run kb:build`.
