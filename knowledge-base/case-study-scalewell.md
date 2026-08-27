# Case study: ScaleWell Digital Solutions

Live site: https://scalewelldigitalsolutions.in/
Page: /work/scalewell
Category: Marketing & Agency
Year: 2026

## Summary
Vite + React single-page app with a deliberately minimal 1 KB HTML shell.

## Engineering detail
Vite-built React SPA — an ES-module entry at `/assets/index-<hash>.js` with content-hashed CSS beside it — shipping a roughly 1 KB HTML shell, Tailwind design tokens (`bg-primary`, `text-secondary`, `font-body`) and preconnected Google Fonts (Space Grotesk / Sora).

## What it does for the business
A fast, app-like marketing site where every interaction happens instantly without a page reload.

## Technology used
React, Vite, Tailwind CSS, Hostinger CDN, Client-side routing

## Signals verified on the live site
- ES-module entry `<script type="module" crossorigin src="/assets/index-DS0bXq7u.js">` — Vite content-hashed build output
- Content-hashed stylesheet `/assets/index-BVwgp9nJ.css`
- HTML shell is ~1 KB with a single `<div id="root">` mount point
- Tailwind semantic token classes on `<body>`: `bg-primary text-secondary font-body`
- `preconnect` to fonts.googleapis.com and fonts.gstatic.com; Space Grotesk + Sora with `display=swap`
- Served from Hostinger's CDN (`server: hcdn`)

## The problem
A brochure site with a handful of routes does not need a server runtime — but it does need its fonts and its bundle to stop blocking the first paint.

## The approach
- Build with Vite so the production bundle is content-hashed and cacheable indefinitely.
- Preconnect to the font origins and load faces with `display=swap` so text is never invisible while fonts fetch.
- Express the design system as Tailwind semantic tokens rather than hard-coded colour values, so a rebrand is a token change.

## The outcome
- Immutable, content-hashed assets — cache once, never revalidate.
- Design system lives in tokens, so visual changes do not require touching components.
