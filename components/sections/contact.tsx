"use client";
import Image from "next/image";
import { ArrowUpRight, Github, Mail, Clock, MapPin } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Meteors } from "@/components/ui/meteors";
import { DotPattern } from "@/components/ui/dot-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grain relative isolate overflow-hidden rounded-3xl border border-ink-700/70 bg-ink-900/70 px-6 py-16 md:px-16 md:py-24">
          {/* studio photo again, whisper-quiet, anchoring the closing panel */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <Image
              src="/studio.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="pointer-events-none object-cover object-left opacity-[0.13] mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/90 to-ink-900/70" />
          </div>
          <DotPattern className="[mask-image:radial-gradient(420px_circle_at_70%_30%,white,transparent)] opacity-40" />
          <Meteors number={10} />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <BlurFade>
              <p className="font-mono text-[11px] tracking-[0.24em] text-brass-500 uppercase">
                Next step
              </p>
            </BlurFade>

            <TextGenerateEffect
              words="Tell me what you are building and who has to believe in it."
              className="mt-6 font-display text-3xl leading-[1.1] text-cream-100 sm:text-4xl md:text-5xl"
            />

            <BlurFade delay={0.2}>
              <p className="text-balance-pretty mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream-300">
                A 45-minute call, no charge and no pitch deck. You will leave it with a
                clear view of scope, cost and timing — even if you decide to build it
                somewhere else.
              </p>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={site.calendly} aria-label="Email Deepak to book a call">
                  <ShimmerButton className="text-sm">
                    <span className="inline-flex items-center gap-2">
                      Book a positioning call
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </ShimmerButton>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="uv-ghost inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium"
                >
                  <Mail className="h-4 w-4" />
                  {site.email}
                </a>
              </div>
            </BlurFade>

            <BlurFade delay={0.4}>
              <dl className="mt-14 grid gap-6 border-t border-ink-700/60 pt-10 sm:grid-cols-3">
                {[
                  { Icon: Clock, term: "Response time", detail: "Within one working day" },
                  { Icon: MapPin, term: "Working hours", detail: "CET mornings · full IST" },
                  { Icon: Github, term: "Code is public", detail: "codehippies11" },
                ].map(({ Icon, term, detail }) => (
                  <div key={term} className="flex flex-col items-center gap-2">
                    <Icon className="h-4 w-4 text-brass-500" strokeWidth={1.5} />
                    <dt className="font-mono text-[10px] tracking-[0.16em] text-cream-300/60 uppercase">
                      {term}
                    </dt>
                    <dd className="text-sm text-cream-100">{detail}</dd>
                  </div>
                ))}
              </dl>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
