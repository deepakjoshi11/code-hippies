# Case study: Nantin Baba Ashram

Live site: https://www.nantinbaba.org/
Page: /work/nantinbaba
Category: Community & Non-profit
Year: 2025

## Summary
A deliberately tiny static Hindi site for an ashram — 21 KB, no build step, no maintenance.

## Engineering detail
Static HTML deployed to Vercel, built on Bootstrap 5 with jQuery slim and Popper — the whole document is roughly 21 KB, has no application framework and no build pipeline, so it will still render correctly with no intervention years from now.

## What it does for the business
Gives the ashram a permanent, free-to-run web presence that loads instantly even on a weak rural connection.

## Technology used
Static HTML, Bootstrap 5, jQuery, Vercel

## Signals verified on the live site
- Response header `server: Vercel`
- Bootstrap 5, jQuery slim and Popper loaded from local `node_modules` paths
- Total served document ≈ 21 KB — the lightest page in the portfolio
- Static HTML with no framework runtime and no CMS signature
- Hindi-language content with locally hosted imagery

## The problem
A community organisation cannot carry an annual maintenance contract, and it cannot afford a site that breaks the first time a framework has a breaking release.

## The approach
- Choose boring, permanent technology deliberately — static HTML and a stable CSS framework, no build step to rot.
- Keep the payload under a few tens of kilobytes so the site is usable on a weak mobile connection in the hills.
- Deploy to a platform with a free tier and automatic TLS so there is no renewal to forget.

## The outcome
- No dependency upgrade treadmill and no recurring hosting bill.
- Loads on a poor connection, which is the actual constraint for this audience.
