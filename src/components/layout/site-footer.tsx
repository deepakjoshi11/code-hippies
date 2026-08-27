import Link from "next/link";
import { services } from "@/data/services";
import { caseStudies } from "@/data/case-studies";
import { site, whatsappHref } from "@/lib/site";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-100/10 bg-ink-900/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-ink-50">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-accent-600 font-mono text-sm font-bold text-ink-950"
            >
              ch
            </span>
            Code Hippies
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-ink-300">
            Deepak Joshi&rsquo;s engineering studio. Full-stack web, iOS and Android, and AI/LLM
            systems for startups and agencies.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a
              className="text-brand-400 underline underline-offset-4"
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a className="text-ink-300 underline-offset-4 hover:text-ink-50 hover:underline" href={`mailto:${site.email}`}>
              Email
            </a>
            <a
              className="text-ink-300 underline-offset-4 hover:text-ink-50 hover:underline"
              href={site.github.primary}
              target="_blank"
              rel="noopener noreferrer me"
            >
              GitHub
            </a>
          </div>
        </div>

        <FooterColumn title="Services">
          {services.map((s) => (
            <FooterLink key={s.slug} href={`/services/${s.slug}`}>
              {s.navLabel}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Selected work">
          {caseStudies.slice(0, 7).map((c) => (
            <FooterLink key={c.slug} href={`/work/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
          <FooterLink href="/work">All case studies &rarr;</FooterLink>
        </FooterColumn>

        <FooterColumn title="Studio">
          <FooterLink href="/about">About Deepak Joshi</FooterLink>
          <FooterLink href="/process">How projects run</FooterLink>
          <FooterLink href="/pricing">Engagement models</FooterLink>
          <FooterLink href="/blog">Blog</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
          <FooterLink href="/contact">Start a project</FooterLink>
        </FooterColumn>
      </div>

      <div className="border-t border-ink-100/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name} &middot; Deepak Joshi. All rights reserved.
          </p>
          <p>
            Built with Next.js. Budget enforced in CI on every push:{" "}
            <span className="font-mono">
              Lighthouse &ge; 90 &middot; LCP &lt; 2.5s &middot; CLS &lt; 0.1 &middot; TBT &lt; 200ms
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink-500">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-ink-300 transition-colors hover:text-ink-50">
        {children}
      </Link>
    </li>
  );
}
