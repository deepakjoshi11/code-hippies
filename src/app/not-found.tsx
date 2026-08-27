import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { caseStudies } from "@/data/case-studies";
import { services } from "@/data/services";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section className="py-24 md:py-32">
      <p className="font-mono text-sm text-brand-400">404</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.025em] text-ink-50 md:text-5xl">
        That page does not exist.
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-300">
        Either the URL is wrong or something moved. Here is everything that does exist.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/work" variant="outline">
          See the case studies
        </ButtonLink>
      </div>

      <div className="mt-14 grid gap-8 border-t border-ink-100/10 pt-10 md:grid-cols-2">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">Services</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-sm text-ink-300 hover:text-brand-400">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">Work</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {caseStudies.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`} className="text-sm text-ink-300 hover:text-brand-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
