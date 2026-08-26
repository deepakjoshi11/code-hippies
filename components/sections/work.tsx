"use client";
import { ArrowUpRight, Check } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { BorderBeam } from "@/components/ui/border-beam";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { work } from "@/content/site";
import { cn } from "@/lib/utils";

export function Work() {
  return (
    <section id="work" className="relative py-24 md:py-32">
      {/* soft brass wash behind the section */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brass-500/6 blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Selected work"
          title={<>Three builds, and what each one had to solve.</>}
          lead="Small studio, small portfolio — every project here is one I wrote myself, and every repository is public so you can read the code before you hire me."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {work.map((p, i) => (
            <BlurFade key={p.name} delay={i * 0.1}>
              <CardContainer containerClassName="h-full py-0" className="h-full w-full">
                <CardBody
                  className={cn(
                    "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl",
                    "border border-ink-700/70 bg-ink-900/70 p-7 backdrop-blur-sm",
                    "transition-colors duration-500 hover:border-brass-600/45"
                  )}
                >
                  <div
                    className={cn("pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b", p.accent)}
                    aria-hidden="true"
                  />
                  {i === 0 && <BorderBeam duration={14} size={180} />}

                  <CardItem translateZ={40} className="relative z-10 flex w-full items-center justify-between">
                    <span className="rounded-full border border-ink-600/70 bg-ink-800/80 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-cream-300 uppercase">
                      {p.kind}
                    </span>
                    <span className="font-mono text-xs text-ink-500">{p.year}</span>
                  </CardItem>

                  <CardItem translateZ={60} className="relative z-10 mt-6 w-full">
                    <h3 className="font-display text-2xl text-cream-100 md:text-3xl">{p.name}</h3>
                  </CardItem>

                  <CardItem translateZ={30} className="relative z-10 mt-3 w-full">
                    <p className="text-sm leading-relaxed text-cream-300">{p.summary}</p>
                  </CardItem>

                  <CardItem translateZ={20} className="relative z-10 mt-6 w-full">
                    <ul className="space-y-2.5">
                      {p.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-2.5 text-sm text-cream-300/85">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass-500" strokeWidth={2} />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </CardItem>

                  <div className="grow" />

                  <CardItem translateZ={25} className="relative z-10 mt-7 w-full">
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-ink-600/60 bg-ink-800/60 px-2 py-1 font-mono text-[10px] text-cream-300/75"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </CardItem>

                  <CardItem
                    as="a"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    translateZ={50}
                    className="relative z-10 mt-6 inline-flex w-full items-center gap-1.5 border-t border-ink-700/70 pt-5 text-sm font-medium text-brass-400 transition-colors hover:text-brass-300"
                  >
                    Read the source
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
