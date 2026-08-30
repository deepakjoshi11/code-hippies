# Security policy

## Reporting a vulnerability

Report privately first. Please do not open a public issue for anything
exploitable.

**Preferred:** [GitHub private vulnerability reporting](https://github.com/deepakjoshi11/code-hippies/security/advisories/new)
— it is encrypted, threaded, and gives you a CVE if one is warranted.

**Alternative:** email `hello@codehippies.com`, or the contact form at
https://codehippies.com/contact with "security" in the message. Both reach me
directly; the form is server-validated and rate-limited.

### What to expect

| Stage | Target |
| --- | --- |
| Acknowledgement | Within 2 business days |
| Initial assessment | Within 5 business days |
| Fix for a confirmed high or critical issue | Within 14 days, or a stated reason why longer |
| Public disclosure | Coordinated with you, after a fix ships |

I will tell you honestly if I judge a report not to be a vulnerability, and
why. If you disagree, say so — I would rather re-examine it than be wrong
quietly.

Credit is given in the release notes unless you prefer otherwise.

## Scope

**In scope:** this repository and the site it deploys — codehippies.com and its
Vercel deployments. Particularly the API routes under `src/app/api/`, which are
the only paths that accept input.

**Out of scope:**

- The 13 client sites linked from the portfolio. They belong to their owners,
  are not covered by this policy, and must not be tested. Report anything you
  notice to me and I will pass it on.
- Denial of service, volumetric testing, or anything that degrades service for
  real visitors.
- Findings from automated scanners with no demonstrated impact.
- Missing headers or best practices with no exploitable consequence — worth
  mentioning, but they are hardening suggestions rather than vulnerabilities.
- Social engineering, physical access, or attacks on third-party platforms
  (Vercel, GitHub, Google).

Please stay within your own test data. Do not access, modify or exfiltrate
anything belonging to anyone else.

## What is already implemented

Documented so you can skip re-reporting known controls:

- Server-side validation with Zod on every route that accepts input; the
  client is never treated as a trust boundary.
- Double-submit CSRF tokens on mutating routes, compared in constant time,
  with a 300-second replay window on signed CMS requests.
- Per-IP rate limiting on the contact, chat, telemetry and distribution
  endpoints. **Known limitation:** the limiter is in-process, so on serverless
  the effective limit is per-instance. This is documented in `NOTES.md` and
  should be backed by a shared store before heavy traffic.
- Security headers via `src/proxy.ts`: CSP, HSTS, X-Frame-Options, nosniff,
  Referrer-Policy, Permissions-Policy. The CSP widens only for measurement
  providers that are actually configured.
- **CSP uses `script-src 'self' 'unsafe-inline'` rather than a nonce.** This is
  a known, deliberate trade-off — Next.js cannot inject a nonce into
  statically generated routes, and a nonce policy over static output blocks its
  own hydration bootstrap. The reasoning and compensating controls are in
  `NOTES.md`. A concrete XSS bypass is still very much worth reporting.
- No secrets behind `NEXT_PUBLIC_`; CI greps the built client bundle for
  secret-shaped strings and fails on a hit.
- `npm audit` in CI fails the build on high or critical advisories, for both
  production and dev dependency graphs.
- The CMS control endpoint is closed by default: with no shared secret set,
  every request is rejected.

## Supported versions

Only the current deployment from `main` is supported. There are no maintained
release branches.
