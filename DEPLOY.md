# Deploying

The repository is production-ready as it stands. Nothing below is required to
get a working site online — every item is an upgrade, and anything unset simply
does not render rather than breaking.

## 1. One-click deploy

1. Go to [vercel.com/new](https://vercel.com/new) and **Import** this
   repository. Sign in with the GitHub account that owns it.
2. Vercel detects Next.js automatically. `vercel.json` already sets the build
   command (`npm run kb:build && npm run build`), the install command and the
   `bom1` region.
3. Click **Deploy**. You will have a live `*.vercel.app` URL in a couple of
   minutes.

That is the whole minimum path. The site works with **zero** environment
variables — the contact form logs briefs server-side, the AI assistant answers
extractively from its knowledge base, and unconfigured contact channels are
hidden rather than broken.

## 2. Custom domain

1. Buy the domain in **your own name**. This must be your account and your card
   — a domain registered to a contractor is a business risk, and it is also
   the one step nobody can do on your behalf without your legal identity and
   payment.
2. Vercel → Project → **Settings → Domains** → add `codehippies.com` and
   `www.codehippies.com`.
3. At your registrar, set the records Vercel shows you. Either works:
   - **Nameservers** (simplest): point the domain at Vercel's nameservers.
   - **Records**: `A` for the apex to Vercel's IP, `CNAME` for `www` to
     `cname.vercel-dns.com`.
4. TLS is issued automatically once DNS resolves. There is nothing to buy and
   nothing to renew.
5. Set `NEXT_PUBLIC_SITE_URL=https://codehippies.com` in the environment
   variables and redeploy — this drives canonical URLs, the sitemap, robots and
   every generated OG image, so it must match the real domain.

DNS usually propagates in minutes and can take up to 48 hours.

## 3. Environment variables

Vercel → Project → **Settings → Environment Variables**. Everything is optional;
add what you have. Full annotated list in [`.env.example`](./.env.example).

### Turn on your contact channels

| Variable | Example | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919876543210` | Floating button and every "message me" CTA. Digits only, with country code, no `+`. |
| `NEXT_PUBLIC_INSTAGRAM_HANDLE` | `codehippies` | Instagram DM and profile link. |
| `NEXT_PUBLIC_MESSENGER_ID` | `codehippies` | Facebook Messenger (`m.me/<id>`). |
| `NEXT_PUBLIC_FACEBOOK_PAGE` | `codehippies` | Facebook page link. |
| `NEXT_PUBLIC_TELEGRAM_HANDLE` | `deepakjoshi` | Telegram link. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@codehippies.com` | Email everywhere. |
| `NEXT_PUBLIC_PHONE_NUMBER` | `919876543210` | Click-to-call. |
| `NEXT_PUBLIC_LINKEDIN_URL` | full URL | LinkedIn. |
| `NEXT_PUBLIC_CAL_LINK` | `deepak/discovery` | Booking step on `/contact`. |

### Freelance marketplaces (shown on `/hire` and in the dock)

`NEXT_PUBLIC_FIVERR_URL`, `NEXT_PUBLIC_UPWORK_URL`,
`NEXT_PUBLIC_FREELANCER_URL`, `NEXT_PUBLIC_TOPTAL_URL`,
`NEXT_PUBLIC_CLUTCH_URL` — full profile URLs.

### Server-only (never prefixed `NEXT_PUBLIC_`)

| Variable | Purpose |
| --- | --- |
| `LEAD_WEBHOOK_URL` | Where contact briefs are delivered (Slack, Discord, Zapier, a CRM). **Set this before taking real traffic** — without it, briefs are only logged. |
| `ANTHROPIC_API_KEY` | Natural-language answers from the AI assistant. Without it the assistant still works and is still grounded, just less fluent. |
| `CMS_SHARED_SECRET` | Enables the Dharmarthlabs CMS link. Until set, the CMS endpoint rejects everything — see [`docs/CMS-INTEGRATION.md`](./docs/CMS-INTEGRATION.md). |
| `CMS_TELEMETRY_URL` | Where consented analytics are forwarded. |
| `CRON_SECRET` | Protects the search-distribution endpoint. Generate with `openssl rand -hex 32`. |
| `INDEXNOW_KEY` | IndexNow key. Generate with `openssl rand -hex 16`. |
| `GITHUB_TOKEN` | Optional, only raises the API rate limit for live stats on `/about`. A token with no scopes is enough. |

## 4. Your logo and favicon

See [`public/BRAND-ASSETS.md`](./public/BRAND-ASSETS.md). Short version:
overwrite `public/logo-mark.svg`, `public/icon.svg` and `src/app/icon.svg`, set
`NEXT_PUBLIC_HAS_CUSTOM_LOGO=true`, push. Nothing else changes.

## 5. Getting indexed

The site emits a sitemap, robots policy, RSS feed and full structured data on
every route from the first deploy. To accelerate discovery:

1. **Google Search Console** — add the property, verify by DNS (a TXT record at
   your registrar), submit `https://your-domain/sitemap.xml`. This is the only
   supported way to push Google, and it is free.
2. **Bing Webmaster Tools** — same process, and you can import directly from
   Search Console.
3. **IndexNow** — set `INDEXNOW_KEY` and `CRON_SECRET` above, then add
   `SITE_URL` and `CRON_SECRET` as **GitHub repository secrets**. The
   `distribution.yml` workflow then submits every URL to Bing, Yandex, Seznam
   and Naver every 72 hours, free and forever. It skips itself cleanly when the
   secrets are absent, so it never fails a fork's CI.

Honest note: **Google does not participate in IndexNow.** For Google the route
is the sitemap, good structure and content — all of which this site already
does. Anyone selling free instant Google indexing is selling something that
does not exist.

## 6. CI/CD

`.github/workflows/ci.yml` runs on every push: install, build the knowledge
base, lint, typecheck, 260 tests, production build, dependency audit, a secret
scan of the client bundle, and Lighthouse budgets on desktop and mobile. It
deploys to Vercel on `main` when `VERCEL_TOKEN`, `VERCEL_ORG_ID` and
`VERCEL_PROJECT_ID` are set as repository secrets — otherwise Vercel's own
GitHub integration handles deployment and the job skips with a notice.

`.github/workflows/preview.yml` deploys a preview on every pull request.

## 7. Pre-launch checklist

- [ ] `NEXT_PUBLIC_SITE_URL` matches the real domain
- [ ] At least one contact channel configured
- [ ] `LEAD_WEBHOOK_URL` set, and a test brief received
- [ ] Logo and favicon replaced
- [ ] Domain verified in Google Search Console, sitemap submitted
- [ ] `CRON_SECRET` + `INDEXNOW_KEY` set, and `SITE_URL` + `CRON_SECRET` added
      as GitHub secrets
- [ ] Rate limiting backed by a shared store if you expect real traffic
      (see `NOTES.md` — the in-memory limiter is per-instance on serverless)
