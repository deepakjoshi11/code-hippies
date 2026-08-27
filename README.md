# Code Hippies

Portfolio and lead-generation site for **Deepak Joshi** — full-stack, mobile and
AI/LLM engineer, previously at Deloitte USI, founder of Dharmarthlabs.

The site is the work sample. Everything it claims about how software should be
built, it does to itself: server-rendered and indexable, structured data on
every route, a Core Web Vitals budget enforced in CI, OWASP mitigations on every
route that accepts input, and an AI assistant that refuses to answer rather than
guess.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components) |
| Language | TypeScript, strict, `noUncheckedIndexedAccess` |
| Styling | Tailwind CSS v4 with design tokens |
| Motion | Motion for React, Lenis smooth scroll, both reduced-motion aware |
| Content | MDX with frontmatter — the blog is content, not JSX |
| Forms | react-hook-form + zod, validated again on the server |
| AI | Local retrieval index + Anthropic API for generation |
| Analytics | Vercel Analytics |
| CI/CD | GitHub Actions → Lighthouse CI → Vercel |

## Quick start

```bash
npm ci
npm run kb:build
npm run dev
```

Nothing needs configuring to run locally. See `.env.example` for what switches
on with configuration, and `CONTRIBUTING.md` for architecture and conventions.

## What is in here

- **13 case studies**, one per live production site, each pairing an engineering
  layer with a plain-language layer, and listing the exact signals observed on
  the live response. Every claim is independently checkable — the URLs are on
  the page.
- **5 service pages**, each targeting one realistic long-tail phrase, with its
  own FAQ and its own `Service` structured data.
- **A 9-stage process page** with a defined output and a defined client
  responsibility per stage.
- **A 23-question FAQ** emitted as `FAQPage` JSON-LD, plus per-service FAQs.
- **5 long-form technical articles** — the long-term SEO engine.
- **A retrieval-grounded AI assistant** that answers from a generated knowledge
  base and refuses when nothing relevant is retrieved.
- **A conversion funnel**: hero → case studies → process → evidence → pricing →
  multi-step brief form → booking, with WhatsApp available at every stage.

## Honesty rules this repository holds itself to

- No technology claim about a client site that was not read off the live
  response. See `NOTES.md` for the verification method.
- No invented testimonials. The array is empty and the proof section renders
  verifiable engineering evidence instead.
- No invented phone number, domain or booking link. Placeholders are documented
  and the UI degrades honestly when they are unset.
- No claim that grounding eliminates hallucination. It reduces it substantially
  and makes the failure mode a visible refusal — which is testable, and is
  tested on every deploy.

## Documentation

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — architecture, scripts, testing, CI/CD
- [`NOTES.md`](./NOTES.md) — what is placeholder, what stays manual, known limits
- [`.env.example`](./.env.example) — configuration

## Licence

All rights reserved. © Code Hippies / Deepak Joshi.
