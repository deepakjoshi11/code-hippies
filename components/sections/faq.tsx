"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { faqs } from "@/content/site";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          {/* The grid item must stay stretched to the full row height, otherwise
              the sticky child has no travel to stick through. */}
          <div>
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Straight answers"
                title="The questions you were going to ask on the call."
                lead="Answered here so the call can be about your business instead."
              />
            </div>
          </div>

          <div className="divide-y divide-ink-700/60 border-y border-ink-700/60">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <BlurFade key={f.q} delay={i * 0.04}>
                  <div>
                    <h3>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span
                          className={cn(
                            "font-display text-lg transition-colors duration-300 md:text-xl",
                            isOpen ? "text-brass-400" : "text-cream-100 group-hover:text-brass-400"
                          )}
                        >
                          {f.q}
                        </span>
                        <span
                          className={cn(
                            "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-400",
                            isOpen
                              ? "rotate-45 border-brass-500/60 bg-brass-500/12 text-brass-400"
                              : "border-ink-600 text-cream-300 group-hover:border-brass-600/50"
                          )}
                          aria-hidden="true"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-balance-pretty max-w-2xl pr-12 pb-7 text-sm leading-relaxed text-cream-300 md:text-base">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
