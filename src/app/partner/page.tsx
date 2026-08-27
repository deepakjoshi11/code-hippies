import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { PartnerSection } from "@/components/sections/partner-section";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph, orgId, personId } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { dharmarthlabs, dharmarthlabsHref } from "@/data/partnership";

export const metadata: Metadata = pageMetadata({
  title: "Technical Partner for Startups & Enterprises",
  description:
    "When a project is bigger than one engineer: productised digital and AI builds, custom specification, technical partnership with equity structures, and enterprise vendor engagement via Dharmarthlabs.",
  path: "/partner",
  keywords: [
    "technical partner for startup",
    "CTO as a service India",
    "technical co-founder equity partnership",
    "productised digital products agency",
    "enterprise software vendor India",
  ],
  ogTitle: "When the project is bigger than one engineer",
});

export default function PartnerPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Partner", path: "/partner" },
  ];

  return (
    <>
      <JsonLd
        json={graph(breadcrumbSchema(trail), {
          "@type": "Organization",
          name: dharmarthlabs.name,
          url: dharmarthlabs.url,
          description: dharmarthlabs.tagline,
          founder: { "@id": personId },
          subOrganization: { "@id": orgId },
          mainEntityOfPage: absoluteUrl("/partner"),
        })}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs trail={trail} />
        <SectionHeader
          as="h1"
          eyebrow="Partnership"
          title="When the project is bigger than one engineer"
          description="Code Hippies is one senior engineer, and for a defined build that is the right shape — fewer handoffs, one person accountable. Some work is genuinely bigger than that: parallel workstreams, ongoing multi-product delivery, a team that survives someone taking leave, or a technical partner with real stake in the outcome. That is what Dharmarthlabs is for."
        />

        <div className="mt-8 rounded-card border border-ink-100/10 bg-ink-900/50 p-5 md:p-6">
          <p className="text-sm leading-relaxed text-ink-300">
            <strong className="font-semibold text-ink-100">The relationship, stated plainly:</strong>{" "}
            {dharmarthlabs.relationship} You are not being handed to a stranger with a commission —
            it is the same person, with a company and a team behind him when that is what the work
            needs.
          </p>
          <a
            href={dharmarthlabsHref("/")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 underline underline-offset-4"
          >
            {dharmarthlabs.url.replace(/^https?:\/\//, "")}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </Section>

      <Section className="pt-0">
        <PartnerSection headingLevel="h2" />
      </Section>

      <CtaSection
        title="Not sure which side of the line you are on?"
        description="Send the brief and you'll get a straight answer on whether this is a Code Hippies engagement or a Dharmarthlabs one — including when the answer costs me the larger job."
      />
    </>
  );
}
