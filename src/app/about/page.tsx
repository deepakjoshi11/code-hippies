import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { GitHubMark } from "@/components/ui/icons";

import { bio } from "@/data/bio";
import { caseStudies } from "@/data/case-studies";
import { getGitHubSnapshot } from "@/lib/github";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph, personSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

/** GitHub stats are fetched live and revalidated every six hours. */
export const revalidate = 21600;

export const metadata: Metadata = pageMetadata({
  title: "About Deepak Joshi — ex-Deloitte USI, founder of Dharmarthlabs",
  description:
    "Deepak Joshi is a full-stack, mobile and AI/LLM engineer, previously at Deloitte USI and founder of Dharmarthlabs. Code Hippies is the studio he builds under, with live GitHub activity.",
  path: "/about",
  keywords: [
    "Deepak Joshi developer",
    "Deepak Joshi Deloitte",
    "Dharmarthlabs founder",
    "Code Hippies founder",
    "hire full-stack developer India",
  ],
  ogTitle: "Deepak Joshi — Code Hippies",
});

export default async function AboutPage() {
  const github = await getGitHubSnapshot();

  return (
    <>
      <JsonLd
        json={graph(
          personSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        )}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]}
        />
        <SectionHeader
          as="h1"
          eyebrow="About"
          title={
            <>
              {bio.name} — {bio.role.toLowerCase()}
            </>
          }
          description={bio.positioning}
        />

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink-100/10 pt-8 md:grid-cols-4">
          {bio.credentials.map((c) => (
            <div key={c.label}>
              <dt className="text-xs uppercase tracking-[0.14em] text-ink-500">{c.label}</dt>
              <dd className="mt-1.5 text-[0.95rem] font-medium text-ink-50">{c.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="prose-hippie max-w-2xl">
            {bio.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-[1.05rem] leading-relaxed">{paragraph}</p>
              </Reveal>
            ))}
            <p className="text-[1.05rem] leading-relaxed">
              If you want the shape of the work rather than the biography, the{" "}
              <Link href="/work">thirteen case studies</Link> are the honest version — including the
              ones where the right answer was the least interesting technology available.
            </p>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardBody className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <Eyebrow>GitHub</Eyebrow>
                  {github.live ? (
                    <span className="flex items-center gap-1.5 text-[0.7rem] text-ink-500">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
                      Live
                    </span>
                  ) : null}
                </div>

                {github.live ? (
                  <dl className="grid grid-cols-2 gap-4">
                    {[github.primary, github.studio]
                      .filter((p): p is NonNullable<typeof p> => Boolean(p))
                      .map((profile) => (
                        <div key={profile.login} className="flex flex-col gap-1">
                          <dt className="truncate font-mono text-xs text-ink-500">
                            @{profile.login}
                          </dt>
                          <dd className="text-sm text-ink-200">
                            {profile.publicRepos} repos · {profile.followers} followers
                          </dd>
                        </div>
                      ))}
                  </dl>
                ) : (
                  <p className="text-xs leading-relaxed text-ink-500">
                    Live stats are unavailable right now. The repositories below were verified
                    directly from the public profiles.
                  </p>
                )}

                <ul className="flex flex-col gap-3 border-t border-ink-100/10 pt-4">
                  {(github.repos.length > 0
                    ? github.repos.map((r) => ({
                        name: r.fullName || r.name,
                        language: r.language ?? "—",
                        description: r.description ?? "",
                        url: r.htmlUrl,
                        stars: r.stars,
                      }))
                    : bio.knownRepos.map((r) => ({ ...r, stars: 0 }))
                  ).map((repo) => (
                    <li key={repo.name}>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-1"
                      >
                        <span className="flex items-center gap-1.5 font-mono text-xs text-brand-400 group-hover:underline">
                          {repo.name}
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        </span>
                        {repo.description ? (
                          <span className="text-xs leading-relaxed text-ink-400">
                            {repo.description}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-3 text-[0.7rem] text-ink-500">
                          <span>{repo.language}</span>
                          {repo.stars > 0 ? (
                            <span className="flex items-center gap-1">
                              <Star className="size-3" aria-hidden="true" /> {repo.stars}
                            </span>
                          ) : null}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 border-t border-ink-100/10 pt-4">
                  <ButtonLink href={site.github.primary} external variant="outline" size="sm">
                    <GitHubMark className="size-4" /> @{site.github.primaryUser}
                  </ButtonLink>
                  <ButtonLink href={site.github.studio} external variant="outline" size="sm">
                    <GitHubMark className="size-4" /> @{site.github.studioUser}
                  </ButtonLink>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col gap-3">
                <Eyebrow>Also</Eyebrow>
                <a
                  href={site.dharmarthlabs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-ink-100 hover:text-brand-400"
                >
                  Dharmarthlabs
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
                <p className="text-xs leading-relaxed text-ink-500">
                  The company I founded — and the reason discovery happens before pricing here.
                </p>
              </CardBody>
            </Card>
          </aside>
        </div>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="The record"
          title="What is actually in production"
          description="Thirteen live sites across news publishing, marketing, health coaching and community work. Every technical claim on each case study was read off the live response."
        />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={Math.min(i, 8) * 0.03}>
              <Link
                href={`/work/${c.slug}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-ink-100/10 px-4 py-3.5 transition-colors hover:border-brand-400/30 hover:bg-ink-900/60"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink-50">{c.name}</span>
                  <span className="block truncate font-mono text-xs text-ink-500">
                    {c.displayUrl}
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-ink-500" aria-hidden="true" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaSection
        title="Working on something worth building?"
        description="Send the brief. You'll get an honest read on feasibility and a stack recommendation in the first conversation, whether or not we end up working together."
      />
    </>
  );
}
