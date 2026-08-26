import { Layers, Database, Sparkles, Gauge } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { services } from "@/content/site";

const icons = [Layers, Database, Sparkles, Gauge];

export function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="What I build"
          title={<>Four things, done properly,<br className="hidden sm:block" /> instead of everything, done adequately.</>}
          lead="Most studios list twenty services. These are the four I have shipped repeatedly and can quote confidently on a first call."
        />

        <BentoGrid className="mt-16 md:auto-rows-[19rem]">
          {services.map((s, i) => {
            const Icon = icons[i];
            return (
              <BlurFade key={s.title} delay={i * 0.08} className={s.span}>
                <BentoGridItem
                  className="h-full"
                  title={s.title}
                  description={s.description}
                  header={
                    <div className="flex items-start justify-between">
                      <span className="rounded-full border border-brass-600/30 bg-brass-500/8 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-brass-400 uppercase">
                        {s.tag}
                      </span>
                      <span className="font-mono text-xs text-ink-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  }
                  icon={
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-600/70 bg-ink-800/70 text-brass-400 transition-colors duration-500 group-hover/bento:border-brass-600/45 group-hover/bento:text-brass-300">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                  }
                />
              </BlurFade>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
