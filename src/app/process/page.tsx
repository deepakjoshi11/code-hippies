import type { Metadata } from "next";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CtaSection } from "@/components/sections/cta-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { processSteps } from "@/data/process";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Process — How a Project Actually Runs",
  description:
    "Nine stages from discovery to maintenance, each with a defined output and a defined client responsibility. Discovery before pricing, scope in writing.",
  path: "/process",
  keywords: [
    "software development process",
    "how a freelance developer works",
    "project discovery to handover",
  ],
  ogTitle: "You always know what happens next",
});

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Process", path: "/process" },
          ]),
          {
            "@type": "HowTo",
            name: "How a Code Hippies project runs",
            description:
              "The nine stages of a Code Hippies engagement, from discovery through to optional ongoing maintenance.",
            url: absoluteUrl("/process"),
            step: processSteps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.summary,
            })),
          },
        )}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Process", path: "/process" },
          ]}
        />
        <SectionHeader
          as="h1"
          eyebrow="Process"
          title="Nine stages, and what each one owes you"
          description="Projects rarely fail because of code. They fail because nobody wrote down what was in scope, who was deciding, and what happens when something changes. Each stage below has a defined output and a defined thing I need from you."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Discovery before pricing",
              body: "A price quoted before the scope is understood is wrong in one direction or the other. Discovery comes first, always.",
            },
            {
              title: "Scope in writing",
              body: "You sign off on a written scope with an explicit out-of-scope list. Both halves matter equally.",
            },
            {
              title: "Changes are quoted",
              body: "Not silently absorbed, which ends in a rushed delivery, and not silently dropped, which ends in a launch missing something you assumed.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardBody className="flex flex-col gap-2.5">
                <Eyebrow>Ground rule</Eyebrow>
                <h2 className="text-base font-semibold text-ink-50">{item.title}</h2>
                <p className="text-sm leading-relaxed text-ink-300">{item.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <ProcessTimeline />
      </Section>

      <CtaSection
        title="Start at stage one"
        description="Discovery is three to five days and ends with a written problem statement, a stack recommendation and a fixed-scope proposal. You keep all of it whether or not we continue."
      />
    </>
  );
}
