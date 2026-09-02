# Case study: Adnexa

Live site: https://adnexatech.in/
Page: /work/adnexa
Category: Marketing & Agency
Year: 2026

## Summary
A 23-route advertising platform on the Next.js App Router, server-rendered and machine-readable end to end.

## Engineering detail
Next.js App Router shipping React Server Components (the document carries a `self.__next_f` streaming payload), served over HTTP/2 with Brotli behind Hostinger's CDN (`server: hcdn`). Images run through the framework's optimiser and are content-negotiated to AVIF; a 32px wordmark comes back as 418 bytes. Social cards are generated at request time by an `/opengraph-image` route rather than maintained by hand.

## What it does for the business
An advertising company's whole service catalogue — 23 pages of it — that search engines and AI assistants can read completely without running any JavaScript.

## Technology used
Next.js App Router, React Server Components, AVIF image pipeline, Generated OG images, JSON-LD / Schema.org, HTTP/2 + Brotli, Hostinger CDN

## Signals verified on the live site
- Response header `server: hcdn`, served over HTTP/2 with `content-encoding: br`
- `self.__next_f` React Server Component streaming payload in the document, plus `/_next/static` asset routes
- `/_next/image` returns `image/avif` under an AVIF-capable `Accept` header — 418 bytes for a 32px wordmark
- JSON-LD graph containing Organization, WebSite, FAQPage, Question, Answer, Person, Place, PostalAddress, Country and PropertyValue
- Four `"@type":"Question"` entries — a complete FAQPage, not a stub
- `/opengraph-image` returns HTTP 200 `image/png`, generated per request
- `/robots.txt` and `/sitemap.xml` both return HTTP 200; the sitemap declares 23 URLs
- Sub-route `/services/creative-content` returns its `<h1>` in the initial HTML — server-rendered, not hydrated in
- Security headers: `strict-transport-security: max-age=63072000; includeSubDomains`, `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy` denies camera, microphone, geolocation, and opts out of both `interest-cohort` and `browsing-topics`

## The problem
An advertising platform sells services a buyer has to understand before they enquire — media planning, programmatic, CTV, reporting. That argument only works if every page is reachable, readable and attributable, and most agency sites bury exactly that content behind client-side rendering where no crawler and no AI assistant will ever see it.

## The approach
- Model the catalogue as real routes — services, industries, channels — rather than anchors on one long page, so each has its own URL, title and place in the sitemap.
- Server-render on the App Router so headings and body copy are in the initial HTML, then let React Server Components stream the rest without blocking what a crawler reads.
- Emit a full JSON-LD graph, including a genuine FAQPage with four question/answer pairs, so the pitch is machine-readable and eligible for rich results.
- Generate social cards from a route instead of maintaining a folder of images that drifts out of date the first time a page is renamed.
- Set the security and privacy headers at the edge, including opting the domain out of interest-cohort and browsing-topics advertising APIs.

## The outcome
- 23 routes, each individually crawlable and individually rankable.
- Images negotiate down to AVIF automatically, at a fraction of the byte cost.
- The company's identity, address and FAQ are declared in structured data rather than left for a model to guess.
