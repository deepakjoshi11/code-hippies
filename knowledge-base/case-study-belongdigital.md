# Case study: Belong Digital Solutions

Live site: https://belongdigitalsolutions.in/
Page: /work/belongdigital
Category: Marketing & Agency
Year: 2026

## Summary
React SPA with a complete social-sharing and theming metadata layer.

## Engineering detail
Vite + React single-page app whose document head is fully specified for distribution — Open Graph title/description/type/url/image, a Twitter summary-large-image card, `theme-color` for mobile browser chrome, plus author and keyword metadata — before a single line of application JavaScript executes.

## What it does for the business
Every time someone shares the site in a message or on social, it renders as a proper branded preview card instead of a bare link.

## Technology used
React, Vite, Open Graph, Twitter Cards, Hostinger CDN

## Signals verified on the live site
- Open Graph tags: og:title, og:description, og:type, og:url, og:image
- `twitter:card` set to summary_large_image
- `<meta name="theme-color" content="#0b0b0b">` — mobile browser chrome theming
- Author and keywords metadata declared
- Vite/React SPA document shell
- Served from Hostinger's CDN (`server: hcdn`)

## The problem
A single-page app renders its content in JavaScript — which means unless the head is written properly, every share on WhatsApp, LinkedIn or X is a naked URL.

## The approach
- Specify the full Open Graph and Twitter card set statically in the document head, where crawlers and messaging previews actually read it.
- Declare `theme-color` so mobile browser chrome matches the brand instead of defaulting to grey.
- Keep the shell metadata independent of the client bundle, so a JavaScript failure still leaves a shareable, described page.

## The outcome
- Shared links render as branded preview cards across social and messaging.
- The page describes itself correctly even if the app bundle never loads.
