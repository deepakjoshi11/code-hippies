# Case study: IndiaNews16

Live site: https://indianews16.com/
Page: /work/indianews16
Category: News & Publishing
Year: 2026

## Summary
Highest-density edition of the custom news platform — 90 crawlable links from the homepage.

## Engineering detail
Same custom PHP news engine as ReadyNews, deployed behind Cloudflare with dated build tags on its assets (`app.js?v=20260705atlas1`), serving a dense homepage — 90 internal links and 28 images in the initial HTML — under a NewsMediaOrganization / CollectionPage / BreadcrumbList / ItemList structured-data graph.

## What it does for the business
Puts a large amount of the day's news one click from the front page, without making the front page slow.

## Technology used
PHP, Custom CMS, Cloudflare, JSON-LD / Schema.org

## Signals verified on the live site
- Application bundle `/assets/js/app.js?v=20260705atlas1` — dated release tagging
- 90 anchor elements and 28 images in the server-rendered homepage HTML
- Cloudflare references in the document
- JSON-LD includes NewsMediaOrganization, CollectionPage, ItemList, ListItem, BreadcrumbList, ImageObject, SearchAction
- `/robots.txt` and `/sitemap.xml` both return HTTP 200

## The problem
A news homepage is an internal-linking instrument. Too few links and deep sections never get crawled; too many rendered badly and the page stops being usable on mobile.

## The approach
- Render the full link graph server-side so crawl depth to any section is one hop.
- Ship dated release identifiers on assets so any production issue maps to a known build.
- Declare section hierarchy through BreadcrumbList rather than leaving it implicit in URL structure.

## The outcome
- Every section is one hop from the homepage for both readers and crawlers.
- Any reported issue is traceable to a dated build.
