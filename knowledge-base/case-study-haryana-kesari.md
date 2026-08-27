# Case study: Haryana Kesari

Live site: https://www.haryanakesari.com/
Page: /work/haryana-kesari
Category: News & Publishing
Year: 2026

## Summary
Newest edition of the Kesari network — platform live and awaiting its editorial launch.

## Engineering detail
Third tenant of the same Next.js + Caddy publishing stack, live and serving a correctly structured empty state (the homepage renders अभी कोई प्रकाशित खबर उपलब्ध नहीं — "no published stories yet") with its NewsMediaOrganization and WebSite JSON-LD identity already in place.

## What it does for the business
The Haryana masthead is built, deployed and search-ready; it starts ranking from day one of publishing rather than from month three.

## Technology used
Next.js, React, Caddy, Multi-tenant content platform, JSON-LD / Schema.org

## Signals verified on the live site
- Response header `x-powered-by: Next.js`
- Response header `server: Caddy`
- `<html lang="hi">`; homepage renders an explicit empty state rather than an error
- JSON-LD graph containing NewsMediaOrganization and WebSite
- `/robots.txt` and `/sitemap.xml` both return HTTP 200

## The problem
A masthead that launches the same day its first story is written spends its first months invisible: no indexed sitemap, no declared publisher identity, no crawl history.

## The approach
- Deploy the edition ahead of editorial go-live so robots, sitemap and publisher structured data are already discoverable.
- Render a deliberate, human-readable empty state instead of a 404 or a broken template while the desk staffs up.
- Reuse the tenant configuration path proven by the Uttarakhand and Himachal editions.

## The outcome
- Infrastructure and search identity are live before the first story is filed.
- Editorial launch becomes a content decision, not an engineering project.
