# Frequently asked questions: Technology

Page: /faq

## What technologies do you build with?
Web on React/Next.js, Vue/Nuxt or Astro; backends on Node/NestJS, Python/Django or FastAPI, Go, or PHP 8.2+; mobile on Swift and SwiftUI for iOS, Kotlin for Android, or React Native and Flutter for cross-platform. The stack is chosen per project against your constraints — not every project uses every one of these.

## Why is your portfolio built on so many different stacks?
Because the right answer differs. An ashram that cannot carry a maintenance contract got 21 KB of static HTML on Bootstrap that will still work in a decade. A publisher whose editors will not leave WordPress got engineering work done around WordPress. Regional news editions that need stories crawlable immediately got server-rendered Next.js. Picking one stack for every client is a preference, not an engineering decision.

## Should I choose native or cross-platform for my mobile app?
If the app is mostly forms, lists and API calls, React Native or Flutter gets you two platforms for close to the price of one and your users will not notice the difference. If it leans on the camera, background location, widgets, HealthKit or heavy animation, native Swift and Kotlin costs less in total than fighting a bridge. That decision is made in discovery, with the tradeoff written down.

## Can you make my existing site faster?
Usually, yes — and usually the cause is rendering strategy, unbounded third-party scripts, or images shipped at the wrong size, in that order. A one-week audit gives you before-and-after Lighthouse numbers, a rendering audit showing what crawlers actually see, and a prioritised fix list with effort estimates.

## Do you do design as well as development?
Yes — as a design system rather than a set of pictures: tokens, type scale, spacing, and every component designed with its loading, empty and error states, since those are most of what users actually see. Accessibility is checked at design time, not retrofitted after.
