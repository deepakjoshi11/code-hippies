import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { engagementModels } from "@/data/pricing";
import { faqs } from "@/data/faq";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Pricing & Engagement Models",
  description:
    "Three ways to work together: fixed-scope projects quoted after discovery, monthly retainers, and staff augmentation. What is included, and what is not.",
  path: "/pricing",
  keywords: [
    "freelance developer pricing India",
    "fixed price web development",
    "development retainer agreement",
    "staff augmentation day rate",
  ],
  ogTitle: "Three ways to work together",
});

const pricingFaqs = faqs.filter((f) => f.category === "Scope & pricing");

export default function PricingPage() {
  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          faqSchema(pricingFaqs),
        )}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]}
        />
        <SectionHeader
          as="h1"
          eyebrow="Engagement models"
          title="Three ways to work together"
          description="There are no package prices on this page, and that is deliberate. A number quoted before the scope is understood is wrong in one direction or the other — so what you get here is how each model works, what is included, and what is explicitly not."
        />
      </Section>

      <Section className="pt-0 md:pt-0">
        <ul className="grid gap-4 lg:grid-cols-3">
          {engagementModels.map((model, i) => (
            <Reveal as="li" key={model.slug} delay={i * 0.06}>
              <Card
                className={cn(
                  "h-full",
                  model.featured ? "border-brand-400/30 bg-ink-900/80" : undefined,
                )}
              >
                <CardBody className="flex h-full flex-col gap-5">
                  {model.featured ? (
                    <span className="w-fit rounded-full bg-brand-500/15 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-brand-400">
                      Most common
                    </span>
                  ) : null}

                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-ink-50">{model.name}</h2>
                    <p className="mt-2.5 text-2xl font-semibold text-brand-400">{model.priceLabel}</p>
                    <p className="mt-1 text-xs text-ink-500">{model.priceNote}</p>
                  </div>

                  <p className="text-sm leading-relaxed text-ink-300">{model.description}</p>

                  <div className="rounded-xl border border-ink-100/10 bg-ink-950/40 p-3.5">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-500">
                      Best for
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{model.bestFor}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink-500">
                      Included
                    </h3>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {model.includes.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-200">
                          <Check className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink-500">
                      Not included
                    </h3>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {model.notIncluded.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-400">
                          <Minus className="mt-0.5 size-4 shrink-0 text-ink-500" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 border-t border-ink-100/10 pt-4">
                    <p className="text-xs text-ink-500">Commitment: {model.commitment}</p>
                    <ButtonLink
                      href={`/contact?engagement=${model.slug}`}
                      variant={model.featured ? "primary" : "outline"}
                      size="md"
                    >
                      Start here <ArrowRight aria-hidden="true" />
                    </ButtonLink>
                  </div>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-ink-100/8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Before you commit"
              title="The smallest way to find out if this works"
              description="A one-week audit — technical SEO, performance, or a security review — produces a prioritised findings list with effort estimates against each item. Clients regularly use it to decide whether a larger engagement is worth it, and it is yours whether or not you continue."
            />
            <div className="mt-7">
              <ButtonLink href="/services/seo-performance" variant="outline">
                See what an audit covers <ArrowRight aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
          <Card>
            <CardBody className="flex flex-col gap-4">
              <Eyebrow>Indicative timelines</Eyebrow>
              <dl className="flex flex-col gap-3.5 text-sm">
                {[
                  ["Marketing or consultation site", "2–4 weeks"],
                  ["Web application with auth, database, admin", "6–12 weeks"],
                  ["First mobile app release", "8–14 weeks"],
                  ["Grounded AI assistant with an eval harness", "3–6 weeks"],
                  ["Audit (SEO, performance or security)", "1 week"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-ink-100/8 pb-3 last:border-0">
                    <dt className="text-ink-300">{label}</dt>
                    <dd className="shrink-0 font-mono text-ink-50">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs leading-relaxed text-ink-500">
                Ranges, not promises. The number that binds is the one in the fixed-scope proposal
                after discovery — see{" "}
                <Link href="/process" className="text-brand-400 underline underline-offset-4">
                  the process
                </Link>
                .
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader eyebrow="FAQ" title="Scope and pricing questions" />
        <div className="mt-10 max-w-3xl">
          <FaqSection items={pricingFaqs} />
        </div>
      </Section>

      <CtaSection
        title="Self-qualified? Send the brief."
        description="The form asks for project type, budget band and timeline. Two minutes, and the first conversation starts from a real understanding of what you need."
      />
    </>
  );
}
