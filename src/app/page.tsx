import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { LogoStrip } from "@/components/sections/logo-strip";
import { ServiceCards } from "@/components/sections/service-cards";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { ProofSection } from "@/components/sections/proof-section";
import { FaqSection, FaqFooterNote } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";

import { featuredCaseStudies } from "@/data/case-studies";
import { faqs, homeFaqs } from "@/data/faq";
import { faqSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Code Hippies — Deepak Joshi | Full-stack, mobile & AI/LLM engineer",
  description:
    "Deepak Joshi builds production web applications, iOS and Android apps and retrieval-grounded AI systems for startups and agencies. Thirteen live builds, every technical claim verifiable.",
  path: "/",
  keywords: [
    "Deepak Joshi developer",
    "Code Hippies",
    "Code Hippies web development",
    "hire full-stack developer India",
    "AI LLM engineer for startups",
    "React Next.js developer for hire",
    "iOS Android developer for startups",
  ],
  ogTitle: "I build software your business can actually run on.",
});

export default function HomePage() {
  return (
    <>
      <JsonLd json={graph(faqSchema(homeFaqs))} />

      <Hero />
      <LogoStrip />

      <Section id="services">
        <SectionHeader
          eyebrow="What I do"
          title="Five things, done properly, instead of everything done adequately"
          description="Each of these is a distinct offer with its own scope, its own deliverables and its own way of being judged. Pick the one that matches your problem."
        />
        <div className="mt-10">
          <ServiceCards />
        </div>
        <div className="mt-8">
          <ButtonLink href="/services" variant="outline">
            Compare all services <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      <Section id="work" className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="Selected work"
          title="Thirteen live sites. Open any of them right now."
          description="Each case study pairs what was actually engineered with what it does for the business — and lists the exact signals observed on the live response, so nothing here needs to be taken on trust."
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredCaseStudies.map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} />
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink href="/work" variant="outline">
            All 13 case studies <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      <Section id="process" className="border-t border-ink-100/8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              eyebrow="How it runs"
              title="You always know what happens next"
              description="Nine stages from discovery to maintenance. Every one has a defined output and a defined thing I need from you — because the projects that go wrong are almost always the ones where nobody wrote that down."
            />
            <div className="mt-8">
              <ButtonLink href="/process" variant="outline">
                See the full process <ArrowRight aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
          <ProcessTimeline compact />
        </div>
      </Section>

      <Section id="proof" className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="Evidence"
          title="Verifiable, not testimonial"
          description="The strongest proof an engineer can offer is work you can inspect without asking permission."
        />
        <div className="mt-10">
          <ProofSection />
        </div>
      </Section>

      <Section id="pricing" className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="Engagement"
          title="Three ways to work together"
          description="Fixed-scope projects, monthly retainers and staff augmentation. Pricing follows discovery, because a number quoted before the scope is understood is wrong in one direction or the other."
        />
        <div className="mt-8">
          <ButtonLink href="/pricing" variant="outline">
            See engagement models <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      <Section id="faq" className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="FAQ"
          title="The questions that come up in every first call"
          description="Answered here so the first conversation can be about your project rather than about how I work."
        />
        <div className="mt-10">
          <FaqSection items={homeFaqs} />
          <FaqFooterNote />
          <p className="mt-4 text-sm">
            <Link href="/faq" className="text-brand-400 underline underline-offset-4">
              Read all {faqs.length} questions &rarr;
            </Link>
          </p>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
