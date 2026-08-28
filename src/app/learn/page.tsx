import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check } from "lucide-react";

import { aiVisibility, learnIntro, learningTracks } from "@/data/learn";
import { getAllPosts } from "@/lib/blog";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph, orgId, personId } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Learn — AI Visibility & Modern Engineering, Free",
  description:
    "Free material on AI visibility, retrieval-grounded AI, Core Web Vitals and pre-launch security. No sign-up, no upsell, no certification — the notes I actually use, written down.",
  path: "/learn",
  keywords: [
    "AI visibility for developers",
    "llms.txt guide",
    "learn AI engineering free",
    "RAG tutorial refusal",
    "Core Web Vitals CI",
  ],
  ogTitle: "The craft did not stop mattering. It changed shape.",
});

const STATUS_COPY = {
  published: { label: "Complete", className: "border-brand-400/30 bg-brand-500/10 text-brand-300" },
  "in-progress": { label: "Being written", className: "border-accent-400/30 bg-accent-400/10 text-accent-400" },
  planned: { label: "Planned", className: "border-ink-100/15 bg-ink-100/5 text-ink-400" },
} as const;

export default function LearnPage() {
  const posts = getAllPosts();
  const trail = [
    { name: "Home", path: "/" },
    { name: "Learn", path: "/learn" },
  ];

  return (
    <>
      <JsonLd
        json={graph(breadcrumbSchema(trail), {
          "@type": "LearningResource",
          name: "Code Hippies — AI-era engineering material",
          description:
            "Free material on AI visibility, retrieval-grounded AI systems, Core Web Vitals and application security.",
          url: absoluteUrl("/learn"),
          isAccessibleForFree: true,
          provider: { "@id": orgId },
          author: { "@id": personId },
          educationalLevel: "Professional",
          teaches: learningTracks.map((t) => t.title),
        })}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs trail={trail} />
        <SectionHeader
          as="h1"
          eyebrow={learnIntro.eyebrow}
          title={learnIntro.headline}
          description={learnIntro.body}
        />
        <p className="mt-6 max-w-3xl rounded-card border border-ink-100/12 bg-ink-900/50 p-5 text-sm leading-relaxed text-ink-300">
          <strong className="font-semibold text-ink-100">Read this first.</strong>{" "}
          {learnIntro.honesty}
        </p>
      </Section>

      <Section className="border-t border-ink-100/8 pt-14">
        <SectionHeader
          eyebrow="The discipline this site is built around"
          title={aiVisibility.title}
          description={aiVisibility.definition}
        />
        <p className="mt-6 max-w-3xl text-[1.05rem] leading-relaxed text-ink-300">
          {aiVisibility.why}
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiVisibility.practices.map((practice, i) => (
            <Reveal as="li" key={practice.title} delay={Math.min(i, 5) * 0.05} className="min-w-0">
              <Card className="h-full">
                <CardBody className="flex flex-col gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-8 place-items-center rounded-lg border border-brand-400/20 bg-brand-500/10 font-mono text-xs text-brand-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold leading-snug text-ink-50">
                    {practice.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-300">{practice.body}</p>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </ul>

        <div className="mt-8 rounded-card border border-brand-400/25 bg-brand-500/6 p-5 md:p-6">
          <p className="text-sm leading-relaxed text-ink-200">
            <strong className="font-semibold text-ink-50">This site is the worked example.</strong>{" "}
            Its machine-readable summary is at{" "}
            <Link href="/llms.txt" className="text-brand-400 underline underline-offset-4">
              /llms.txt
            </Link>{" "}
            — generated from the same typed data as the pages, so it cannot drift, and it states
            what is <em>not</em> true as carefully as what is. Read it, then read the source.
          </p>
        </div>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="Tracks"
          title="What is here, and what is honestly still a stub"
          description="Each track links to the long-form articles that cover it. Status is marked so nobody spends an afternoon on something half-written."
        />
        <ul className="mt-10 flex flex-col gap-4">
          {learningTracks.map((track, i) => {
            const status = STATUS_COPY[track.status];
            const linked = track.articles
              .map((slug) => posts.find((p) => p.slug === slug))
              .filter((p): p is NonNullable<typeof p> => Boolean(p));

            return (
              <Reveal as="li" key={track.slug} delay={Math.min(i, 4) * 0.05} className="min-w-0">
                <Card className="h-full">
                  <CardBody className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em]",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                      <Eyebrow className="text-ink-500">{track.who}</Eyebrow>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-ink-50">
                      {track.title}
                    </h3>
                    <p className="max-w-3xl text-sm leading-relaxed text-ink-300">{track.summary}</p>

                    <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-ink-500">
                          You should be able to
                        </h4>
                        <ul className="mt-3 flex flex-col gap-2">
                          {track.outcomes.map((o) => (
                            <li key={o} className="flex gap-2.5 text-sm leading-relaxed text-ink-200">
                              <Check className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {linked.length > 0 ? (
                        <div className="rounded-xl border border-ink-100/10 bg-ink-950/40 p-4">
                          <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-ink-500">
                            Read
                          </h4>
                          <ul className="mt-3 flex flex-col gap-2.5">
                            {linked.map((p) => (
                              <li key={p.slug}>
                                <Link
                                  href={`/blog/${p.slug}`}
                                  className="flex items-start gap-2 text-sm leading-snug text-brand-400 hover:underline"
                                >
                                  <BookOpen className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                                  {p.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-8">
          <ButtonLink href="/blog" variant="outline">
            All articles <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>

      <CtaSection
        title="Want this applied to your product rather than explained?"
        description="The material is free and stays free. If you would rather have it built than read about it, that is what the engagements are for."
      />
    </>
  );
}
