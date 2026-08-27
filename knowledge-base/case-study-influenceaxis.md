# Case study: Influence Axis

Live site: https://influenceaxis.in/
Page: /work/influenceaxis
Category: Marketing & Agency
Year: 2026

## Summary
Next.js brand site for a digital agency, with a clean single-h1 editorial structure.

## Engineering detail
Next.js application (`x-powered-by: Next.js`, `_next` asset routes) served behind LiteSpeed, with an Organization + WebSite + PostalAddress JSON-LD identity and a disciplined document outline — one `<h1>` carrying the positioning statement, section `<h2>`s beneath it.

## What it does for the business
A brand site that reads like the agency it is selling — sharp, fast, and unmistakably positioned in the first line.

## Technology used
Next.js, React, LiteSpeed, JSON-LD / Schema.org

## Signals verified on the live site
- Response header `x-powered-by: Next.js`
- Response header `server: LiteSpeed`
- `_next` asset routes present in the document
- Single `<h1>`: "We build digital brands that look sharper, move faster…"
- JSON-LD includes Organization, WebSite, PostalAddress
- `/robots.txt` and `/sitemap.xml` both return HTTP 200

## The problem
An agency's own website is the only work sample a prospect judges before they will look at any other. It cannot be the slowest thing they sell.

## The approach
- Build on Next.js so the positioning copy is server-rendered and present for crawlers on first byte.
- Keep one h1 per page and a strict heading hierarchy under it — the document outline is the SEO structure.
- Declare Organization and PostalAddress so brand search resolves to the right entity.

## The outcome
- The positioning statement is the first thing both a reader and a crawler see.
- Brand identity is declared in structured data, not left to inference.
