## What changed

<!-- One or two sentences. What is different after this merges? -->

## Why

<!-- The problem, not the solution. If it fixes an issue, link it. -->

## How to verify

<!-- The commands or steps a reviewer runs to see it working. Be specific. -->

```bash
npm test
npm run build
```

## Checks

- [ ] `npm test` passes
- [ ] `npm run lint` and `npm run typecheck` pass
- [ ] `npm run audit:quality` passes against a production build, if this touches
      rendering, links, layout or metadata
- [ ] No new claim about a client's technology that was not read off the live
      response — see `NOTES.md` for the verification method
- [ ] No secret behind a `NEXT_PUBLIC_` variable
- [ ] `npm run kb:build` re-run, if `src/data` changed

## Anything a reviewer should push back on

<!-- Trade-offs you made, shortcuts you took, things you were unsure about.
     This section being empty on a non-trivial change is usually a sign it was
     not filled in honestly. -->
