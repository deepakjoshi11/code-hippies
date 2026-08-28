import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { consentCopy } from "@/lib/analytics/consent";
import { site } from "@/lib/site";
import { ConsentControls } from "@/components/consent/consent-controls";

export const metadata: Metadata = pageMetadata({
  title: "Privacy — What Is Collected, and What Is Not",
  description:
    "Exactly what this site collects, when, and why. Nothing that identifies you without consent, no data sold, and ad scripts never requested unless you accept them.",
  path: "/privacy",
  keywords: ["privacy policy", "cookie policy", "GDPR DPDP compliance"],
  ogTitle: "What this site collects, and what it does not",
});

const NEVER = [
  "Your IP address is never stored. It is used in memory to rate-limit the contact form and then discarded.",
  "No advertising script is loaded unless you accept the advertising category. Declining means it is never requested at all — not loaded in a limited mode.",
  "No cross-site tracking, no fingerprinting, no data broker, nothing sold. Ever.",
  "No precise location. Country is the most granular geography recorded, and only with attribution consent.",
  "No profile that outlives your visit. The session id lives in your tab and dies when you close it.",
];

export default function PrivacyPage() {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Privacy", path: "/privacy" },
  ];

  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(trail))} />

      <Section className="pb-10 pt-12 md:pt-16">
        <Breadcrumbs trail={trail} />
        <SectionHeader
          as="h1"
          eyebrow="Privacy"
          title="What this site collects, and what it does not"
          description="Written to be read rather than to satisfy a lawyer. If anything below turns out not to match what the code does, the code is the bug — the implementation is open in the repository and you are welcome to check it."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-50">
                Never collected, regardless of what you choose
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {NEVER.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-300">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-50">
                The three categories
              </h2>
              <ul className="mt-5 flex flex-col gap-4">
                {(["essential", "analytics", "attribution", "advertising"] as const).map((key) => (
                  <li
                    key={key}
                    className="rounded-card border border-ink-100/10 bg-ink-900/50 p-5"
                  >
                    <h3 className="text-base font-medium text-ink-50">
                      {consentCopy[key].label}
                      {consentCopy[key].locked ? (
                        <span className="ml-2 text-xs font-normal text-ink-500">always on</span>
                      ) : (
                        <span className="ml-2 text-xs font-normal text-ink-500">opt-in only</span>
                      )}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-300">
                      {consentCopy[key].body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-50">
                When you send a project brief
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-300">
                The contact form collects your name, email, optional company, project type, budget
                band, timeline and message. That information is used to reply to your enquiry and
                for nothing else — no list, no newsletter, no third-party sharing. It is validated
                on the server, the endpoint is CSRF-protected and rate-limited, and it reaches me
                either by email or through a private webhook.
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-300">
                Ask me to delete it and I will, on request, without asking why.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-50">
                The AI assistant
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-300">
                When the assistant cannot answer a question, the question text is logged so I can
                see which content is missing. Email addresses and phone numbers are stripped from
                that text before it is written, and nothing about who asked is recorded. It is a
                list of questions, not a list of people.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-50">
                Sharing with Dharmarthlabs
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-300">
                Dharmarthlabs is the company I founded, and aggregate analytics from this site are
                forwarded to its dashboard over a signed, authenticated connection. Only the
                categories you consented to are forwarded, and the same server-side rules apply —
                if you declined attribution, referrer and country are stripped before anything
                leaves this site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-50">Your rights</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-300">
                Under GDPR and India&rsquo;s DPDP Act you can ask what is held about you, ask for it
                to be corrected or deleted, withdraw consent at any time, and object to processing.
                Email{" "}
                <a href={`mailto:${site.email}`} className="text-brand-400 underline underline-offset-4">
                  {site.email}
                </a>{" "}
                and you will get a reply, not a form. Withdrawing consent takes one click, on the
                right of this page.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                This page describes what the software actually does. It is not legal advice, and a
                business with specific regulatory obligations should have a lawyer review its own
                policy text.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ConsentControls />
          </aside>
        </div>
      </Section>
    </>
  );
}
