import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { getTrack } from "@/data/positioning";
import { PartnerSection } from "@/components/sections/partner-section";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, graph, orgId } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Enterprise Engineering Without a Team",
  description:
    "What one senior engineer with modern tooling genuinely delivers, what it does not cover, and the governance an enterprise procurement review actually asks for. Stated plainly, both ways.",
  path: "/enterprise",
  keywords: [
    "senior contract engineer for enterprise",
    "replace development team with contractor",
    "enterprise web application development India",
    "fractional engineering leadership",
    "outsourced product engineering",
  ],
  ogTitle: "A senior engineer who ships, without the hiring cycle",
});

const track = getTrack("enterprise")!;

const COVERED = [
  "Production web applications — Next.js, TypeScript strict, server-rendered",
  "Cross-platform or native mobile releases through store review",
  "Retrieval-grounded AI features with an evaluation harness in CI",
  "CI/CD with performance, accessibility and dependency-security gates",
  "Technical SEO, Core Web Vitals and structured data",
  "OWASP Top 10 review and pre-launch hardening",
  "Documented handover a new hire can act on in fifteen minutes",
];

const NOT_COVERED = [
  "24/7 on-call rotation with paged escalation",
  "Multiple parallel product lines at once",
  "Continuity through one person's holiday or illness",
  "Large-scale data engineering or ML training infrastructure",
  "Anything needing a named backup team by contract",
];

const enterpriseFaqs = [
  {
    q: "Can one engineer really replace our development team?",
    a: "Not as a general claim, and I will not make one. For a defined scope — a product build, a platform migration, an AI feature — one senior engineer with modern tooling delivers what took four to six people five years ago, without the coordination overhead. For continuous multi-product delivery with on-call coverage, you need a team, and I will say so before the contract rather than during it.",
  },
  {
    q: "What is our exposure if you become unavailable?",
    a: track.objection.a,
  },
  {
    q: "Can you work under our procurement and compliance process?",
    a: "Yes. Where company contracting, insurance, named backup resourcing or formal SLAs are required, the engagement runs through Dharmarthlabs — same engineering standards, same person accountable, with the corporate structure procurement needs. NDAs, security questionnaires and vendor onboarding are all routine.",
  },
  {
    q: "How do you handle security review and audit requirements?",
    a: "OWASP Top 10 review with reproducible findings, security headers, server-side validation on every route, dependency scanning that fails the build on high and critical advisories, and no secrets in client bundles. For SOC 2 or ISO 27001, I implement and document the technical controls and prepare the evidence — the audit itself requires an accredited third party, and nobody can automate that.",
  },
  {
    q: "Do you work inside our existing repositories and tooling?",
    a: "Yes — that is the staff-augmentation model. Your repository, your CI, your ceremonies, your code review. Knowledge transfer to your team is an explicit deliverable rather than a favour, because a capability that leaves when the contractor leaves was never really transferred.",
  },
];

export default function EnterprisePage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Enterprise", path: "/enterprise" },
  ];

  return (
    <>
      <JsonLd
        json={graph(breadcrumbSchema(trail), faqSchema(enterpriseFaqs), {
          "@type": "Service",
          name: "Enterprise engineering engagement",
          description:
            "Senior contract engineering for established companies: product builds, platform migrations and AI features, with governance suitable for procurement review.",
          url: absoluteUrl("/enterprise"),
          provider: { "@id": orgId },
          areaServed: "Worldwide",
          audience: { "@type": "BusinessAudience", audienceType: "Enterprise and scale-up companies" },
        })}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs trail={trail} />
        <SectionHeader
          as="h1"
          eyebrow="Enterprise"
          title={track.headline}
          description={track.intro}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact?engagement=enterprise" size="lg">
            Start a conversation <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/partner" variant="outline" size="lg">
            See the partnership route
          </ButtonLink>
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-brand-400/25">
            <CardBody className="flex flex-col gap-4">
              <Eyebrow>What this genuinely covers</Eyebrow>
              <ul className="flex flex-col gap-3">
                {COVERED.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-200">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Eyebrow className="text-accent-400">What it does not — said before the contract</Eyebrow>
              <ul className="flex flex-col gap-3">
                {NOT_COVERED.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-400">
                    <Minus className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                Need any of these?{" "}
                <Link href="/partner" className="text-brand-400 underline underline-offset-4">
                  The Dharmarthlabs route
                </Link>{" "}
                covers them, with a named team and contractual continuity.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="Why this works now"
          title="The arithmetic changed, and pretending otherwise costs you money"
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {track.points.map((point, i) => (
            <Reveal as="li" key={point.title} delay={i * 0.06} className="min-w-0">
              <Card className="h-full">
                <CardBody className="flex flex-col gap-3">
                  <h3 className="text-base font-semibold leading-snug text-ink-50">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-300">{point.body}</p>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="Beyond one engineer"
          title="Where the team route makes more sense"
          description="Offered when it is the better answer for you, including when it costs me the direct engagement."
        />
        <div className="mt-10">
          <PartnerSection compact />
        </div>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader eyebrow="FAQ" title="What procurement asks" />
        <ul className="mt-10 flex max-w-3xl flex-col gap-3">
          {enterpriseFaqs.map((f) => (
            <li
              key={f.q}
              className="rounded-card border border-ink-100/10 bg-ink-900/50 p-5 md:p-6"
            >
              <h3 className="text-base font-medium leading-snug text-ink-50">{f.q}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-300">{f.a}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaSection
        title="Bring the requirement, get a straight answer"
        description="Including whether this should be a contract engagement, a partnership, or something you should keep in-house."
      />
    </>
  );
}
