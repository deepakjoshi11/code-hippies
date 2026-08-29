# Changelog

Notable changes to this project. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-08-28

First production release. Deployed on Vercel, auto-updating from `main`.

### Added

**Content and positioning**
- 13 case studies, every technology claim read directly off the live HTTP
  response — headers, served HTML, embedded JSON-LD.
- 5 service pages, each targeting one realistic long-tail phrase with its own
  FAQ and `Service` structured data.
- 50-question FAQ across nine categories, with 63 alias phrasings.
- 5 long-form technical articles.
- Audience switcher presenting the same claims to a non-technical buyer, an
  engineer, and someone weighing this against headcount.
- `/enterprise` stating what one senior engineer covers *and* what it does not.
- `/partner` routing larger work to Dharmarthlabs, with explicit guidance on
  when to stay here instead.
- `/hire` presenting direct, escrow-marketplace and partnership as equal routes.
- `/learn` — free material on AI visibility and modern engineering, with each
  track's completion status marked.

**Engineering**
- Retrieval-grounded AI assistant: curated answer → retrieval → refusal.
- Multi-channel contact dock; every channel env-driven and hidden until set.
- Multi-step lead form with a documented triage model.
- Consent-gated analytics and advertising, as separate categories.
- HMAC-signed CMS control surface, closed by default.
- `/llms.txt`, RSS feed, IndexNow submission on a 72-hour schedule.
- CI: lint, typecheck, 315 tests, build, dependency audit, client-bundle secret
  scan, Lighthouse budgets on desktop and mobile.

### Verified at release

- Lighthouse 100/100/100/100 desktop; ≥ 90 mobile; CLS 0.000 on every route.
- Zero WCAG 2.1 A/AA violations across 18 pages at 390px and 1440px.
- No horizontal overflow at 360 / 390 / 768 / 1024 / 1440px.
- 315 tests passing; 0 dependency vulnerabilities.

### Known limitations

Documented rather than hidden — see `NOTES.md` for the full reasoning.

- **Rate limiting is in-process**, so on serverless the effective limit is
  per-instance. Back it with a shared store before heavy traffic.
- **CSP uses `'unsafe-inline'` for scripts** rather than a nonce. Next.js
  cannot inject a nonce into statically generated routes, and static rendering
  is this site's largest SEO decision. Compensating controls are documented.
- **The lead scoring model is unfitted priors**, not trained weights. It says so
  in code, in tests, and in every explanation string it produces.
- **One case-study site is offline.** `nantinbaba.org` was reachable when its
  case study was written and has since been taken down. It is labelled offline
  on its page rather than removed.
- **Gap logging writes to the filesystem**, which is ephemeral on serverless.

[1.0.0]: https://github.com/deepakjoshi11/code-hippies/releases/tag/v1.0.0
