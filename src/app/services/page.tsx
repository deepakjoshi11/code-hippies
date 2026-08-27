import type { Metadata } from "next";
import { services } from "@/data/services";
import { ServiceCards } from "@/components/sections/service-cards";
import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, graph, professionalServiceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { faqs } from "@/data/faq";

export const metadata: Metadata = pageMetadata({
  title: "Services — Web, Mobile, AI/LLM & Security",
  description:
    "Five engineering offers: Next.js web development, iOS and Android apps, grounded AI systems, technical SEO and Core Web Vitals, and OWASP security review.",
  path: "/services",
  keywords: [
    "hire full-stack developer India",
    "AI LLM engineer for startups",
    "React Next.js developer for hire",
    "iOS Android developer for startups",
    "technical SEO engineer",
  ],
  ogTitle: "Five services, each with its own scope and deliverables",
});

const serviceFaqs = faqs.filter((f) => f.category === "Technology" || f.category === "Scope & pricing");

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd
        json={graph(
          professionalServiceSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          faqSchema(serviceFaqs),
        )}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]}
        />
        <SectionHeader
          as="h1"
          eyebrow="Services"
          title="Five things, done properly"
          description="Each of these is a distinct offer with its own scope, deliverables and definition of done. The stack inside each one is chosen against your constraints — not every project uses every technology listed."
        />
      </Section>

      <Section className="pt-0">
        <ServiceCards headingLevel="h2" />
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="Comparison"
          title="Which one do you actually need?"
          description="If you are not sure, the shortest route is a one-week audit — SEO, performance or security — which gives you a prioritised findings list before you commit to anything bigger."
        />
        {/* Focusable so a keyboard user can scroll it — WCAG 2.1.1. */}
        <div
          className="mt-10 overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Services compared by best fit and typical engagement length"
        >
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Code Hippies services compared by typical engagement length and best fit
            </caption>
            <thead>
              <tr className="border-b border-ink-100/12 text-xs uppercase tracking-[0.12em] text-ink-500">
                <th scope="col" className="py-3 pr-4 font-medium">Service</th>
                <th scope="col" className="py-3 pr-4 font-medium">Best when</th>
                <th scope="col" className="py-3 font-medium">Typical length</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.slug} className="border-b border-ink-100/8 align-top">
                  <th scope="row" className="py-4 pr-4 font-medium text-ink-50">
                    {s.name}
                  </th>
                  <td className="py-4 pr-4 text-ink-300">{s.longTailTarget}</td>
                  <td className="py-4 text-ink-300">{s.startingPoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="border-t border-ink-100/8">
        <SectionHeader
          eyebrow="FAQ"
          title="Scope, pricing and technology questions"
        />
        <div className="mt-10">
          <FaqSection items={serviceFaqs} showCategories />
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
