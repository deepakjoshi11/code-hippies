"use client";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { motion } from "motion/react";
import { Spotlight } from "@/components/ui/spotlight";
import { Meteors } from "@/components/ui/meteors";
import { DotPattern } from "@/components/ui/dot-pattern";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedGradientText, GradientText } from "@/components/ui/animated-gradient-text";
import { site, stats } from "@/content/site";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section id="top" className="grain relative isolate overflow-hidden pt-[72px]">
      {/* Studio photograph, held far back so it reads as texture rather than a picture */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/studio.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover object-right opacity-[0.16] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/85" />
      </div>

      <Spotlight className="-top-40 left-0 md:-top-20 md:left-56" fill="#c8873f" />
      <DotPattern className="[mask-image:radial-gradient(560px_circle_at_center,white,transparent)] opacity-45" />
      <Meteors number={14} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-16 pb-24 md:px-8 md:pt-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedGradientText>
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brass-400" />
            <GradientText className="font-mono text-xs tracking-[0.14em] uppercase">
              Two client slots open · Q4 2026
            </GradientText>
          </AnimatedGradientText>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-8 max-w-4xl font-display text-[2.6rem] leading-[1.05] text-cream-100 sm:text-6xl md:text-7xl lg:text-[5.2rem]"
        >
          Websites that carry the
          <br className="hidden sm:block" />{" "}
          weight of a{" "}
          <span className="relative inline-block italic">
            <GradientText>serious</GradientText>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="10"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 7 C 55 2, 145 2, 198 6"
                stroke="#c8873f"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.75"
              />
            </svg>
          </span>{" "}
          brand.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="text-balance-pretty mt-8 max-w-2xl text-base leading-relaxed text-cream-300 md:text-lg"
        >
          I&rsquo;m {site.founder} — I run {site.name}, a deliberately small studio
          building editorial-grade marketing sites in Astro and Next.js. Fast enough
          to pass any audit, considered enough to sit beside your print work, and
          priced so the decision doesn&rsquo;t need a board meeting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#contact"
            className="uv-brass group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium"
          >
            Book a positioning call
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#work"
            className="uv-ghost inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium"
          >
            See the work
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-2 py-4 text-sm text-cream-300 transition-colors hover:text-brass-400"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </motion.div>

        {/* Proof strip */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-700/40 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-ink-950/80 px-6 py-7 backdrop-blur-sm">
              <dd className="font-display text-3xl text-brass-400 md:text-4xl">
                <NumberTicker value={s.value} />
                {s.suffix}
              </dd>
              <dt className="mt-2 text-sm font-medium text-cream-100">{s.label}</dt>
              <p className="mt-1 text-xs leading-relaxed text-cream-300/70">{s.note}</p>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className={cn("hairline h-px w-full")} />
    </section>
  );
}
