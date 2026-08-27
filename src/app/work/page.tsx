import type { Metadata } from "next";
import { caseStudies } from "@/data/case-studies";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Case Studies — 13 Live Production Sites",
  description:
    "13 production sites built by Deepak Joshi — Next.js news networks, an Astro funnel, WordPress publishing, React SPAs. Every claim verified on the live site.",
  path: "/work",
  keywords: [
    "Code Hippies portfolio",
    "Deepak Joshi developer portfolio",
    "Next.js case studies India",
    "news website development case study",
  ],
  ogTitle: "13 live production sites. Open any of them.",
});

const categories = [...new Set(caseStudies.map((c) => c.category))];

export default function WorkIndexPage() {
  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
          ]),
        )}
      />

      <Section className="pb-10 pt-12 md:pb-12 md:pt-16">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
          ]}
        />
        <SectionHeader
          as="h1"
          eyebrow="Case studies"
          title="Thirteen production sites, and how each one was actually built"
          description="Every case study pairs the engineering — the real stack signals read off the live response headers and HTML — with what the site does for the business in plain language. No feature is claimed here that could not be verified by visiting the site."
        />
        <ul className="mt-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <li
              key={category}
              className="rounded-full border border-ink-100/12 px-3 py-1.5 text-xs text-ink-300"
            >
              {category} · {caseStudies.filter((c) => c.category === category).length}
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} headingLevel="h2" />
          ))}
        </ul>
      </Section>

      <CtaSection
        title="Want something on this list?"
        description="Tell me what you're building and what the constraints are. You'll get a stack recommendation and an honest read on feasibility in the first conversation."
      />
    </>
  );
}
