# Dharmarthlabs CMS ↔ Code Hippies

A two-way, authenticated link between this site and the `codehippies` section
of the Dharmarthlabs CMS.

## Design decision, stated up front

The CMS can **read everything** and **write very little**, and that asymmetry is
deliberate.

Content on this site — case study claims, verified technology signals, service
descriptions, the 50 FAQ answers — lives in the repository under version
control. Every one of those claims was checked against a live site, and the
verification method is documented so anyone can re-run it. A network endpoint
that could silently rewrite those claims would convert an auditable record into
a liability: a wrong claim could appear with no commit, no author and no
history.

So the CMS controls **presentation, availability and cache**. It does not
control the record. If you want different content, that is a commit, and the
pipeline runs the tests.

## Authentication

Both directions are signed with HMAC-SHA256 over `timestamp.body` using
`CMS_SHARED_SECRET`.

```
x-ch-signature:  <hex digest of HMAC-SHA256(secret, `${timestamp}.${body}`)>
x-ch-timestamp:  <unix seconds>
```

- Requests older than **300 seconds** are rejected, so a captured request
  cannot be replayed later.
- The signature covers the body, so the payload cannot be swapped.
- Comparison is constant-time.
- **With `CMS_SHARED_SECRET` unset, every request is rejected.** A fresh deploy
  is closed by default rather than open.
- Rejection reasons are logged server-side and never returned — an attacker
  should not learn whether the secret is missing, the timestamp stale, or the
  digest wrong.

### Signing example (Node)

```js
import crypto from "node:crypto";

function sign(body, secret) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  return { signature, timestamp };
}

const body = JSON.stringify({ action: "revalidate", paths: ["/", "/work"] });
const { signature, timestamp } = sign(body, process.env.CMS_SHARED_SECRET);

await fetch("https://codehippies.com/api/cms/control", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-ch-signature": signature,
    "x-ch-timestamp": timestamp,
  },
  body, // the EXACT string that was signed
});
```

The signed bytes and the sent bytes must be identical. Re-serialising parsed
JSON changes key order and whitespace and will fail verification.

## Endpoints

### `GET /api/cms/health`

Liveness. Returns `{ ok: true, at }`.

### `GET /api/cms/snapshot`

Everything the dashboard needs to render an accurate picture of this site:

```jsonc
{
  "site":    { "name", "url", "founder", "generatedAt", "commit", "env" },
  "counts":  { "caseStudies", "services", "faqs", "faqCategories",
               "posts", "partnerRoutes", "activeChannels" },
  "routes":  ["/", "/work", "/work/uttaranchal-kesari", …],
  "caseStudies": [{ "slug", "name", "liveUrl", "category", "stack",
                    "verifiedSignals" }],
  "services":    [{ "slug", "name", "target" }],
  "faq":         [{ "category", "count" }],
  "partnerRoutes": [{ "id", "title", "ctaPath" }],
  "channels":      [{ "id", "label", "kind" }]
}
```

`commit` is the deployed Git SHA, so the dashboard can show exactly which build
is live.

### `POST /api/cms/control`

| Action | Body | Effect |
| --- | --- | --- |
| `revalidate` | `{ "action": "revalidate", "paths": ["/", "/work"] }` | Purges the ISR cache for those paths. Paths must be site-relative; absolute URLs are rejected. Max 50. |
| `revalidate_tag` | `{ "action": "revalidate_tag", "tags": ["case-studies"] }` | Purges by cache tag. Max 20. |
| `ping` | `{ "action": "ping", "note": "…" }` | Connectivity check that exercises the full signing path. |

Anything else returns `400 invalid_directive`.

## Telemetry: this site → CMS

When `CMS_TELEMETRY_URL` and `CMS_SHARED_SECRET` are both set, consented
analytics are forwarded with the same signature scheme:

```jsonc
{
  "source": "codehippies",
  "events": [{
    "name": "channel_click",          // closed enum, see src/lib/analytics/events.ts
    "path": "/work",                  // site-relative, never a full URL
    "session": "…",                   // random per-tab, dies with the tab
    "meta": { "channel": "whatsapp" },
    "consent": { "analytics": true, "attribution": true },
    "referrerHost": "google.com",     // host only, and only with attribution consent
    "campaign": "portfolio_funnel",   // only with attribution consent
    "country": "IN",                  // from edge headers, only with attribution consent
    "at": "2026-08-27T09:00:00.000Z"
  }]
}
```

### What is never forwarded

**No IP address.** It is used in memory to rate-limit and then discarded.
**No precise location** — country is the maximum granularity.
**No persistent identifier.** The session id lives in `sessionStorage` and dies
with the tab.
**No personal data without consent.** Consent is enforced on the server as well
as the client: if a visitor declined attribution, `referrerHost`, `campaign`
and `country` are stripped before anything leaves this site, regardless of what
the client sent.

This is less data than a covert setup would gather. It is also the version that
survives a GDPR or DPDP complaint, and the version an enterprise prospect can
look at without concern — which is worth more than the extra rows.

## Referral attribution

Outbound links to Dharmarthlabs carry UTM parameters
(`utm_source=codehippies&utm_medium=referral&utm_campaign=portfolio_funnel`)
plus a `partner_click` telemetry event naming which route was taken. The CMS
can therefore attribute a Dharmarthlabs lead back to the exact card on this
site that produced it.

## Building the CMS side

1. Generate a secret: `openssl rand -hex 32`. Set it as `CMS_SHARED_SECRET` in
   **both** Vercel and the CMS.
2. Set `CMS_TELEMETRY_URL` here to the CMS ingest endpoint.
3. Implement signature verification on the CMS side using the same scheme —
   reject anything older than 300 seconds, compare in constant time.
4. Verify end to end with `POST /api/cms/control` and `{"action":"ping"}`.
