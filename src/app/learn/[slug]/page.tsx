import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { getTrack, publishedTracks } from "@/data/learn";
import { getPost } from "@/lib/blog";
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

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return publishedTracks().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) return {};

  return pageMetadata({
    title: track.title,
    description: track.summary,
    path: `/learn/${track.slug}`,
    keywords: [track.title, "free", "learn", ...track.outcomes.slice(0, 2)],
    ogTitle: track.title,
  });
}

export default async function LearnTrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const articles = track.articles
    .map((a) => getPost(a))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const trail = [
    { name: "Home", path: "/" },
    { name: "Learn", path: "/learn" },
    { name: track.title, path: `/learn/${track.slug}` },
  ];

  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema(trail),
          {
            /**
             * Course rather than Article: this is a named unit of study with
             * stated outcomes, which is what the markup is for. `isAccessibleForFree`
             * and a zero-price offer are the properties Google reads to show it
             * as free, and they are true here.
             */
            "@type": "Course",
            name: track.title,
            description: track.summary,
            url: absoluteUrl(`/learn/${track.slug}`),
            provider: { "@id": orgId },
            author: { "@id": personId },
            inLanguage: "en",
            isAccessibleForFree: true,
            teaches: track.outcomes,
            audience: { "@type": "Audience", audienceType: track.who },
            offers: {
              "@type": "Offer",
              price: 0,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              category: "Free",
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
              courseWorkload: "PT2H",
            },
          },
        )}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs trail={trail} />
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-400">
          Free learning track
        </p>
        <h1 className="mt-5 max-w-4xl text-balance-heading text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-ink-50 md:text-[3.25rem]">
          {track.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-300 md:text-xl">
          {track.summary}
        </p>
        <p className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-ink-400">
          <span className="text-ink-200">Who this is for:</span> {track.who}
        </p>
      </Section>

      <Section className="py-0 md:py-0">
        <Card>
          <CardBody className="flex flex-col gap-5">
            <Eyebrow>What you will be able to do</Eyebrow>
            <ul className="flex flex-col gap-3">
              {track.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-200">
                  <Check className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </Section>

      {articles.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="The material"
            title="Articles in this track"
            description="Written and published. No sign-up, no email gate."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={Math.min(i, 4) * 0.05}>
                <Card>
                  <CardBody className="flex h-full flex-col gap-3">
                    <h3 className="text-lg font-semibold leading-snug text-ink-50">
                      <Link href={`/blog/${a.slug}`} className="hover:text-brand-300">
                        {a.title}
                      </Link>
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-300">{a.description}</p>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300"
                    >
                      Read it <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </CardBody>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section className="pt-4 md:pt-4">
        <ButtonLink href="/learn" variant="secondary">
          All learning tracks
        </ButtonLink>
      </Section>

      <CtaSection />
    </>
  );
}
