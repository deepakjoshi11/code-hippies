# Service: SEO & performance engineering

Page: /services/seo-performance

## What this service is
Technical SEO and Core Web Vitals treated as engineering, not as a checklist. Structured data, rendering strategy, crawl architecture and a Core Web Vitals budget enforced in CI — the technical half of SEO, which is the half a developer is actually responsible for.

## What you get
- Rendering audit — what a crawler sees without JavaScript, per template
- JSON-LD graph appropriate to the site: Organization, Article, Service, FAQPage, BreadcrumbList
- Core Web Vitals budget enforced by Lighthouse CI on every push
- Crawl architecture: internal linking, sitemap generation, canonical discipline
- Metadata system — unique titles, descriptions and OG images per route
- A prioritised remediation list with the estimated effort of each item

## Technology options
- Rendering: Static generation, Incremental static regeneration, Server-side rendering, Edge rendering
- Structured data: Organization / Person, Article / NewsArticle, Service / OfferCatalog, FAQPage, BreadcrumbList
- Measurement: Lighthouse CI, Vercel Analytics, Plausible, GA4 via Tag Manager

## Typical engagement length
One-week audit; two to six weeks of remediation depending on findings.

## Rendering strategy is the largest single SEO decision
A client-rendered page can be indexed, eventually, sometimes. A server-rendered page is indexed reliably. Every project in the portfolio that needed to rank — the Kesari regional editions, the news portals, the consultation funnel — puts its content in the initial HTML response. That single decision does more than any amount of keyword work.

## Structured data describes the business, not just the page
The FitWithNash consultation site declares Person, ProfessionalService, OfferCatalog, credentials and an FAQPage. Core Media Solutions mirrors its entire service catalogue in Service and Offer types. The news properties declare NewsMediaOrganization with ItemList and BreadcrumbList section hierarchy. Structured data is how you tell a search engine what a business is, in a form it does not have to guess at.

## A performance budget that fails the build
Performance work that is not enforced regresses within two sprints. The budget on this site — LCP under 2.5s, CLS under 0.1, INP under 200ms — is checked by Lighthouse CI in GitHub Actions on every push. The same setup is part of every delivery, because a number nobody checks is a number that drifts.

## Questions about SEO & performance engineering
### Can you guarantee a number-one ranking?
No, and nobody honest can — ranking depends on competition and on content quality that no amount of engineering substitutes for. What I can do is make sure nothing technical is standing in the way: that your pages render for crawlers, load fast, describe themselves in structured data and link to each other sensibly.

### Do you write the content as well?
I write technical content and the structural copy that carries SEO weight — page titles, headings, FAQ answers, service descriptions. Ongoing editorial content is usually better produced by someone inside your business who knows the subject.

### How do you report on the work?
Before-and-after Lighthouse reports, a rendering audit showing what crawlers see per template, and the structured data validated against Google's Rich Results Test. Concrete artefacts, not a monthly slide.
