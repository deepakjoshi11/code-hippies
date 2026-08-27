# Service: Web development

Page: /services/web-development

## What this service is
React and Next.js applications that hold up in production. Server-rendered web applications and marketing sites built on Next.js and React — typed end to end, indexable by default, and deployed through a pipeline that will not let a broken build reach users.

## What you get
- Next.js App Router application in TypeScript strict mode
- Server-rendered or statically generated routes — indexable without executing JavaScript
- Design system in Tailwind tokens, not hard-coded values
- Typed API layer with zod validation on both sides of every boundary
- GitHub Actions pipeline: lint, typecheck, test, build, Lighthouse budget, deploy
- Handover documentation and a runnable local environment

## Technology options
- Frontend: React / Next.js, Vue / Nuxt, Astro, Vite + React SPA
- Backend: Node / NestJS, Python / FastAPI, Python / Django, Go, PHP 8.2+
- Data: PostgreSQL, MySQL, SQLite, Redis, Headless CMS
- Hosting: Vercel, Cloudflare, Caddy / nginx on a VPS, Hostinger

## Typical engagement length
Two-week discovery and build for a focused site; six weeks and up for an application.

## The stack is chosen per project, not per fashion
The portfolio on this site runs on Next.js, Astro, WordPress, a Vite SPA, hand-written PHP and plain static HTML — because those were the right answers for those clients. An ashram that cannot pay for maintenance gets static HTML that will still work in 2035. A publisher that needs stories crawlable in seconds gets server rendering. The stack follows the constraint.

## Indexable by default, not as a later fix
Anything that should rank is server-rendered or statically generated. Structured data is emitted as part of the page, not bolted on through a plugin. One h1 per page, a real heading hierarchy, canonical URLs, a generated sitemap. This is cheaper to do on day one than to retrofit in month six, and the difference shows up in how quickly a new site starts getting crawled.

## The pipeline is part of the deliverable
You get a GitHub Actions workflow that runs lint, typecheck, unit tests, a production build, a dependency audit and a Lighthouse performance budget on every push, with preview deployments per branch. If a change would regress Core Web Vitals below the agreed budget, the build fails before anyone sees it.

## Questions about Web development
### Do you work with an existing codebase or only greenfield projects?
Both. Several projects in the portfolio were built around constraints that already existed — an editorial team that would not leave WordPress, a hosting account that was already paid for. Taking over an existing codebase starts with a short audit so we both know what we are dealing with before any code changes.

### How long does a typical web application take?
A focused marketing or consultation site is usually two to four weeks. A full application with authentication, a database and an admin surface is typically six to twelve weeks, delivered in working increments rather than as one launch date.

### Who owns the code?
You do, from the first commit. Work happens in your repository or is transferred to it at handover, along with environment documentation and a runnable local setup.
