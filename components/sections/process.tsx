"use client";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { process } from "@/content/site";

export function Process() {
  return (
    <section id="process" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="How it runs"
          title={<>No surprises. That is the<br className="hidden sm:block" /> whole promise.</>}
          lead="You will always know what is happening, what it costs, and when it lands. Every stage below has a deliverable you can point at."
        />

        <div className="mt-16">
          <TracingBeam>
            <div className="space-y-10 md:space-y-14">
              {process.map((s, i) => (
                <BlurFade key={s.step} delay={i * 0.05}>
                  <article className="group relative rounded-2xl border border-ink-700/60 bg-ink-900/50 p-7 transition-colors duration-500 hover:border-brass-600/40 md:p-9">
                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                      <span className="font-display text-4xl text-ink-600 transition-colors duration-500 group-hover:text-brass-600/70 md:text-5xl">
                        {s.step}
                      </span>
                      <h3 className="font-display text-2xl text-cream-100 md:text-3xl">{s.title}</h3>
                      <span className="rounded-full border border-brass-600/25 bg-brass-500/8 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-brass-400 uppercase">
                        {s.duration}
                      </span>
                    </div>
                    <p className="text-balance-pretty mt-4 max-w-2xl text-sm leading-relaxed text-cream-300 md:text-base">
                      {s.body}
                    </p>
                  </article>
                </BlurFade>
              ))}
            </div>
          </TracingBeam>
        </div>
      </div>
    </section>
  );
}
