import { craftToAi } from "@/data/positioning";
import { Reveal } from "@/components/ui/reveal";

/**
 * The craft-to-AI story — the positioning spine of the site. Static markup so
 * the whole argument is in the HTML for crawlers and for readers without
 * JavaScript.
 */
export function CraftToAi() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {craftToAi.columns.map((column, i) => (
        <Reveal key={column.label} delay={i * 0.06}>
          <div className="h-full rounded-card border border-ink-100/10 bg-ink-900/50 p-6 md:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-ink-50">{column.label}</h3>
              <span className="shrink-0 rounded-full border border-ink-100/12 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.12em] text-ink-500">
                {column.period}
              </span>
            </div>
            <ul className="mt-5 flex flex-col gap-3">
              {column.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-300">
                  <span
                    aria-hidden="true"
                    className={
                      i === 0
                        ? "mt-2 size-1.5 shrink-0 rounded-full bg-ink-500"
                        : "mt-2 size-1.5 shrink-0 rounded-full bg-brand-400"
                    }
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
      <p className="md:col-span-2 rounded-card border border-brand-400/25 bg-brand-500/6 p-5 text-[0.95rem] leading-relaxed text-ink-200">
        {craftToAi.closing}
      </p>
    </div>
  );
}
