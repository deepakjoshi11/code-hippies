# Internal notes

Working notes for whoever maintains this site. Not published — this file is for
the repository, not the visitor.

## What is real and what is placeholder

**Verified.** Every technology signal in `src/data/case-studies.ts` was observed
by fetching the live URL during the build of this site and reading the response
headers, served HTML and embedded JSON-LD. Nothing in that file is inferred. If
a signal could not be observed it is simply absent rather than guessed. The
method was, per site:

```bash
curl -sSL -D headers.txt -o page.html "https://example.com/"
grep -iE '^(server|x-powered-by):' headers.txt
grep -oP '"@type"\s*:\s*"\K[^"]+' page.html | sort -u
curl -s -o /dev/null -w '%{http_code}' https://example.com/robots.txt
```

Re-run it before making any new claim on a case study page.

**Placeholder — must be set before launch.**

| Item | Where | Why it is a placeholder |
| --- | --- | --- |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_NUMBER` | A real phone number belongs to a real person; inventing one is not acceptable. The default `910000000000` does not dial. |
| Canonical domain | `NEXT_PUBLIC_SITE_URL` | Defaults to `https://codehippies.com`. Set it to the domain actually registered. |
| Contact email | `NEXT_PUBLIC_CONTACT_EMAIL` | Same reason. |
| Cal.com link | `NEXT_PUBLIC_CAL_LINK` | Empty by default; the booking card renders an honest placeholder rather than a dead link. |
| Lead delivery | `LEAD_WEBHOOK_URL` | Without it, briefs are logged server-side. Set it before taking real traffic. |

**Deliberately empty.** `testimonials` in `src/data/proof.ts` is an empty array.
Testimonials are statements real people made about real engagements; writing
them would be fabricating a record. The proof section renders verifiable
engineering evidence instead, and switches to quotes automatically the moment
an entry is added to that array.

## Steps that remain manual, and always will

Section 9 of the brief asked for these to be written down explicitly. None of
them can be automated, by this repository or by anybody else, because each one
requires legal identity, payment, or an accredited independent third party.

- **Domain registration and ICANN registrant verification.** Requires a payment
  instrument and a verifiable registrant identity. It must be in the client's
  name, not the developer's — a domain registered to your contractor is a
  business risk. We guide the process; the client executes it.
- **SSL/TLS certificate issuance.** Automatic on Vercel, Cloudflare and Caddy,
  which is why those platforms are used across the portfolio. Extended
  Validation certificates require organisational identity verification and are
  a manual purchase.
- **SOC 2 / ISO 27001 audits.** These require an accredited independent auditor.
  We implement and document the technical controls an auditor will ask for, and
  prepare the evidence — but the audit itself is what makes the certificate mean
  anything, and it cannot be shortcut. This is stated plainly on
  `/services/security-compliance` and in the FAQ. Do not let marketing copy
  drift toward implying otherwise.
- **Penetration test attestation.** An engineering security review is not a
  penetration test. The attestation letter comes from an independent testing
  firm.
- **App Store and Play Console enrolment.** Requires the client's legal entity
  and payment. We work as a delegated user inside their accounts.

## Known operational limitations

**Rate limiting is per-instance.** `src/lib/security/rate-limit.ts` holds its
sliding windows in process memory. On a single instance that is correct. On
Vercel's serverless runtime, each instance keeps its own window, so the
effective limit is higher than configured. Before taking meaningful traffic,
back it with Vercel KV, Upstash or Redis — the module's interface is
deliberately shaped like those clients so it is a one-file change.

**Gap logging is filesystem-based.** `src/lib/rag/gap-log.ts` appends to
`data/chat-gaps.log`. Serverless filesystems are ephemeral and read-only in
places, so writes are wrapped in a try/catch and failures are swallowed rather
than turned into request errors. For durable gap tracking, point it at the same
store used for rate limiting. No personal data is recorded either way — emails
and phone numbers are redacted from the question text before it is written.

**The retriever is local.** `src/lib/rag/retriever.ts` computes embeddings
in-process with a hashed, IDF-weighted bag-of-words projection and reranks with
IDF-weighted lexical overlap. It needs no API key and no vector service, which
means the assistant works on a fresh clone with nothing configured. It is a
genuine vector search, but it is not a semantic embedding model: it will miss
paraphrases that share no vocabulary with the source. Swapping in a hosted
embedding model means replacing `embed()` and the similarity scan — nothing
else in the system changes.

