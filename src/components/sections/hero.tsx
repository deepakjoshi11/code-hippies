import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { proofMetrics, trustSignals } from "@/data/proof";
import { caseStudies, liveCaseStudies } from "@/data/case-studies";
import { ChannelCta } from "@/components/ui/channel-cta";

/**
 * The blur placeholder is generated at build time alongside the image, not
 * pasted in, so replacing the photograph cannot leave a stale thumbnail of the
 * old one behind. Read on the server — this is a server component.
 */
const heroBlur = fs
  .readFileSync(path.join(process.cwd(), "public", "hero-blur.txt"), "utf8")
  .trim();

export function Hero() {
  const live = liveCaseStudies().length;
  const shipped = caseStudies.length;

  return (
    /**
     * The one dark band on a light site. `surface-dark` swaps the ink and brand
     * ramps for this subtree, so every child below reads as it always did —
     * `text-ink-300` is simply light here instead of dark.
     */
    <section className="surface-dark relative isolate -mt-16 overflow-hidden bg-ink-950 pt-16 md:-mt-18 md:pt-18">
      <Image
        src="/hero-deepak-coding.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={heroBlur}
        className="-z-10 object-cover object-[62%_center] opacity-70 md:opacity-90"
      />
      {/*
        Two scrims rather than one. The horizontal pass keeps the left column
        dark enough for body text at every width; the vertical pass darkens the
        top so the transparent header stays legible over the photograph. Both
        are measured against axe rather than eyeballed.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/70 md:to-ink-950/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/85 via-transparent to-ink-950"
      />

      <div className="container-page relative pb-16 pt-16 md:pb-24 md:pt-28">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-300">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/25 bg-brand-500/8 px-3 py-1.5 font-medium text-brand-200">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
            Available for new projects
          </span>
          {trustSignals.map((signal) => (
            <span key={signal} className="hidden rounded-full border border-ink-100/12 px-3 py-1.5 sm:inline">
              {signal}
            </span>
          ))}
        </div>

        <h1 className="mt-7 max-w-4xl text-balance-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink-50 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          I build software your business can{" "}
          <span className="bg-gradient-to-r from-brand-400 via-brand-200 to-accent-400 bg-clip-text text-transparent">
            actually run on
          </span>
          .
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300 md:text-xl">
          I&rsquo;m <strong className="font-semibold text-ink-100">Deepak Joshi</strong> — ex-Deloitte
          USI, founder of Dharmarthlabs, and the engineer behind{" "}
          <strong className="font-semibold text-ink-100">Code Hippies</strong>. Full-stack web, iOS
          and Android apps, and AI systems that answer from your data instead of inventing answers.{" "}
          {shipped} sites shipped to production and {live} live right now, with every technical
          claim about them read off the live response — so you can check the work rather than take
          my word for it.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink href="/contact" size="lg">
            Start a project <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/work" variant="outline" size="lg">
            See the {live} live builds
          </ButtonLink>
          <ChannelCta variant="ghost" size="lg" className="hidden sm:inline-flex" />
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink-100/10 pt-10 md:grid-cols-4">
          {proofMetrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1.5">
              <dt className="order-2 text-sm font-medium text-ink-100">{metric.label}</dt>
              <dd className="order-1 font-mono text-3xl font-semibold tracking-tight text-brand-400 md:text-4xl">
                {metric.value}
              </dd>
              <dd className="order-3 text-xs leading-relaxed text-ink-500">{metric.detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-sm text-ink-500">
          Not sure what you need yet?{" "}
          <Link href="/faq" className="text-brand-400 underline underline-offset-4">
            Read the FAQ
          </Link>{" "}
          or{" "}
          <Link href="/pricing" className="text-brand-400 underline underline-offset-4">
            see how engagements are priced
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
