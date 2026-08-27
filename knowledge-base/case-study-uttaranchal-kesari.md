# Case study: Uttaranchal Kesari

Live site: https://www.uttaranchalkesari.com/
Page: /work/uttaranchal-kesari
Category: News & Publishing
Year: 2026

## Summary
Hindi regional news platform for Uttarakhand, served from a Next.js app behind Caddy.

## Engineering detail
Next.js application server (confirmed by an `x-powered-by: Next.js` response header) fronted by Caddy for TLS termination, serving server-rendered Hindi article markup at `lang="hi"` with `NewsMediaOrganization`, `WebSite` and `SearchAction` JSON-LD emitted on the document.

## What it does for the business
Publishes Uttarakhand's daily Hindi news in a form Google News and search engines can read the moment a story goes live.

## Technology used
Next.js, React, Caddy, Server-side rendering, JSON-LD / Schema.org

## Signals verified on the live site
- Response header `x-powered-by: Next.js`
- Response header `server: Caddy`
- `<html lang="hi">` with server-rendered Devanagari headlines in the initial HTML
- JSON-LD graph containing NewsMediaOrganization, WebSite and SearchAction
- `/robots.txt` and `/sitemap.xml` both return HTTP 200

## The problem
Regional Hindi publishers are usually stuck on heavyweight themes that render slowly on the mid-range Android phones most of their readers use, and that bury article structure behind client-side JavaScript that crawlers never execute.

## The approach
- Server-render every article and section page so the full Devanagari headline and body text is present in the initial HTML payload rather than hydrated in later.
- Emit a NewsMediaOrganization + WebSite JSON-LD graph on the document so search engines can attribute the publication and expose a sitelinks search box.
- Terminate TLS and serve at the edge through Caddy, keeping certificate renewal automatic rather than a manual annual chore.
- Publish a machine-generated sitemap and robots policy so newly published stories are discoverable without manual submission.

## The outcome
- Article HTML is readable by crawlers without executing JavaScript.
- Publication identity is machine-declared through structured data.
- The editorial team publishes without touching infrastructure.
