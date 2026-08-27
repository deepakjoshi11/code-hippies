# Case study: ReadyNews

Live site: https://readynews.in/
Page: /work/readynews
Category: News & Publishing
Year: 2026

## Summary
Lean custom-built news portal — no CMS bloat, versioned assets, full news schema.

## Engineering detail
A purpose-built PHP news portal (single `/assets/js/app.js` bundle with a cache-busting version query, no CMS footprint in the markup) behind Cloudflare, carrying a complete news structured-data graph — NewsMediaOrganization, CollectionPage, ItemList, BreadcrumbList, ImageObject, SearchAction — with GA4 and AdSense wired in.

## What it does for the business
A news site that loads fast on a cheap phone because there is no plugin stack sitting between the reader and the story.

## Technology used
PHP, Custom CMS, Cloudflare, GA4, Google AdSense, JSON-LD / Schema.org

## Signals verified on the live site
- Single application bundle `/assets/js/app.js?v=…` with version-pinned cache busting
- No CMS signature in the served HTML (no wp-content, no generator meta)
- Cloudflare references in the document
- GA4 property `G-BF3RMPWB9W` via gtag
- Google AdSense present (`ca-pub-4835452789612`)
- JSON-LD includes NewsMediaOrganization, CollectionPage, ItemList, ListItem, BreadcrumbList, ImageObject, SearchAction
- `/robots.txt` and `/sitemap.xml` both return HTTP 200

## The problem
Off-the-shelf news themes ship dozens of plugins a publisher never uses, and every one of them is weight on the reader's connection and surface area for an attacker.

## The approach
- Build the publishing surface directly instead of adopting a theme, so the shipped JavaScript is one reviewed bundle.
- Version every asset URL so a deploy invalidates cache deterministically instead of relying on a purge.
- Serve behind Cloudflare so static assets and cacheable pages never touch the origin.
- Emit BreadcrumbList and ItemList alongside NewsMediaOrganization so section hierarchy is explicit to crawlers.

## The outcome
- One reviewed JavaScript bundle instead of a plugin dependency tree.
- Deterministic cache invalidation on every release.
