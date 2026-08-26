"use client";
import { useState } from "react";
import { Check, ArrowUpRight } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { RetroGrid } from "@/components/ui/retro-grid";
import { pricing, retainer } from "@/content/site";
import { cn } from "@/lib/utils";

type Currency = "eur" | "inr";

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>("eur");
  const symbol = currency === "eur" ? "€" : "₹";

  return (
    <section id="pricing" className="relative overflow-hidden py-24 md:py-32">
      <RetroGrid className="opacity-[0.13]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="Investment"
          title="Fixed prices, published openly."
          lead="You should not have to sit through a discovery call to find out whether you can afford the work. Here is what it costs. Fifty percent reserves your dates, fifty percent on launch."
        />

        {/* Uiverse-style currency toggle */}
        <BlurFade delay={0.2}>
          <div className="mt-10 flex justify-center">
            <div
              role="tablist"
              aria-label="Choose currency"
              className="relative inline-flex items-center gap-1 rounded-full border border-ink-700/70 bg-ink-900/70 p-1 backdrop-blur-sm"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-br from-brass-400 to-brass-600 transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                  currency === "eur" ? "translate-x-0" : "translate-x-[calc(100%+0.25rem)]"
                )}
              />
              {(["eur", "inr"] as Currency[]).map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={currency === c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "relative z-10 rounded-full px-6 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-colors duration-300",
                    currency === c ? "text-ink-950" : "text-cream-300 hover:text-cream-100"
                  )}
                >
                  {c === "eur" ? "€ EUR" : "₹ INR"}
                </button>
              ))}
            </div>
          </div>
        </BlurFade>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricing.map((tier, i) => (
            <BlurFade key={tier.name} delay={i * 0.09}>
              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 backdrop-blur-sm transition-all duration-500",
                  tier.featured
                    ? "border-brass-600/50 bg-gradient-to-b from-ink-850 to-ink-900 shadow-[0_30px_90px_-40px_rgba(200,135,63,0.55)] lg:-mt-4 lg:mb-4"
                    : "border-ink-700/70 bg-ink-900/60 hover:border-brass-600/35"
                )}
              >
                {tier.featured && <BorderBeam duration={11} size={230} />}

                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-cream-100">{tier.name}</h3>
                  {tier.featured && (
                    <span className="rounded-full bg-brass-500/15 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-brass-300 uppercase">
                      Most chosen
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-cream-300/85">{tier.fit}</p>

                <div className="mt-7 flex items-baseline gap-1.5">
                  <span className="font-display text-2xl text-brass-500">{symbol}</span>
                  <span className="font-display text-5xl text-cream-100 tabular-nums">
                    {currency === "eur" ? tier.eur : tier.inr}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-cream-300/60 uppercase">
                  Fixed price · {tier.timeline}
                </p>

                <div className="hairline my-7 h-px w-full" />

                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-cream-200/90">
                      <Check
                        className={cn("mt-0.5 h-4 w-4 shrink-0", tier.featured ? "text-brass-400" : "text-brass-600")}
                        strokeWidth={2}
                      />
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="grow" />

                <a
                  href="#contact"
                  className={cn(
                    "group mt-9 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium",
                    tier.featured ? "uv-brass" : "uv-ghost"
                  )}
                >
                  Start with {tier.name}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </BlurFade>
          ))}
        </div>

        {/* Retainer */}
        <BlurFade delay={0.3}>
          <div className="mt-8 flex flex-col gap-8 rounded-2xl border border-ink-700/70 bg-ink-900/50 p-8 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-xl">
              <h3 className="font-display text-2xl text-cream-100">Already launched? Retainer.</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-300">
                For teams shipping continuously. A reserved block of my week, every week,
                without renegotiating a scope each time.
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {retainer.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-cream-300/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" strokeWidth={2} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 text-left md:text-right">
              <div className="flex items-baseline gap-1.5 md:justify-end">
                <span className="font-display text-xl text-brass-500">{symbol}</span>
                <span className="font-display text-4xl text-cream-100 tabular-nums">
                  {currency === "eur" ? retainer.eur : retainer.inr}
                </span>
                <span className="text-sm text-cream-300/70">/mo</span>
              </div>
              <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-cream-300/60 uppercase">
                Rolling · one month notice
              </p>
              <a href="#contact" className="uv-ghost mt-5 inline-flex rounded-full px-6 py-3 text-sm font-medium">
                Enquire about retainers
              </a>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.36}>
          <p className="mt-8 text-center text-xs leading-relaxed text-cream-300/55">
            Prices exclude VAT/GST where applicable. European clients are invoiced in euros
            by bank transfer; Indian clients in rupees. Indicative conversion only — your
            quote is issued in a single currency and fixed for 30 days.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
