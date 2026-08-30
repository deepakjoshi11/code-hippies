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
| `www.codehippies.com` | ✅ **Live** — CNAME points at Vercel; 308-redirects to the apex |

Vercel confirms the apex: `"configuredBy":"A"`, `"misconfigured":false`.

`www` is configured in Vercel as a **308 redirect to `codehippies.com`**, path
preserved (`/work` → `/work`). Without it both hosts served the full site and
every page existed at two URLs. The apex is canonical everywhere — `sitemap.xml`,
`robots.txt` `Host:`, `<link rel="canonical">` and `og:url` all agree.

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

#### Email — forwarding to codehippies11@gmail.com

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
| `TXT` | `@` | `forward-email=hello:codehippies11@gmail.com,contact:codehippies11@gmail.com,deepak:codehippies11@gmail.com,security:codehippies11@gmail.com` | 3600 |
| `TXT` | `@` | `v=spf1 include:spf.forwardemail.net include:_spf.google.com ~all` | 3600 |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:codehippies11@gmail.com; fo=1` | 3600 |
| `TXT` | `@` | `google-site-verification=4z-bWzOR4n_xaSW5hdacjR9G1EnVmwttS8Db0vDkyoc` | 3600 |

All three apex `TXT` records must exist **as separate records** — do not merge
them into one string. SPF, the forwarding config and Google's verification are
read by three different systems, and a merged string satisfies none of them.

The Google record is optional but worth adding. The site already serves a
`<meta name="google-site-verification">` on every route, which is enough to
verify the **URL-prefix** property `https://codehippies.com`. The DNS record
verifies the **Domain** property instead, which covers the apex, `www` and any
future subdomain in one place, and survives a redesign that drops the meta tag.
Neither method grants Google any access beyond reading what is already public.

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
`codehippies11@gmail.com`, free and permanently, using
[Forward Email](https://forwardemail.net) — open source, and configurable
entirely through DNS with no account to create.

**DNS is served by Wix** (`ns8`/`ns9.wixdns.net`) — the nameserver move in §2
did not happen, so these records must be entered in the Wix DNS manager. The
copies in the Vercel zone are inert and are not what the internet reads.

**Current live state:** MX, forwarding, SPF and DMARC are all live in Wix, but
with `hello:` as the only alias, and the SPF is missing
`include:_spf.google.com`. Verify with `dig` before trusting this table.

### What is configured

| Type | Name | Value |
| --- | --- | --- |
| `MX` | `@` | `mx1.forwardemail.net` (priority 10) |
| `MX` | `@` | `mx2.forwardemail.net` (priority 20) |
| `TXT` | `@` | `forward-email=hello:…,contact:…,deepak:…,security:…` |
| `TXT` | `@` | `v=spf1 include:spf.forwardemail.net include:_spf.google.com ~all` |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:codehippies11@gmail.com; fo=1` |

Addresses, all landing in the same Gmail inbox:

- `hello@codehippies.com` — ✅ **live**; the general address, used across the
  site and in `SECURITY.md`
- `contact@`, `deepak@`, `security@` — ⚠️ **not live.** The Wix TXT record
  currently reads `forward-email=hello:codehippies11@gmail.com` only, so mail to
  these bounces. Extend the record to enable them:

  ```
  forward-email=hello:codehippies11@gmail.com,contact:codehippies11@gmail.com,deepak:codehippies11@gmail.com,security:codehippies11@gmail.com
  ```

Adding another is a one-line edit to the `forward-email=` record. Nothing in
the repo may advertise an address that is not in it — a published contact that
bounces is worse than no published contact.

### Why these specific values

**No catch-all.** A catch-all (`forward-email=codehippies11@gmail.com` with no
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

### To send *from* hello@codehippies.com — free

The DNS side is already done: SPF authorises Google to send for this domain
(`include:_spf.google.com`). The rest is a setting inside your own Gmail
account, which cannot be automated from outside it.

**Prerequisite:** the forwarding records must be live in Wix first. Gmail
verifies the address by emailing a code to it — if forwarding is not working,
the code never arrives and setup cannot complete.

1. Gmail → ⚙ → **See all settings** → **Accounts and Import**
2. Under *Send mail as*, click **Add another email address**
3. Name: `Deepak Joshi` (or `Code Hippies`)
   Email: `hello@codehippies.com`
   Leave **Treat as an alias** ticked
4. Click **Next Step** → **Send Verification**
5. The code arrives in your Gmail inbox via the forwarding. Enter it.
6. Back in *Accounts and Import*, set **When replying to a message** →
   *Reply from the same address the message was sent to*

You can now pick `hello@codehippies.com` in the **From** dropdown on any new
message, and replies to mail sent to that address use it automatically.

#### One caveat worth knowing before you use it commercially

Sending this way routes through Google's consumer servers. Google's own
documentation notes that recipients may sometimes still see your `@gmail.com`
address, and messages can be shown as sent *via* gmail.com.

More importantly for deliverability: DMARC requires either SPF or DKIM to
*align* with the domain in the `From` header. When a consumer Gmail account
sends as a custom-domain alias, that alignment is not guaranteed — which is
precisely why the DMARC policy here starts at `p=none`. Nothing gets rejected,
but some recipients may filter more aggressively than they would for mail sent
through a provider that signs for your domain.

**Test it before it matters.** Send a message from `hello@codehippies.com` to
a free checker such as [mail-tester.com](https://www.mail-tester.com) and read
the SPF, DKIM and DMARC lines. If the score is poor and you are sending
business mail at volume, move to one of these:

| Option | Cost | What it fixes |
| --- | --- | --- |
| Zoho Mail free plan | Free, up to 5 users | Real mailboxes on your domain with proper DKIM signing |
| Forward Email paid SMTP | Low monthly | Keeps this exact setup, adds aligned sending |
| Google Workspace | ~$6/user/month | Real Gmail mailbox, full alignment, admin controls |

For low-volume enquiry replies — which is what this address is for — the free
route is fine. Verify it rather than assume it.

### One honest trade-off

On Forward Email's free plan the forwarding configuration lives in a **public
TXT record**, so `codehippies11@gmail.com` is visible to anyone who queries your
DNS. Their paid plan hides it.

This is a real exposure, not a cosmetic one. The site publishes
`hello@codehippies.com` everywhere — the contact page, the footer and
`llms.txt` — and never the gmail address, so DNS is the only place the two are
linked. Anyone running `dig TXT codehippies.com` sees the private inbox behind
the public alias, and address harvesters do exactly that.

The `_dmarc` `rua=` address is public for the same reason, and DMARC reports
also arrive at it.

If that matters, Forward Email's paid plan hides the mapping, and Google
Workspace removes the forwarding hop entirely. Neither is required for the
setup to work.

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
- [x] `NEXT_PUBLIC_CONTACT_EMAIL` set to hello@codehippies.com (verified in the
      rendered page, not just the dashboard) — the gmail address is the private
      forwarding destination and is never shown on the site
- [x] Domain email configured — MX, SPF, DMARC and forwarding aliases in **Wix** (§2b)
- [ ] After Wix records are live: send a real test email to hello@codehippies.com
- [ ] Gmail "Send mail as" configured for hello@codehippies.com (see §2b)
- [ ] Outgoing mail scored at mail-tester.com
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
