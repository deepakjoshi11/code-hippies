import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { getService, services } from "@/data/services";
import { getCaseStudy } from "@/data/case-studies";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, faqSchema, graph, orgId, personId } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return pageMetadata({
    title: service.name,
    description: service.summary,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
    ogTitle: service.headline,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedCaseStudies
    .map((s) => getCaseStudy(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema(trail),
          {
            "@type": "Service",
            name: service.name,
            description: service.summary,
            url: absoluteUrl(`/services/${service.slug}`),
            serviceType: service.name,
            provider: { "@id": orgId },
            areaServed: "Worldwide",
            audience: { "@type": "Audience", audienceType: "Startups and agencies" },
            author: { "@id": personId },
          },
          faqSchema(service.faqs),
        )}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs trail={trail} />
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-400">
          {service.name}
        </p>
        <h1 className="mt-5 max-w-4xl text-balance-heading text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-ink-50 md:text-[3.5rem]">
          {service.headline}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-300 md:text-xl">
          {service.summary}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/contact" size="lg">
            Discuss this project <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <span className="text-sm text-ink-500">{service.startingPoint}</span>
        </div>
      </Section>

      <Section className="py-0">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardBody className="flex flex-col gap-5">
              <Eyebrow>What you get</Eyebrow>
              <ul className="flex flex-col gap-3">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-200">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col gap-5">
              <Eyebrow>Stack options</Eyebrow>
              <p className="text-xs leading-relaxed text-ink-500">
                Chosen per project against your constraints. No single engagement uses all of these.
              </p>
              <dl className="flex flex-col gap-4">
                {service.stackOptions.map((group) => (
                  <div key={group.label}>
                    <dt className="text-xs font-medium uppercase tracking-[0.14em] text-ink-500">
                      {group.label}
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {group.options.map((option) => (
                        <span
                          key={option}
                          className="rounded-md bg-ink-100/8 px-2 py-1 font-mono text-[0.7rem] text-ink-200"
                        >
                          {option}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="flex max-w-3xl flex-col gap-10">
          {service.sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 0.06}>
              <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink-50 md:text-3xl">
                {section.heading}
              </h2>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-300">{section.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="Proof"
          title={`${service.name} in production`}
          description="Live builds where this work was actually done, with the technical signals verified on each site."
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {related.map((c, i) => (
            <CaseStudyCard key={c.slug} study={c} index={i} />
          ))}
        </ul>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader eyebrow="FAQ" title={`Questions about ${service.name.toLowerCase()}`} />
        <div className="mt-10 max-w-3xl">
          <FaqSection items={service.faqs.map((f) => ({ ...f, category: "Technology" as const }))} />
        </div>
      </Section>

      <CtaSection
        title={`Start a ${service.name.toLowerCase()} engagement`}
        description="Send the brief with your project type, budget band and timeline. You'll get a scoped recommendation and a fixed price against a written scope."
      />
    </>
  );
}
