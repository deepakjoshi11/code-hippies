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

## 2. Custom domain — DNS stays at Wix

Wix does not allow the nameserver change on this domain, so DNS is managed **in
the Wix DNS manager** and simply points at Vercel. This works exactly as well —
it just means every record below must exist in Wix, because that is what
answers queries for the domain.

> The records staged in Vercel's own DNS zone are **inert** while the
> nameservers stay at Wix. They do no harm and become active automatically if
> you ever move nameservers, but they are not serving anything today.

### Current state, verified

| Host | Status |
| --- | --- |
| `codehippies.com` | ✅ **Live** — A record already points at Vercel, returns the site |
| `www.codehippies.com` | ❌ Still points at `cdn3.wixdns.net`, returns a Wix error |

Vercel confirms the apex: `"configuredBy":"A"`, `"misconfigured":false`.

### The complete record set for Wix

Add or edit these in **Wix → Domains → codehippies.com → DNS Records**.

#### Website

| Type | Host | Value | TTL | Status |
| --- | --- | --- | --- | --- |
| `A` | `@` | `216.198.79.1` | 3600 | ✅ already set |
| `CNAME` | `www` | `b271df34aeb21863.vercel-dns-017.com` | 3600 | ⚠️ **change this** — currently `cdn3.wixdns.net` |

`www` is the only website record left to fix. If Wix rejects that CNAME value,
use `cname.vercel-dns.com` instead — Vercel accepts both.

A second A record `64.29.17.1` may be added alongside the first for redundancy.
Optional; one is sufficient.

#### Email — forwarding to codehippies@gmail.com

| Type | Host | Priority | Value | TTL |
| --- | --- | --- | --- | --- |
| `MX` | `@` | `10` | `mx1.forwardemail.net` | 3600 |
| `MX` | `@` | `20` | `mx2.forwardemail.net` | 3600 |

> Forward Email's docs specify priority `0` for both. Some DNS managers,
> including Wix, will not accept `0` — `10` and `20` work identically here,
> because what matters is that mx1 is tried before mx2.

**Remove any existing Wix MX records first.** Two mail providers competing for
the same domain is how mail goes missing.

#### TXT records

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| `TXT` | `@` | `forward-email=hello:codehippies@gmail.com,contact:codehippies@gmail.com,deepak:codehippies@gmail.com,security:codehippies@gmail.com` | 3600 |
| `TXT` | `@` | `v=spf1 a include:spf.forwardemail.net include:_spf.google.com ~all` | 3600 |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:codehippies@gmail.com; fo=1` | 3600 |

Both apex `TXT` records must exist **as separate records** — do not merge them
into one string. SPF and the forwarding config are read by different systems.

#### CAA — optional

| Type | Host | Value |
| --- | --- | --- |
| `CAA` | `@` | `0 issue "letsencrypt.org"` |
| `CAA` | `@` | `0 issue "pki.goog"` |
| `CAA` | `@` | `0 issue "sectigo.com"` |

These restrict which certificate authorities may issue for the domain. If Wix
does not offer a CAA type, skip them — absence means any CA may issue, which is
the default and is not a problem.

### Verify after saving

```bash
for t in A CNAME MX TXT; do
  curl -s -H "accept: application/dns-json" \
    "https://cloudflare-dns.com/dns-query?name=codehippies.com&type=$t" | jq -r '.Answer[]?.data'
done
curl -s -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=www.codehippies.com&type=CNAME" | jq -r '.Answer[]?.data'

curl -sL -o /dev/null -w "apex %{http_code}\n" https://codehippies.com/
curl -sL -o /dev/null -w "www  %{http_code}\n" https://www.codehippies.com/
```

Both should return `200`. Then send a real message to `hello@codehippies.com`
from an outside address and confirm it arrives — DNS resolving is not the same
as mail being delivered.

## 2b. Email on the domain — done

`hello@codehippies.com` and three other addresses forward into
`codehippies@gmail.com`, free and permanently, using
[Forward Email](https://forwardemail.net) — open source, and configurable
entirely through DNS with no account to create.

**The records are already in the Vercel zone.** They activate the moment the
nameservers move (§2). Nothing else to set up.

### What is configured

| Type | Name | Value |
| --- | --- | --- |
| `MX` | `@` | `mx1.forwardemail.net` (priority 0) |
| `MX` | `@` | `mx2.forwardemail.net` (priority 0) |
| `TXT` | `@` | `forward-email=hello:…,contact:…,deepak:…,security:…` |
| `TXT` | `@` | `v=spf1 a include:spf.forwardemail.net include:_spf.google.com ~all` |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:codehippies@gmail.com; fo=1` |

