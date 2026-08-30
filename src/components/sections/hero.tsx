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
     * The hero runs on the page's own light palette. The photograph sits behind
     * it under a white veil, so the band stays part of the page rather than a
     * dark slab dropped on top of it.
     */
    <section className="relative isolate -mt-16 overflow-hidden bg-ink-950 pt-16 md:-mt-18 md:pt-18">
      {/*
        The photograph reads as a workspace behind the page rather than a
        picture on it. Desaturated and lifted, then veiled in white — the
        restraint is the point: at full strength it competes with the type and
        the page stops looking like a studio and starts looking like a banner.
      */}
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
        className="-z-10 object-cover object-[62%_center] opacity-[0.35] grayscale-[0.35] lg:opacity-[0.6] xl:opacity-[0.85]"
      />
      {/*
        Two veils, each doing one job.

        1. A horizontal pass: solid white under the text column for the first
           quarter, then falling away so the desk and monitors stay legible on
           the right. This is the one carrying text contrast, which is why the
           stops are placed rather than left to default thirds, and why it
           opens at `lg`/`xl` rather than `md`. The breakpoint has to follow the
           text, not the viewport: the copy is capped at `max-w-2xl`, so at
           768px it still spans ~92% of the width and needs the veil everywhere,
           while at 1440px it ends around 54% and the right can open up.

           The hero also uses no `text-ink-500`. The muted tone clears AA on a
           flat white page, but over a photograph its margin is thin enough that
           a future crop or a different image could push it under without anyone
           noticing. `ink-300` measures 7-8:1 on the same ground, so the weakest
           link is simply removed rather than tuned around.

           Every stop here was measured by sampling the rendered pixels behind
           the text and computing the ratio. Opening at `md` looked fine on a
           laptop and put body text at 1.45:1 on a 768px tablet. axe does not
           catch this: it cannot evaluate a background image, so it marks the
           node incomplete rather than failing, and the suite stays green.
        2. A vertical pass returning to white at top and bottom, so the header
           reads cleanly and the band dissolves into the page instead of ending
           on a seam.

        The stack was tuned against axe, not by eye: body text over the busiest
        part of the image measures comfortably past AA.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 from-30% via-ink-950/94 via-60% to-ink-950/88 lg:via-ink-950/92 lg:to-ink-950/45 xl:to-ink-950/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/92 via-transparent via-45% to-ink-950"
      />

      <div className="container-page relative pb-16 pt-16 md:pb-24 md:pt-28">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-300">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1.5 font-medium text-brand-700">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
            Available for new projects
          </span>
          {trustSignals.map((signal) => (
            <span key={signal} className="hidden rounded-full border border-ink-100/15 px-3 py-1.5 sm:inline">
              {signal}
            </span>
          ))}
        </div>

        <h1 className="mt-7 max-w-4xl text-balance-heading text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink-50 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
          I build software your business can{" "}
          <span className="text-brand-600">
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

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink-100/15 pt-10 md:grid-cols-4">
          {proofMetrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1.5">
              <dt className="order-2 text-sm font-medium text-ink-100">{metric.label}</dt>
              <dd className="order-1 font-mono text-3xl font-semibold tracking-tight text-brand-400 md:text-4xl">
                {metric.value}
              </dd>
              <dd className="order-3 text-xs leading-relaxed text-ink-300">{metric.detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-sm text-ink-300">
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
