# Working in this repository

Notes for Claude Code sessions. Read before changing anything.

## What this is

The source of codehippies.com — a portfolio and lead platform whose entire
premise is that **every claim it makes is checkable**. That premise is the
product. A change that weakens it is a regression even if every test passes.

## Rules that are not negotiable

**Never state a technical fact you have not observed.** Every `verified` entry
in `src/data/case-studies.ts` was read off a live HTTP response. Before adding
one, actually run the check:

```bash
curl -sSL -D headers.txt -o page.html "https://example.com/"
grep -iE '^(server|x-powered-by):' headers.txt
grep -oP '"@type"\s*:\s*"\K[^"]+' page.html | sort -u
```

Paste what you actually saw. If a signal could not be observed, omit it — do
not infer it from the framework's usual behaviour.

**Never invent testimonials, metrics, phone numbers, or client quotes.** The
`testimonials` array in `src/data/proof.ts` is deliberately empty. Contact
channels are env-driven and hide when unset. This is not an oversight to fix.

**Never claim the AI assistant cannot hallucinate.** It is retrieval-grounded
with a refusal path, which reduces fabrication substantially and makes the
failure mode visible. That is the accurate claim; anything stronger is false.

**`"use client"` goes on the smallest component that needs it** — never on a
page file. If content must reach a crawler, the directive belongs further down.

**Validate on the server.** Every route handler re-parses with the same Zod
schema the client used.

**Nothing sensitive behind `NEXT_PUBLIC_`.** That prefix compiles the value
into the browser bundle. CI greps for secret-shaped strings and fails.

## Where things live

`src/data` is the single source of truth. It feeds the pages, the JSON-LD, the
generated knowledge base, the assistant's browse panel and `/llms.txt` — which
is what makes drift between them impossible. Change data there, not in JSX.

`knowledge-base/` is build output. Never hand-edit it. Regenerate with
`npm run kb:build`.

## Before you say you are done

```bash
npm run kb:build && npm test && npm run lint && npm run typecheck
npm run build
npm start &
CHROME_PATH=/path/to/chrome npm run audit:quality
```

`audit:quality` checks link integrity, metadata, document outline, offline
case-study rendering, axe-core WCAG 2.1 A/AA at two breakpoints, and horizontal
overflow at five. It exits non-zero on any failure.

**Verify the rendered HTML, not just the commit.** A patch that fails partway
can leave the data correct and the page wrong — that has happened here once
already, which is why `audit:quality` includes a rendering-level check.

## Things that look like bugs but are deliberate

- **`display: "optional"` on the font.** `swap` was measured on the same build:
  no LCP improvement, and CLS rose from 0.000 to 0.096. Do not "fix" it back.
- **Reveal animates transform only, never opacity.** Fading from zero leaves
  content genuinely invisible and axe reports it as a 1.01:1 contrast failure.
- **CSP is `'unsafe-inline'` for scripts, not a nonce.** A nonce policy blocks
  Next.js's own hydration bootstrap on statically generated routes. Reasoning
  and compensating controls are in `NOTES.md`.
- **`@lhci/cli` is not a dependency.** It drags an unfixable high-severity
  tree; it is pinned at its call site in the workflow instead.
- **Match scores in `faq-match.ts` are banded.** Stemmed tokens let unrelated
  questions tie at a perfect score. Do not remove the cap.
- **`ads.txt` returns 404 when no ad provider is configured.** That is correct
  for a site selling no inventory.

## Deployment

Vercel's GitHub integration deploys `main` to production automatically. There
is deliberately no deploy job in CI — running both produces two deployments per
push. Do not add one back.
