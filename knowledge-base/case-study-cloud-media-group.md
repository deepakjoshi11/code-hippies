# Case study: Cloud Media Group

Live site: https://cloudmediagroup.in/
Page: /work/cloud-media-group
Category: Marketing & Agency
Year: 2026

## Summary
A twelve-page publisher-revenue site in 12 KB of HTML and 3.2 KB of JavaScript, with an authenticated CMS behind it.

## Engineering detail
Deliberately frameworkless: the homepage is 12 KB of hand-written HTML with a single 3.2 KB script carrying no framework runtime at all — no React, Vue, jQuery or Angular string appears in the bundle. Twelve routes including a solutions tree and an interactive ad-revenue calculator, served over HTTP/2 with Brotli behind `server: hcdn`, with `/cms` redirecting to an authenticated login.

## What it does for the business
A publisher-services site that loads almost instantly on any connection, and a private admin area behind it for the team to manage content.

## Technology used
Hand-written HTML, Vanilla JavaScript, Custom CMS, HTTP/2 + Brotli, Open Graph, Hostinger CDN

## Signals verified on the live site
- Response header `server: hcdn`, served over HTTP/2 with `content-encoding: br`
- Homepage document is 12,158 bytes with one stylesheet and one script
- `/app.js` is 3,243 bytes and contains no `react`, `vue`, `jquery` or `angular` string
- Twelve internal routes in the document; `/about`, `/solutions/ctv`, `/ad-revenue-calculator` and `/contact` each return HTTP 200
- `/cms` returns HTTP 302 to `https://cloudmediagroup.in/cms/login` — an authenticated admin area, not a public page
- Canonical URL, Open Graph title, URL and image all present in the document head
- Security headers: `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`, `referrer-policy: strict-origin-when-cross-origin`

## The problem
A publisher-revenue business sells speed and transparency, so its own site arriving as a megabyte of framework runtime undermines the pitch before anyone reads it. The site still needed twelve pages, an interactive calculator and somewhere for the team to edit content.

## The approach
- Choose no framework, on purpose. The interaction budget here is a calculator and a nav — 3.2 KB of plain JavaScript covers it, and there is no hydration step to pay for.
- Keep the content multi-route rather than one scrolling page, so each solution has a URL that can be linked and ranked.
- Put editing behind an authenticated CMS at `/cms` so the marketing team is not dependent on a developer for copy changes.
- Serve compressed over HTTP/2 from a CDN, with canonical and Open Graph metadata on every page.

## The outcome
- The homepage is 12 KB — the argument for speed is made by the site itself.
- Twelve routes, each independently linkable.
- Content is editable by the team without a deployment.
