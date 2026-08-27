import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ChannelCta } from "@/components/ui/channel-cta";

export function CtaSection({
  title = "Tell me what you're building.",
  description = "Two minutes on the brief form gets you a real conversation: what the software has to do, what it will take, and an honest read on feasibility — whether or not we end up working together.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="border-t border-ink-100/8 py-20 md:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-card border border-ink-100/12 bg-ink-900/60 px-6 py-12 md:px-12 md:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.16),transparent)]"
          />
          <div className="relative flex max-w-2xl flex-col gap-5">
            <h2 className="text-balance-heading text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink-50 md:text-4xl">
              {title}
            </h2>
            <p className="text-base leading-relaxed text-ink-300 md:text-lg">{description}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="lg">
                Start a project <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <ChannelCta variant="outline" size="lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
