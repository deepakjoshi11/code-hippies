import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories, faqs } from "@/data/faq";
import { FaqSection, FaqFooterNote } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQ — working with Code Hippies and Deepak Joshi",
  description:
    "Straight answers on pricing, scope, technology choices, code ownership, AI hallucination, security practices and what happens after launch. The questions that come up in every first call.",
  path: "/faq",
  keywords: [
    "how much does a website cost India",
    "hire freelance developer questions",
    "who owns the code freelance developer",
    "fixed price vs hourly development",
    "Code Hippies FAQ",
  ],
  ogTitle: "Every question from every first call, answered",
});

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function FaqPage() {
  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqSchema(faqs),
        )}
      />

      <Section className="pb-8 pt-12 md:pt-16">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]}
        />
        <SectionHeader
          as="h1"
          eyebrow="Frequently asked questions"
          title="The questions that come up in every first call"
          description="Answered here in full so the first conversation can be about your project rather than about how I work. Every answer is also in the AI assistant's knowledge base — ask it directly if you prefer."
        />

        <nav aria-label="FAQ categories" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <li key={category}>
                <a
                  href={`#${slugify(category)}`}
                  className="inline-block rounded-full border border-ink-100/12 px-3.5 py-2 text-sm text-ink-300 transition-colors hover:border-brand-400/40 hover:text-ink-50"
                >
                  {category}
                  <span className="ml-1.5 text-ink-500">
                    {faqs.filter((f) => f.category === category).length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      {faqCategories.map((category, index) => {
        const items = faqs.filter((f) => f.category === category);
        return (
          <Section
            key={category}
            id={slugify(category)}
            className={`scroll-mt-24 py-12 md:py-14 ${index > 0 ? "border-t border-ink-100/8" : "pt-0"}`}
          >
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-50 md:text-3xl">
              {category}
            </h2>
            <div className="mt-6 max-w-4xl">
              <FaqSection items={items} />
            </div>
          </Section>
        );
      })}

      <Section className="border-t border-ink-100/8 py-12">
        <FaqFooterNote />
        <p className="mt-3 text-sm text-ink-500">
          Looking for something more specific? The{" "}
          <Link href="/services" className="text-brand-400 underline underline-offset-4">
            service pages
          </Link>{" "}
          each carry their own FAQ, and the{" "}
          <Link href="/pricing" className="text-brand-400 underline underline-offset-4">
            pricing page
          </Link>{" "}
          explains how engagements are structured.
        </p>
      </Section>

      <CtaSection />
    </>
  );
}
