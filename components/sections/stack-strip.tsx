import { Marquee } from "@/components/ui/marquee";
import { stack } from "@/content/site";

export function StackStrip() {
  return (
    <section aria-label="Technologies" className="relative overflow-hidden border-y border-ink-800/70 bg-ink-900/40 py-6">
      <Marquee pauseOnHover className="[--duration:48s] [--gap:3rem]">
        {stack.map((s) => (
          <span
            key={s}
            className="font-mono text-sm tracking-[0.12em] whitespace-nowrap text-cream-300/55 uppercase transition-colors duration-300 hover:text-brass-400"
          >
            {s}
            <span className="ml-12 text-brass-600/40" aria-hidden="true">/</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
