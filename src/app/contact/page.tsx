import type { Metadata } from "next";
import { CalendarClock, Mail, MessageCircle, ShieldCheck } from "lucide-react";

import { LeadForm } from "@/components/forms/lead-form";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph, orgId } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import { buildChannels } from "@/data/channels";

export const metadata: Metadata = pageMetadata({
  title: "Start a Project — Send a Brief",
  description:
    "Send a project brief: type, budget band and timeline. Two minutes, and the first conversation starts with a scoped recommendation, not with basics.",
  path: "/contact",
  keywords: [
    "hire Deepak Joshi",
    "contact Code Hippies",
    "start a web development project",
    "hire full-stack developer India",
  ],
  ogTitle: "Tell me what you're building",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ engagement?: string }>;
}) {
  const { engagement } = await searchParams;

  return (
    <>
      <JsonLd
        json={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@type": "ContactPage",
            url: absoluteUrl("/contact"),
            name: "Start a project with Code Hippies",
            about: { "@id": orgId },
          },
        )}
      />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]}
        />
        <SectionHeader
          as="h1"
          eyebrow="Start a project"
          title="Tell me what you're building"
          description="Three short steps: what kind of project, what budget band and timeline, then the detail. It takes about two minutes and it means the first conversation is about your project rather than about basics."
        />
      </Section>

      <Section className="pt-0 md:pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div className="rounded-card border border-ink-100/10 bg-ink-900/50 p-6 md:p-8">
            <LeadForm defaultEngagement={engagement} />
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-4">
                <Eyebrow>Faster routes</Eyebrow>
                {buildChannels()
                  .filter((c) => c.kind === "messaging" || c.kind === "direct")
                  .map((c) => (
                    <a
                      key={c.id}
                      href={c.href!}
                      target={c.href!.startsWith("http") ? "_blank" : undefined}
                      rel={c.href!.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-3 rounded-xl border border-ink-100/10 p-3.5 transition-colors hover:border-brand-400/30"
                    >
                      <MessageCircle
                        className="mt-0.5 size-5 shrink-0"
                        style={{ color: c.color }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink-50">{c.label}</span>
                        <span className="block text-xs leading-relaxed text-ink-400">{c.hint}</span>
                      </span>
                    </a>
                  ))}
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-3 rounded-xl border border-ink-100/10 p-3.5 transition-colors hover:border-brand-400/30"
                >
                  <Mail className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-medium text-ink-50">Email</span>
                    <span className="block break-all text-xs leading-relaxed text-ink-400">
                      {site.email}
                    </span>
                  </span>
                </a>
              </CardBody>
            </Card>

            <BookingCard />

            <Card>
              <CardBody className="flex flex-col gap-3">
                <Eyebrow>What happens next</Eyebrow>
                <ol className="flex flex-col gap-2.5 text-sm text-ink-300">
                  {[
                    "A reply within one business day — questions, or a proposed call time.",
                    "A 45-minute discovery call to establish what the software has to do.",
                    "A written problem statement, a stack recommendation and a fixed-scope proposal.",
                  ].map((item, i) => (
                    <li key={item} className="flex gap-2.5 leading-relaxed">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-brand-400/25 font-mono text-[0.65rem] text-brand-400"
                      >
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-ink-400">
                  This form is validated on the server, CSRF-protected and rate-limited. Your
                  details are used to reply to this enquiry and nothing else — no list, no
                  newsletter, no third-party sharing.
                </p>
              </CardBody>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}

/**
 * Calendar booking — the final funnel step (Section 6).
 *
 * Rendered as an embed when NEXT_PUBLIC_CAL_LINK is configured, and as an
 * honest placeholder otherwise. No invented booking URL is shipped.
 */
function BookingCard() {
  const calLink = site.calLink;

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <Eyebrow>Book a discovery call</Eyebrow>
        {calLink ? (
          <>
            <p className="text-xs leading-relaxed text-ink-400">
              45 minutes. Bring the constraints — budget, deadline, anything that already exists and
              cannot change.
            </p>
            <a
              href={`https://cal.com/${calLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
            >
              <CalendarClock className="size-4" aria-hidden="true" />
              Pick a time
            </a>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-ink-400">
            Direct calendar booking switches on once{" "}
            <code className="rounded bg-ink-100/10 px-1 font-mono text-[0.9em] text-ink-200">
              NEXT_PUBLIC_CAL_LINK
            </code>{" "}
            is set. Until then, send the brief or message on WhatsApp and a time gets proposed in
            the reply.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
