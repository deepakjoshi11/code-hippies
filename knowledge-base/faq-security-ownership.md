# Frequently asked questions: Security & ownership

Page: /faq

## Who owns the code you write?
You do, from the first commit. Work happens in your repository or is transferred to your organisation at handover, with full history, environment documentation and a local setup a new developer can run in under fifteen minutes.

## What security practices are included as standard?
Server-side input validation on every route that accepts input, CSRF protection and rate limiting on mutating endpoints, security headers including CSP and HSTS, no secrets in the client bundle, and dependency scanning in CI that fails the build on high and critical findings. These are part of the build, not a paid extra.

## Can you handle domain registration, SSL and SOC 2 for us?
SSL is automatic on the platforms used here and is handled as part of deployment. Domain registration and ICANN registrant verification require your legal identity and payment, so they stay in your name — with guidance through the process. SOC 2 and ISO 27001 require an accredited independent auditor; I implement and document the technical controls and prepare the evidence, but the audit itself cannot be automated by anyone, and I will not imply otherwise.

## Is my site GDPR or privacy-law compliant?
The technical controls are implemented — minimal data collection, no third-party sharing you have not agreed to, cookie and consent handling where analytics require it, and a documented record of what is collected and why. The policy text itself and the legal determination for your jurisdiction should come from a lawyer, not a developer, and I will tell you that rather than hand you a template and imply it is advice.

## What happens to my site if something happens to you?
Nothing, and that is the point of doing handover properly. The repository is in your organisation with full history, the README gets a new developer running locally in under fifteen minutes, architecture decisions are documented, and every credential is in your accounts rather than mine. If your business depends on being able to reach me, the handoff was done badly.
