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

## 2. Custom domain — codehippies.com

The Vercel side is **already done**. `codehippies.com` and `www.codehippies.com`
are attached to the project, verified, and the DNS zone is fully built:

| Type | Name | Value | Purpose |
| --- | --- | --- | --- |
| `ALIAS` | `@` | `b271df34aeb21863.vercel-dns-017.com` | Apex → the deployment |
| `ALIAS` | `*` | `cname.vercel-dns-017.com` | Wildcard, covers `www` and any future subdomain |
| `CAA` | `@` | `0 issue "letsencrypt.org"` | Authorises Let's Encrypt to issue TLS |
| `CAA` | `@` | `0 issue "pki.goog"` | Authorises Google Trust Services |
| `CAA` | `@` | `0 issue "sectigo.com"` | Authorises Sectigo |

Nothing needs creating. The single remaining step is at the registrar.

### The one manual step: point the nameservers at Vercel

The domain currently answers from Wix:

```
codehippies.com.  NS  ns8.wixdns.net.
codehippies.com.  NS  ns9.wixdns.net.
```

Change them, in the Wix account that owns the domain, to:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**In Wix:** Domains → select `codehippies.com` → **Advanced** →
**Connect to an external DNS provider** (sometimes shown as "Change your
nameservers" or "Point to another provider") → paste both nameservers → save.
Wix will warn that its own services will stop resolving. That is expected and
correct — the site is served by Vercel now.

### This switch is safe, and here is why

Before recommending it, the live zone was queried for anything that would
break. There is nothing to lose:

| Record type | Currently present | Consequence of switching |
| --- | --- | --- |
| `MX` | **None** | No email on this domain, so no mail can break |
| `TXT` | **None** | No SPF, no DMARC, no domain-verification records |
| `AAAA` | None | — |
| Subdomains | `www` only | Covered by the wildcard `ALIAS` already in Vercel |

Verified with:

```bash
for t in NS A AAAA MX TXT SOA; do
  curl -s -H "accept: application/dns-json" \
    "https://cloudflare-dns.com/dns-query?name=codehippies.com&type=$t"
done
```

If you ever **do** add email to this domain, add the MX records in Vercel
(Project → Settings → Domains → DNS Records), not at Wix — once nameservers
move, Wix's DNS panel no longer controls anything.

### After the switch

Propagation is usually minutes and can take up to 48 hours. TLS is issued
automatically once the nameservers resolve; there is nothing to buy or renew.

Check progress:

```bash
# Should return ns1/ns2.vercel-dns.com once propagated
curl -s -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=codehippies.com&type=NS" | jq -r '.Answer[].data'

# Should return 200 and the site title
curl -sL -o /dev/null -w "%{http_code}\n" https://codehippies.com/
```

Or ask Vercel directly:

```bash
npx vercel domains inspect codehippies.com
```

Both nameserver columns matching means it is done.

### Why nameservers rather than an A record

Either works. Moving the nameservers hands the whole zone to Vercel, which is
what you want here: DNS is then managed in one place alongside the deployment,
the wildcard covers future subdomains automatically, and TLS renewal needs no
coordination. Keeping DNS at Wix and pointing only an `A` record would work
too, but leaves the zone split across two providers — which is how records get
lost during the next change.

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

- [x] `NEXT_PUBLIC_SITE_URL` set to https://codehippies.com
- [ ] Nameservers switched at Wix to ns1/ns2.vercel-dns.com (see §2)
- [ ] At least one contact channel configured
- [ ] `LEAD_WEBHOOK_URL` set, and a test brief received
- [ ] Logo and favicon replaced
- [ ] Domain verified in Google Search Console, sitemap submitted
- [ ] `CRON_SECRET` + `INDEXNOW_KEY` set, and `SITE_URL` + `CRON_SECRET` added
      as GitHub secrets
- [ ] Rate limiting backed by a shared store if you expect real traffic
      (see `NOTES.md` — the in-memory limiter is per-instance on serverless)