Working addresses, all landing in the same Gmail inbox:

- `hello@codehippies.com` — the general address, used across the site
- `contact@codehippies.com`
- `deepak@codehippies.com`
- `security@codehippies.com` — referenced in `SECURITY.md`

Adding another is a one-line edit to the `forward-email=` record.

### Why these specific values

**No catch-all.** A catch-all (`forward-email=codehippies@gmail.com` with no
alias prefix) accepts mail to *any* address at the domain, which spammers find
and exploit within weeks. Named aliases only.

**SPF includes Google as well as Forward Email.** Forward Email authorises
inbound forwarding; `_spf.google.com` authorises Gmail to send *as*
`hello@codehippies.com` once you set that up below. Without it, your outgoing
mail fails SPF and lands in spam.

**SPF ends `~all`, not `-all`.** Forward Email's docs suggest `-all` (hard
fail). `~all` (soft fail) is the safer starting point: if you later send
through a newsletter tool or CRM and forget to add it here, `~all` marks the
mail while `-all` rejects it outright. Tighten to `-all` once you are certain
of everything that sends on your behalf.

**DMARC at `p=none`.** Monitor mode — nothing is rejected yet, and aggregate
reports arrive at your Gmail. Once those reports show your legitimate mail
passing, move to `p=quarantine`, then `p=reject`. Starting at `p=reject` is how
people silently lose their own email.

### To send *from* hello@codehippies.com

Forwarding is receive-only on the free plan, but Gmail can still send as the
address at no cost:

1. Gmail → **Settings → Accounts and Import → Send mail as → Add another email address**
2. Enter `hello@codehippies.com`, tick **Treat as an alias**
3. Gmail emails a confirmation code — the forwarding above delivers it to your inbox
4. Enter the code. You can now pick that address in the *From* dropdown.

The SPF record already authorises Google, so this passes authentication.

### One honest trade-off

On Forward Email's free plan the forwarding configuration lives in a **public
TXT record**, so `codehippies@gmail.com` is visible to anyone who queries your
DNS. Their paid plan hides it.

In this case it changes nothing: that address is already published on the
contact page, in the footer and in `llms.txt`. If you later want it private,
their paid plan or Google Workspace both solve it.

### Verify once nameservers have moved

```bash
curl -s -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=codehippies.com&type=MX" | jq -r '.Answer[].data'
curl -s -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=codehippies.com&type=TXT" | jq -r '.Answer[].data'
```

Then send a real message from an outside address to `hello@codehippies.com` and
confirm it arrives. DNS resolving is not the same as mail being delivered —
test it before putting the address on anything printed.

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
- [x] `NEXT_PUBLIC_CONTACT_EMAIL` set to codehippies@gmail.com
- [x] Domain email configured — MX, SPF, DMARC and forwarding aliases in Vercel (§2b)
- [ ] After nameservers move: send a real test email to hello@codehippies.com
- [x] Apex A record points at Vercel — codehippies.com is live
- [ ] `www` CNAME changed in Wix from cdn3.wixdns.net to Vercel (see §2)
- [ ] MX, SPF, forwarding and DMARC records added in Wix (see §2)
- [ ] At least one contact channel configured
- [ ] `LEAD_WEBHOOK_URL` set, and a test brief received
- [ ] Logo and favicon replaced
- [ ] Domain verified in Google Search Console, sitemap submitted
- [ ] `CRON_SECRET` + `INDEXNOW_KEY` set, and `SITE_URL` + `CRON_SECRET` added
      as GitHub secrets
- [ ] Rate limiting backed by a shared store if you expect real traffic
      (see `NOTES.md` — the in-memory limiter is per-instance on serverless)
