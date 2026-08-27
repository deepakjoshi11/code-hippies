import { processSteps } from "@/data/process";
import { Reveal } from "@/components/ui/reveal";

export function ProcessTimeline({ compact = false }: { compact?: boolean }) {
  const steps = compact ? processSteps.slice(0, 5) : processSteps;

  return (
    <ol className="relative flex flex-col gap-0 border-l border-ink-100/12 pl-7 md:pl-10">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.n} delay={Math.min(i, 5) * 0.05} className="relative pb-10 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[calc(1.75rem+5px)] top-1.5 grid size-2.5 place-items-center rounded-full bg-brand-400 ring-4 ring-ink-950 md:-left-[calc(2.5rem+5px)]"
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-sm text-brand-400">{step.n}</span>
            <h3 className="text-lg font-semibold tracking-tight text-ink-50 md:text-xl">
              {step.title}
            </h3>
            <span className="rounded-full border border-ink-100/12 px-2.5 py-0.5 text-xs text-ink-400">
              {step.duration}
            </span>
          </div>
          <p className="mt-2.5 max-w-2xl text-[0.95rem] leading-relaxed text-ink-300">
            {step.summary}
          </p>
          {compact ? null : (
            <div className="mt-5 grid gap-5 md:grid-cols-[1.6fr_1fr]">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-500">
                  What you get
                </h4>
                <ul className="mt-2.5 flex flex-col gap-2">
                  {step.youGet.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-300">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-ink-100/10 bg-ink-900/50 p-4">
                <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-500">
                  What I need from you
                </h4>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{step.fromYou}</p>
              </div>
            </div>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
