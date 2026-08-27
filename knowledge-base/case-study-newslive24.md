# Case study: NewsLive24

Live site: https://www.newslive24.in/
Page: /work/newslive24
Category: News & Publishing
Year: 2025

## Summary
English-language India news portal on WordPress, tuned for news structured data and ad revenue.

## Engineering detail
WordPress origin behind nginx, instrumented with GA4 via Google Tag Manager and monetised with Google AdSense; the document carries the richest structured-data graph of the portfolio — NewsArticle, NewsMediaOrganization, CollectionPage, ItemList, ContactPoint and SearchAction — plus hreflang alternates.

## What it does for the business
Runs a full English news desk on a CMS the editors already know, while the technical SEO and ad plumbing is handled underneath them.

## Technology used
WordPress, nginx, GA4 / Tag Manager, Google AdSense, JSON-LD / Schema.org

## Signals verified on the live site
- Response header `Server: nginx`
- 71 references to `wp-content` in the served HTML — WordPress origin
- Google Tag Manager / gtag GA4 loader present
- Google AdSense (`adsbygoogle`) present
- JSON-LD includes NewsArticle, NewsMediaOrganization, CollectionPage, ItemList, ListItem, ImageObject, ContactPoint, SearchAction
- 2 `hreflang` alternate declarations
- `/robots.txt` and `/sitemap.xml` both return HTTP 200

## The problem
A newsroom that already lives in WordPress will not migrate off it — so the engineering has to happen around the CMS, not instead of it.

## The approach
- Keep the WordPress editorial workflow intact and do the technical work in the theme and head: structured data, hreflang, canonical discipline.
- Emit a NewsArticle graph per story and a CollectionPage/ItemList graph per section so Google can distinguish an article from an index.
- Wire GA4 through Tag Manager so measurement changes do not require a code deploy.
- Place AdSense inventory in the template rather than inline in article bodies, keeping layout shift bounded.

## The outcome
- Editors publish exactly as before; every story ships with news structured data attached.
- Analytics and ad configuration are changeable without a developer.
