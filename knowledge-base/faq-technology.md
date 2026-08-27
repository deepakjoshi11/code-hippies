# Frequently asked questions: Technology

Page: /faq

## What technologies do you build with?
Web on React/Next.js, Vue/Nuxt or Astro; backends on Node/NestJS, Python/Django or FastAPI, Go, or PHP 8.2+; mobile on Swift and SwiftUI for iOS, Kotlin for Android, or React Native and Flutter for cross-platform. The stack is chosen per project against your constraints — not every project uses every one of these.

## Why is your portfolio built on so many different stacks?
Because the right answer differs. An ashram that cannot carry a maintenance contract got 21 KB of static HTML on Bootstrap that will still work in a decade. A publisher whose editors will not leave WordPress got engineering work done around WordPress. Regional news editions that need stories crawlable immediately got server-rendered Next.js. Picking one stack for every client is a preference, not an engineering decision.

## Can you make my existing site faster?
Usually, yes — and usually the cause is rendering strategy, unbounded third-party scripts, or images shipped at the wrong size, in that order. A one-week audit gives you before-and-after Lighthouse numbers, a rendering audit showing what crawlers actually see, and a prioritised fix list with effort estimates.

## Do you do design as well as development?
Yes — as a design system rather than a set of pictures: tokens, type scale, spacing, and every component designed with its loading, empty and error states, since those are most of what users actually see. Accessibility is checked at design time, not retrofitted after.

## Do you build e-commerce sites?
Yes — either on a hosted platform when you want to run it yourself with no engineering on call, or custom when the catalogue, pricing rules or checkout genuinely do not fit an off-the-shelf platform. That choice gets made in discovery, and the honest recommendation is often the hosted one.

## Can you integrate payments?
Yes — Razorpay, Stripe, PayPal and similar. Payment work is done server-side with webhook verification and idempotency handling, because the failure mode that matters is not a broken checkout, it is a customer charged twice or an order that never records.

## Can I edit the content myself after launch?
Yes, if that is a requirement — say so in discovery, because it changes the build. Options run from a headless CMS to a simple admin surface to plain markdown files, and the right one depends on who is editing and how often. If nobody will actually edit it, a CMS is cost with no return.

## Will my site work in Hindi or other languages?
Yes. Four sites in this portfolio serve Hindi content, three of them as server-rendered Devanagari with the correct language declaration and structured data so search engines index them properly. Multi-language support is a build-time decision rather than a plugin, so raise it in discovery.