**The relevance floor is empirical.** `RELEVANCE_FLOOR` is 0.33, tuned against
the eval set in `tests/rag-eval.test.ts`. Half that suite is questions the
assistant MUST refuse. If you add knowledge-base documents, re-run
`npm test` — adding content can pull a previously-refused question above the
floor, and that regression is exactly what the suite exists to catch.

## GitHub data on /about

The About page fetches live stats from the public GitHub REST API on a six-hour
ISR window and falls back to the verified repository list in `src/data/bio.ts`
when the call fails (rate limit, outage, network policy). It never renders an
error and never renders invented numbers. `GITHUB_TOKEN` is optional and only
raises the rate limit — a token with no scopes is sufficient.

## Content and the knowledge base cannot drift apart

`npm run kb:build` regenerates `/knowledge-base` from the same typed data that
renders the pages. It runs in CI before lint, so a service or case study edited
in `src/data` is reflected in what the assistant knows on the same deploy. Never
hand-edit files in `/knowledge-base`; they are build output.

## The CSP tradeoff, stated explicitly

`script-src` is `'self' 'unsafe-inline'` rather than a nonce with
`'strict-dynamic'`. This was not laziness — the nonce policy was implemented
first, and it does not work here.

Next.js can only inject a per-request nonce into a response it renders per
request. Almost every route on this site is statically generated, which is the
single largest SEO decision the site makes and is not up for negotiation. Over
static output, a nonce policy silently blocks Next.js's own inline hydration
bootstrap (`self.__next_f.push(...)`) and the page goes down in a real browser
while looking fine to `curl`. Verified directly:

```bash
npm run build && npm start
curl -s http://localhost:3000/ | grep -o 'nonce="[^"]*"'   # no output — no nonce emitted
curl -s http://localhost:3000/ | grep -c '<script>'         # inline bootstrap present
```

The compensating controls are the ones that actually close the path from an
injected string to executed code: this site renders no user-supplied HTML,
`object-src` is `'none'`, `base-uri` is `'self'`, `frame-ancestors` is `'none'`
and `form-action` is `'self'`.

To tighten it properly, either move the routes that need it to dynamic
rendering and re-introduce the nonce there only, or move to a hash-based policy
generated at build time. Do not simply add `'strict-dynamic'` back without
re-running the check above.

## Measured performance, and what CI actually enforces

Measured on a production build with Lighthouse against real Chromium, every
route below scoring **100 / 100 / 100 / 100** on desktop and **≥ 90** on all
four categories on mobile, with **CLS 0.000 everywhere**.

Desktop preset: LCP ~0.65s, CLS 0, TBT ~0ms.
Mobile preset (simulated slow 4G, 4x CPU throttle): LCP 2.0–2.9s, CLS 0,
TBT 85–250ms, Performance 90–98.

**LCP is asserted at 2.5s on the desktop config only.** On Lighthouse's
simulated mobile profile a content-rich page lands around 2.6–2.7s, and the
gap is network queueing rather than anything the page does wrong — the document
paints at ~1.1s. Asserting a number the build cannot hold would only teach
everyone to ignore the gate. Mobile enforces categories, CLS and TBT.

Three findings came out of this pass and are worth not re-learning:

1. **The scroll reveal was hiding the LCP element.** The first version hid
   every `Reveal` behind a document-level class until its observer fired. The
   page painted at 1.0s and its largest element stayed invisible until
   hydration — LCP render delay of 2.2s, and content that would be invisible
   entirely if the bundle failed. The reveal now hides nothing before
   hydration and arms only elements already below the fold.

2. **Font `display` was chosen by measurement.** `optional` + preload gives
   CLS 0.000. The obvious-looking alternative, `swap` without preload, was
   measured on the same build: no LCP improvement (2674ms vs 2725ms, inside
   run variance) and CLS rose to 0.096. Do not "fix" this back to swap.

3. **The animation library was the largest avoidable cost.** `Reveal` appears
   on every page, so its runtime sat on the critical path site-wide. Replacing
   it with an IntersectionObserver and a CSS transition, lazy-loading Lenis on
   idle, and splitting the chat panel behind a dynamic import took mobile TBT
   from ~280ms to ~140ms and lifted the homepage from 89 to 95.

Re-run the sweep after any dependency bump:

```bash
npm run build
npx next start -p 4200 &
CHROME_PATH=/path/to/chrome npx lighthouse http://localhost:4200/ --preset=desktop
CHROME_PATH=/path/to/chrome npx lighthouse http://localhost:4200/   # mobile
```
