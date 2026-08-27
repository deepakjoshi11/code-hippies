# Case study: FitWithNash — Consultation

Live site: https://consult.fitwithnash.com/
Page: /work/fitwithnash
Category: Health & Coaching
Year: 2026

## Summary
A one-page consultation funnel for a private dietitian, built static and deployed to Vercel.

## Engineering detail
Astro site (public source at github.com/codehippies11/fitwithnash) deployed to Vercel's edge network — the served page is essentially all content and almost no asset weight, and it carries the deepest structured-data graph in the portfolio: Person, ProfessionalService, Service, OfferCatalog, Offer, EducationalOccupationalCredential, Audience and a full FAQPage.

## What it does for the business
Turns a nutritionist's practice into a single page that answers every question a prospective client has, then books them.

## Technology used
Astro, Vercel, Static generation, JSON-LD / Schema.org, FAQ schema

## Signals verified on the live site
- Response header `server: Vercel`
- Public repository `codehippies11/fitwithnash` — primary language Astro
- One `<h1>`: "Build a stronger body" — correct single-h1 document outline
- JSON-LD includes Person, ProfessionalService, Service, OfferCatalog, Offer, EducationalOccupationalCredential, Audience, Country, Place, FAQPage, Question, Answer, WebSite, WebPage
- `/robots.txt` and `/sitemap.xml` both return HTTP 200
- A single image request in the initial document — content-first, near-zero media weight

## The problem
An independent practitioner does not need a nine-page website. They need one page that survives being the only thing a stranger reads before deciding to pay.

## The approach
- Build in Astro and ship static HTML, so there is no framework runtime between the reader and the offer.
- Model the practice in structured data properly — Person for the practitioner, ProfessionalService for the practice, OfferCatalog for the packages, EducationalOccupationalCredential for qualifications.
- Answer objections on-page with an FAQPage graph, so the same answers can surface directly in search results.
- Deploy to Vercel so TLS, the CDN and preview builds are handled without a server to maintain.

## The outcome
- Credentials, services and pricing are machine-readable, not just human-readable.
- FAQ answers are eligible to appear directly in search results.
- No server to patch, no CMS to update.
