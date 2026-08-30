import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getAllPosts, getAllTags } from "@/lib/blog";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph, orgId } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Blog — Engineering Notes",
  description:
    "Technical articles on rendering strategy and SEO, AI that refuses to guess, Core Web Vitals budgets in CI, choosing a stack, and pre-launch security.",
  path: "/blog",
  keywords: [
    "Next.js engineering blog",
    "RAG chatbot tutorial",
    "Core Web Vitals CI",
    "technical SEO articles",
  ],
  ogTitle: "Engineering notes",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          {
            "@type": "Blog",
            name: "Code Hippies engineering notes",
            url: absoluteUrl("/blog"),
            publisher: { "@id": orgId },
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              description: p.description,
              url: absoluteUrl(`/blog/${p.slug}`),
              datePublished: p.publishedAt,
            })),
          },
        )}
      />

      <Section className="pb-8 pt-12 md:pt-16">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]}
        />
        <SectionHeader
          as="h1"
          eyebrow="Engineering notes"
          title="Things I have had to explain more than three times"
          description="Long-form technical writing on the decisions that actually move a project: what crawlers see, why a RAG assistant must be able to refuse, how a performance budget survives contact with a sprint, and how to pick a stack honestly."
        />
        <ul className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-ink-100/12 px-3 py-1.5 text-xs text-ink-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0 md:pt-0">
        <ul className="grid gap-4 md:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={i * 0.05}>
              <Card className="group h-full">
                <CardBody className="flex h-full flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                    {post.featured ? (
                      <span className="rounded-full bg-brand-500/12 px-2 py-0.5 text-brand-400">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-xl font-semibold leading-snug tracking-tight text-ink-50">
                    <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="flex-1 text-sm leading-relaxed text-ink-300">{post.description}</p>

                  <ul className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-ink-100/8 px-2 py-1 font-mono text-[0.7rem] text-ink-400"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-400">
                    Read the article
                    <ArrowUpRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaSection
        title="Rather have this applied to your project than read about it?"
        description="Send the brief and we'll start with what your constraints actually are."
      />
    </>
  );
}
