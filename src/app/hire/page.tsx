import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { buildChannels } from "@/data/channels";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Hire Me — Direct, or Through Fiverr & Upwork",
  description:
    "Three ways to engage: directly with a contract, through a marketplace with escrow protection if you would rather have a platform holding the money, or as a partnership for larger work.",
  path: "/hire",
  keywords: [
    "hire freelance full-stack developer",
    "Fiverr web developer India",
    "Upwork Next.js developer",
    "hire developer with escrow protection",
  ],
  ogTitle: "Three ways to hire me",
});

const hireFaqs = [
  {
    q: "Is it cheaper to hire you directly than through a marketplace?",
    a: "Usually, yes — marketplaces take a commission and that shows up somewhere in the price. What you give up by going direct is the platform's escrow and dispute process. For a first engagement with someone you have not worked with, that protection is often worth the margin, and I would rather you felt safe than saved 10%.",
  },
  {
    q: "Why would I use Fiverr or Upwork instead of just emailing you?",
    a: "Because you do not know me yet. A marketplace holds your money until you approve the work, keeps a permanent record of the agreement, and gives you a dispute process that does not depend on my goodwill. If that makes a first project feel safer, use it — the work is identical either way.",
  },
  {
    q: "Do you do the same quality of work on a marketplace?",
    a: "The same. Same process, same CI pipeline, same security review, same handover. The only difference is who holds the money and who arbitrates if something goes wrong.",
  },
  {
    q: "What if I want to start on a marketplace and move to direct later?",
    a: "That is the common path and it is fine by me. People typically run a first scoped project through a platform, then work directly once the relationship is established. There is no lock-in either way — you own the code from the first commit regardless of how the work was contracted.",
  },
];

export default function HirePage() {
  const marketplaces = buildChannels().filter((c) => c.kind === "marketplace");
  const direct = buildChannels().filter((c) => c.kind === "messaging" || c.kind === "direct");
  const trail = [
    { name: "Home", path: "/" },
    { name: "Hire", path: "/hire" },
  ];

  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(trail), faqSchema(hireFaqs))} />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs trail={trail} />
        <SectionHeader
          as="h1"
          eyebrow="Hire"
          title="Three ways to hire me — pick whichever you trust most"
          description="The work, the process and the standards are identical across all three. The only thing that changes is who holds the money and who arbitrates if something goes wrong. I would rather you felt protected than saved a commission."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-brand-400/25">
            <CardBody className="flex h-full flex-col gap-4">
              <Eyebrow>Most direct</Eyebrow>
              <h2 className="text-xl font-semibold tracking-tight text-ink-50">Work with me directly</h2>
              <p className="text-sm leading-relaxed text-ink-300">
                A written scope, a fixed price, staged invoices tied to delivery. No platform
                commission, and the fastest route from first message to first commit.
              </p>
              <ul className="flex flex-col gap-2.5 text-sm text-ink-200">
                {[
                  "Fixed-price against a signed scope",
                  "Staged invoicing tied to delivery",
                  "No marketplace commission",
                  "30 days of post-launch defect fixes",
                ].map((i) => (
                  <li key={i} className="flex gap-2.5 leading-relaxed">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand-400" />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <ButtonLink href="/contact" size="md">
                  Send a project brief
                </ButtonLink>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex h-full flex-col gap-4">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-400" aria-hidden="true" />
                <Eyebrow>Platform protected</Eyebrow>
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-ink-50">
                Through a marketplace
              </h2>
              <p className="text-sm leading-relaxed text-ink-300">
                If we have not worked together, a platform holding your money until you approve the
                work is a reasonable thing to want. Use it — the engineering is identical.
              </p>

              {marketplaces.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {marketplaces.map((m) => (
                    <li key={m.id}>
                      <a
                        href={m.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-channel={m.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-ink-100/10 px-3.5 py-2.5 transition-colors hover:border-ink-100/25 hover:bg-ink-100/5"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink-50">{m.label}</span>
                          <span className="block truncate text-[0.7rem] text-ink-500">{m.hint}</span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-ink-500" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-ink-100/10 bg-ink-950/40 p-3.5 text-xs leading-relaxed text-ink-400">
                  Marketplace profiles are not linked yet. Ask on any direct channel and you will get
                  the profile links, or start with a brief here.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex h-full flex-col gap-4">
              <Eyebrow>Bigger than one person</Eyebrow>
              <h2 className="text-xl font-semibold tracking-tight text-ink-50">
                As a technical partner
              </h2>
              <p className="text-sm leading-relaxed text-ink-300">
                Parallel workstreams, ongoing multi-product delivery, contractual continuity, or a
                technical partner with real stake in the outcome — that runs through Dharmarthlabs.
              </p>
              <ul className="flex flex-col gap-2.5 text-sm text-ink-200">
                {[
                  "A named team, not a single point of failure",
                  "Cash, equity or blended structures",
                  "Company contracting and compliance paperwork",
                  "Productised builds that ship in days",
                ].map((i) => (
                  <li key={i} className="flex gap-2.5 leading-relaxed">
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent-400" />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <ButtonLink href="/partner" variant="outline" size="md">
                  See partnership routes
                </ButtonLink>
              </div>
            </CardBody>
          </Card>
        </div>
      </Section>

      {direct.length > 0 ? (
        <Section className="border-t border-ink-100/8">
          <SectionHeader
            eyebrow="Or just say hello"
            title="Reach me where you already are"
            description="All of these land with the same person. Pick whichever you are comfortable with — there is no wrong one."
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {direct.map((c) => (
              <li key={c.id}>
                <a
                  href={c.href!}
                  target={c.href!.startsWith("http") ? "_blank" : undefined}
                  rel={c.href!.startsWith("http") ? "noopener noreferrer" : undefined}
                  data-channel={c.id}
                  className="flex items-center gap-3 rounded-xl border border-ink-100/10 px-4 py-3.5 transition-colors hover:border-brand-400/30 hover:bg-ink-900/60"
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink-50">{c.label}</span>
                    <span className="block truncate text-xs text-ink-500">{c.hint}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section className="border-t border-ink-100/8">
        <SectionHeader eyebrow="FAQ" title="Direct or marketplace?" />
        <ul className="mt-10 flex max-w-3xl flex-col gap-3">
          {hireFaqs.map((f) => (
            <li key={f.q} className="rounded-card border border-ink-100/10 bg-ink-900/50 p-5 md:p-6">
              <h3 className="text-base font-medium leading-snug text-ink-50">{f.q}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-300">{f.a}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-500">
          More questions?{" "}
          <Link href="/faq" className="text-brand-400 underline underline-offset-4">
            All 50 are answered here
          </Link>
          , or ask the assistant in the corner.
        </p>
      </Section>

      <CtaSection />
    </>
  );
}
