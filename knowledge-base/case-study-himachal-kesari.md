# Case study: Himachal Kesari

Live site: https://www.himachalkesari.com/
Page: /work/himachal-kesari
Category: News & Publishing
Year: 2026

## Summary
The same Hindi publishing platform, deployed for Himachal Pradesh behind Cloudflare.

## Engineering detail
A second tenant of the same Next.js publishing platform, this one served through Cloudflare (`server: cloudflare`, `x-powered-by: Next.js`) with the heaviest editorial payload of the three regional editions and the same NewsMediaOrganization / SearchAction structured-data graph.

## What it does for the business
Gives Himachal Pradesh its own Hindi news brand without rebuilding the publishing system from scratch.

## Technology used
Next.js, React, Cloudflare CDN, Multi-tenant content platform, JSON-LD / Schema.org

## Signals verified on the live site
- Response header `x-powered-by: Next.js`
- Response header `server: cloudflare` — CDN in front of the origin
- `<html lang="hi">`; server-rendered section headings such as मुख्य समाचार present in source
- JSON-LD graph containing NewsMediaOrganization, WebSite and SearchAction
- `/robots.txt` and `/sitemap.xml` both return HTTP 200

## The problem
Launching a second regional edition is where most publishing projects go wrong: the usual answer is to clone the codebase, and from that point every fix has to be applied twice.

## The approach
- Run the new edition as another tenant of the existing platform rather than a forked codebase, so a fix ships to every edition at once.
- Keep per-edition branding, sections and structured-data identity configurable instead of hard-coded.
- Put Cloudflare in front of the origin so cacheable pages are served close to the reader.

## The outcome
- A new regional edition launches as configuration, not as a fork.
- One codebase, one deployment pipeline, three published mastheads.
