# Case study: Core Media Solutions

Live site: https://coremediasolutions.in/
Page: /work/coremediasolutions
Category: Marketing & Agency
Year: 2026

## Summary
Full agency site with a service catalogue and FAQ modelled in structured data.

## Engineering detail
Content-rich agency site (35 images, an enquiry form, a full section outline) whose entire commercial offer is mirrored in JSON-LD — Service, OfferCatalog, Offer, ContactPoint, PostalAddress, ImageObject and an FAQPage graph — so the service list is legible to search engines, not just to visitors.

## What it does for the business
Explains everything the agency sells, answers the usual questions up front, and captures enquiries on the same page.

## Technology used
Static site, Hostinger CDN, JSON-LD / Schema.org, FAQ schema, Lead capture form

## Signals verified on the live site
- 35 `<img>` elements and 1 `<form>` in the served HTML
- JSON-LD includes Service, OfferCatalog, Offer, ContactPoint, PostalAddress, ImageObject, FAQPage, Question, Answer, WebPage, WebSite
- `/robots.txt` and `/sitemap.xml` both return HTTP 200
- Served from Hostinger's CDN (`server: hcdn`)

## The problem
Agency websites list services as decorative headings. Search engines cannot tell a service catalogue from a paragraph unless you say so explicitly.

## The approach
- Model every offering as a Service inside an OfferCatalog so the catalogue is structured data, not styling.
- Attach an FAQPage graph to the objections the sales conversation always hits.
- Declare ContactPoint and PostalAddress so local and brand search have something authoritative to resolve against.
- Keep the enquiry form on-page rather than routing prospects to a third-party form.

## The outcome
- The service catalogue is machine-readable and eligible for rich results.
- The FAQ does double duty: it closes objections and it targets question queries.
