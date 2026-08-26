# Code Hippies — Portfolio

Portfolio site for **Deepak Joshi** / Code Hippies — a small web engineering studio
targeting clients in Europe and premium-tier clients in India.

Built with Next.js 16 (App Router, static export-ready), React 19, Tailwind CSS v4
and Motion. UI primitives are hand-ported from **Aceternity UI**, **Magic UI** and
**Uiverse.io** rather than pulled as dependencies — they are copy-in component
libraries, so they live in `components/ui/` and can be edited freely.

## Getting started

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
app/
  layout.tsx        metadata, fonts, favicon wiring
  page.tsx          section composition + JSON-LD (ProfessionalService, FAQPage)
  globals.css       brand tokens, keyframes, Uiverse button styles
components/
  ui/               Aceternity / Magic UI / Uiverse primitives
  sections/         nav, hero, services, work, about, process,
                    testimonials, pricing, faq, contact, footer
content/site.ts     all copy, pricing, projects, FAQs — edit here first
public/             logo, favicon, studio background, OG card
```

**All editable copy lives in `content/site.ts`.** Prices, project entries, FAQs and
testimonials are data, not markup — change them there and every section updates.

## Brand assets

| File | Source | Used as |
| --- | --- | --- |
| `public/logo.png` | transparent portrait mark | header + footer logo |
| `public/favicon.png`, `app/icon.png` | black-background mark | browser favicon |
| `public/studio.webp` | studio desk photograph | subtle background in hero, about, contact |
| `public/og.jpg` | studio photograph, cropped 1200×630 | social share card |

Originals were 8.2 MB combined; they are optimised to ~325 KB total.

## Before you go live

1. **Replace the placeholder domain.** `SITE` in `app/layout.tsx` and the `@id` in
   `app/page.tsx` both point at `https://codehippies.com`.
2. **Self-host the fonts.** Instrument Serif and Geist are currently loaded from
   Google Fonts. German courts have held that serving Google Fonts from Google's
   CDN transfers visitor IPs to the US without consent, which is a GDPR problem for
   a site aimed at European clients. Download the WOFF2 files into `public/fonts/`
   and swap the `<link>` for `next/font/local`. Fallback stacks are already defined,
   so the site renders correctly either way.
3. **Swap the testimonials.** The quotes in `content/site.ts` are illustrative
   placeholders written to match the positioning. Replace them with real client
   quotes, with permission, before publishing — or delete the section.
4. **Confirm the stats.** "98+ Lighthouse", "24 repositories", "3 weeks" should be
   numbers you can defend if a client asks.
5. **Point the CTA at real scheduling.** `site.calendly` is currently a `mailto:`.

## Accessibility & performance notes

- Every page target is WCAG AA; skip link, focus-visible rings and `aria-expanded`
  state on the nav and FAQ accordion are wired up.
- `prefers-reduced-motion` is honoured globally in `globals.css`.
- `overflow-x: clip` (not `hidden`) contains the decorative overhang without
  breaking `position: sticky`.
- Verified at 390 / 820 / 1440 px with zero horizontal overflow.
