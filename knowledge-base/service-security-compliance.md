# Service: Security & compliance consulting

Page: /services/security-compliance

## What this service is
OWASP-grade hardening, dependency hygiene and honest compliance advice. Application security review against the OWASP Top 10, security headers, dependency scanning in CI, and straight guidance on what compliance work you can automate and what genuinely requires auditors and money.

## What you get
- Review against the OWASP Top 10 with reproducible findings
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Server-side input validation and output encoding on every mutating route
- CSRF protection and rate limiting on public endpoints
- Dependency scanning wired into CI, failing the build on high and critical findings
- Secrets audit — nothing sensitive reaching the client bundle

## Technology options
- Application: Input validation (zod), Output encoding, CSRF tokens, Rate limiting, Session hardening
- Transport: Strict-Transport-Security, Content-Security-Policy, Referrer-Policy, Permissions-Policy
- Supply chain: npm audit in CI, Lockfile discipline, Runtime version currency

## Typical engagement length
One-week review and hardening pass; ongoing coverage under a retainer.

## Most breaches are boring, and so is preventing them
Unvalidated input, a mutating endpoint with no CSRF token, an unauthenticated form with no rate limit, a secret that ended up in the client bundle, a runtime three major versions past end of life. The work is checking each of these deliberately rather than assuming the framework did it. One portfolio project runs PHP 8.2.30 specifically because a supported runtime that still receives patches is a security control, not a preference.

## Validate on the server, always
Client-side validation is a user-experience feature. Every schema on this site is defined once with zod and enforced again inside the route handler, because the client is not a trust boundary. That is also why every mutating route here is CSRF-protected and rate-limited by IP.

## What I will not pretend to automate
Domain registration, ICANN registrant verification, EV certificate issuance, SOC 2 and ISO 27001 audits, penetration test attestation letters — these require legal identity, payment and independent third parties. I will scope them, prepare the evidence, implement the technical controls an auditor will ask for, and tell you plainly what it costs and how long it takes. What I will not do is imply that a script can produce a compliance certificate.

## Questions about Security & compliance consulting
### Is this a penetration test?
No. This is an engineering review: reading the code and configuration, checking controls against the OWASP Top 10, and fixing what is found. A formal penetration test with an attestation letter comes from an independent testing firm, and I will help you scope and prepare for one.

### Can you get us SOC 2 compliant?
I can implement and document the technical controls an auditor will look for, and prepare the evidence. The audit itself must be performed by an accredited third-party firm — that is what makes the certificate mean anything. Anyone claiming to automate the audit is describing the preparation, not the audit.

### How often should dependencies be scanned?
On every push, as a build step that fails on high and critical findings. A monthly manual check means you are, on average, two weeks behind a published exploit.
