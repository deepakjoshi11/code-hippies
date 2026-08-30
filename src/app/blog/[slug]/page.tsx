import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/blog/mdx-components";
import { ArrowUpRight } from "lucide-react";

import { getAllPosts, getPost } from "@/lib/blog";
import { getService } from "@/data/services";
import { getCaseStudy } from "@/data/case-studies";
import { CtaSection } from "@/components/sections/cta-section";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.tags,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const service = post.relatedService ? getService(post.relatedService) : undefined;
  const caseStudy = post.relatedCaseStudy ? getCaseStudy(post.relatedCaseStudy) : undefined;
  const others = getAllPosts().filter((p) => p.slug !== slug).slice(0, 2);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema(trail),
          articleSchema({
            title: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            publishedTime: post.publishedAt,
            updatedTime: post.updatedAt,
            tags: post.tags,
          }),
        )}
      />

      <article>
        <Section className="pb-8 pt-12 md:pt-16">
          <Breadcrumbs trail={trail} />
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="mt-5 text-balance-heading text-3xl font-semibold leading-[1.12] tracking-[-0.025em] text-ink-50 md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-300">{post.description}</p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-ink-100/8 px-2 py-1 font-mono text-[0.7rem] text-ink-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section className="py-0 md:py-0">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
            <div className="prose-hippie min-w-0 max-w-3xl">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
              {service ? (
                <Card>
                  <CardBody className="flex flex-col gap-2.5">
                    <Eyebrow>Related service</Eyebrow>
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex items-center gap-1.5 text-sm font-medium text-ink-50 hover:text-brand-400"
                    >
                      {service.name}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    <p className="text-xs leading-relaxed text-ink-400">{service.summary}</p>
                  </CardBody>
                </Card>
              ) : null}

              {caseStudy ? (
                <Card>
                  <CardBody className="flex flex-col gap-2.5">
                    <Eyebrow>Seen in production</Eyebrow>
                    <Link
                      href={`/work/${caseStudy.slug}`}
                      className="flex items-center gap-1.5 text-sm font-medium text-ink-50 hover:text-brand-400"
                    >
                      {caseStudy.name}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    <p className="text-xs leading-relaxed text-ink-400">{caseStudy.layman}</p>
                  </CardBody>
                </Card>
              ) : null}

              <Card>
                <CardBody className="flex flex-col gap-3">
                  <Eyebrow>Keep reading</Eyebrow>
                  <ul className="flex flex-col gap-3">
                    {others.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="text-sm leading-snug text-ink-300 hover:text-brand-400"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </aside>
          </div>
        </Section>
      </article>

      <CtaSection
        title="Want this done on your project?"
        description="Send the brief with your project type, budget band and timeline. You'll get a scoped recommendation and an honest read on feasibility."
      />
    </>
  );
}
