# Case study: CarbonMedia

Live site: https://carbonmedia.in/
Page: /work/carbonmedia
Category: News & Publishing
Year: 2026

## Summary
Multi-vertical news brand on a current PHP 8.2 runtime with reader-facing forms.

## Engineering detail
Runs on PHP 8.2.30 (declared in `x-powered-by`) — a maintained, current runtime rather than a legacy 7.x install — serving a custom news application with three reader-facing forms, GA4 property `G-BVNH0Z14GM` and AdSense inventory, with WebSite + SearchAction JSON-LD.

## What it does for the business
Covers news, business, tech, sport and politics under one brand, and lets readers search and subscribe without leaving the page.

## Technology used
PHP 8.2, Custom CMS, GA4, Google AdSense, JSON-LD / Schema.org

## Signals verified on the live site
- Response header `x-powered-by: PHP/8.2.30`
- Application bundle `/assets/js/app.js?v=20260719b`
- 3 `<form>` elements in the served homepage
- GA4 property `G-BVNH0Z14GM` via Google Tag Manager
- Google AdSense present (`ca-pub-4835452789612`)
- JSON-LD includes WebSite and SearchAction
- `/robots.txt` and `/sitemap.xml` both return HTTP 200

## The problem
A great many Indian publishing sites are still running end-of-life PHP 7. That is not a performance problem, it is an unpatched-runtime problem.

## The approach
- Run the application on a supported PHP 8.2 runtime that still receives security patches.
- Keep reader-facing forms — search, subscribe — server-validated rather than trusting client-side checks.
- Declare a SearchAction so the brand can surface a sitelinks search box in results.

## The outcome
- The runtime under the site is one that still receives security fixes.
- Reader interaction happens on-page instead of bouncing to third-party forms.
