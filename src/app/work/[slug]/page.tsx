import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";

import { caseStudies, getCaseStudy, getRelated, isLive } from "@/data/case-studies";
import { getService } from "@/data/services";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, creativeWorkSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { InlineCode } from "@/components/ui/inline-code";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return pageMetadata({
    title: `${study.name} — ${study.stack[0]} Case Study`,
    // Summary plus the plain-language line, clamped at the SERP limit — the
    // two together describe both what was built and what it does.
    description: `${study.summary} ${study.layman}`,
    path: `/work/${study.slug}`,
    keywords: [...study.stack, study.category, "Code Hippies case study"],
    ogTitle: study.name,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const related = getRelated(slug);
  const service = getService(study.serviceSlug);
  const trail = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: study.name, path: `/work/${study.slug}` },
  ];

  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema(trail),
          creativeWorkSchema({
            name: study.name,
            description: study.summary,
            path: `/work/${study.slug}`,
            liveUrl: study.url,
            stack: study.stack,
          }),
        )}
      />

      <article>
        <Section className="pb-10 pt-12 md:pb-14 md:pt-16">
          <Breadcrumbs trail={trail} />

          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <span className="rounded-full border border-ink-100/12 px-3 py-1.5">{study.category}</span>
            <span className="rounded-full border border-ink-100/12 px-3 py-1.5 font-mono">{study.year}</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-balance-heading text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-ink-50 md:text-6xl">
            {study.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-300 md:text-xl">
            {study.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={study.url} external size="md">
              Open the live site <ExternalLink aria-hidden="true" />
            </ButtonLink>
            {service ? (
              <ButtonLink href={`/services/${service.slug}`} variant="outline" size="md">
                {service.name} <ArrowUpRight aria-hidden="true" />
              </ButtonLink>
            ) : null}
          </div>

          <div
            aria-hidden="true"
            className="mt-10 h-1 w-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${study.accentFrom}, ${study.accentTo})` }}
          />
        </Section>

        <Section className="py-0">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardBody className="flex flex-col gap-3">
                <Eyebrow>The engineering</Eyebrow>
                <p className="text-[0.95rem] leading-relaxed text-ink-200">
                  <InlineCode text={study.engineering} />
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-col gap-3">
                <Eyebrow className="text-accent-400">In plain language</Eyebrow>
                <p className="text-[0.95rem] leading-relaxed text-ink-200">{study.layman}</p>
              </CardBody>
            </Card>
          </div>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-10">
              <div>
                <SectionHeader eyebrow="The problem" title="What needed solving" />
                <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-ink-300">
                  {study.problem}
                </p>
              </div>

              <div>
                <SectionHeader eyebrow="The approach" title="How it was built" />
                <ul className="mt-6 flex flex-col gap-4">
                  {study.approach.map((item, i) => (
                    <Reveal as="li" key={item} delay={i * 0.05} className="flex gap-3.5">
                      <span
                        aria-hidden="true"
                        className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-brand-400/25 bg-brand-500/10 font-mono text-[0.7rem] text-brand-400"
                      >
                        {i + 1}
                      </span>
                      <p className="text-[0.95rem] leading-relaxed text-ink-300">{item}</p>
                    </Reveal>
                  ))}
                </ul>
              </div>

              <div>
                <SectionHeader eyebrow="The outcome" title="What it produced" />
                <ul className="mt-6 flex flex-col gap-3">
                  {study.outcome.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-200">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
              <Card>
                <CardBody className="flex flex-col gap-4">
                  <Eyebrow>Verified on the live site</Eyebrow>
                  <p className="text-xs leading-relaxed text-ink-500">
                    Each signal below was read directly from the response headers or served HTML at{" "}
                    {isLive(study) ? (
                      <a
                        href={study.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-400 underline underline-offset-4"
                      >
                        {study.displayUrl}
                      </a>
                    ) : (
                      <span className="font-mono text-ink-400">{study.displayUrl}</span>
                    )}
                    . Nothing here is inferred.
                    {isLive(study) ? null : " These were recorded while the site was live."}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {study.verified.map((signal) => (
                      <li key={signal} className="flex gap-2.5 text-xs leading-relaxed text-ink-300">
                        <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-400" />
                        <span>
                          <InlineCode text={signal} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="flex flex-col gap-3">
                  <Eyebrow>Stack</Eyebrow>
                  <ul className="flex flex-wrap gap-1.5">
                    {study.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md bg-ink-100/8 px-2 py-1 font-mono text-[0.7rem] text-ink-200"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <h2 className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
                    Services involved
                  </h2>
                  <ul className="flex flex-col gap-1.5">
                    {study.services.map((s) => (
                      <li key={s} className="text-sm text-ink-300">
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </aside>
          </div>
        </Section>

        <Section className="border-t border-ink-100/8">
          <SectionHeader
            eyebrow="Related work"
            title="Other builds with the same shape"
            description={
              service ? (
                <>
                  This project sits under{" "}
                  <Link href={`/services/${service.slug}`} className="text-brand-400 underline underline-offset-4">
                    {service.name}
                  </Link>
                  . Here are the closest neighbours in the portfolio.
                </>
              ) : undefined
            }
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <CaseStudyCard key={r.slug} study={r} index={i} />
            ))}
          </ul>
        </Section>
      </article>

      <CtaSection
        title={`Need something like ${study.name}?`}
        description="Send the brief and you'll get a scoped recommendation, an honest timeline and a fixed price against a written scope."
      />
    </>
  );
}
