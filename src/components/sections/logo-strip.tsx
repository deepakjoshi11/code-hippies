import { caseStudies, isLive } from "@/data/case-studies";

/**
 * Proof strip. These are live URLs, not logos — every one is clickable and
 * independently checkable, which is stronger evidence than a wordmark.
 */
export function LogoStrip() {
  const items = [...caseStudies, ...caseStudies];

  return (
    <section aria-labelledby="proof-strip-heading" className="border-b border-ink-100/8 py-8">
      <h2 id="proof-strip-heading" className="sr-only">
        Live production sites built by Code Hippies
      </h2>
      <div
        className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        aria-hidden="true"
      >
        <div className="flex shrink-0 gap-10 pr-10 motion-safe:animate-[marquee-x_45s_linear_infinite]">
          {items.map((c, i) => (
            <span
              key={`${c.slug}-${i}`}
              className="whitespace-nowrap font-mono text-sm text-ink-500"
            >
              {c.displayUrl}
            </span>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {caseStudies.filter(isLive).map((c) => (
          <li key={c.slug}>
            <a href={c.url} rel="noopener noreferrer">
              {c.name} — {c.displayUrl}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
