import Link from "next/link";
import type { Faq } from "@/data/faq";
import { Reveal } from "@/components/ui/reveal";

/**
 * FAQ block. Rendered as native <details> so every answer is in the HTML and
 * readable by crawlers and assistive technology without JavaScript, while
 * still collapsing for readability. Paired with FAQPage JSON-LD at the page
 * level.
 */
export function FaqSection({
  items,
  showCategories = false,
}: {
  items: Faq[];
  showCategories?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((faq, i) => (
        <Reveal as="li" key={faq.q} delay={Math.min(i, 6) * 0.04}>
          <details className="group rounded-card border border-ink-100/10 bg-ink-900/50 transition-colors hover:border-ink-100/20 open:border-brand-400/25 open:bg-ink-900/70">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
              <div className="flex flex-col gap-1.5">
                {showCategories ? (
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.15em] text-ink-500">
                    {faq.category}
                  </span>
                ) : null}
                <h3 className="text-base font-medium leading-snug text-ink-50 md:text-[1.05rem]">
                  {faq.q}
                </h3>
              </div>
              <span
                aria-hidden="true"
                className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-ink-100/15 text-ink-300 transition-transform duration-300 group-open:rotate-45 group-open:border-brand-400/40 group-open:text-brand-400"
              >
                <svg viewBox="0 0 12 12" className="size-3 fill-none stroke-current stroke-[1.6]">
                  <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 md:px-6 md:pb-6">
              <p className="max-w-3xl text-[0.95rem] leading-relaxed text-ink-300">{faq.a}</p>
            </div>
          </details>
        </Reveal>
      ))}
    </ul>
  );
}

export function FaqFooterNote() {
  return (
    <p className="mt-8 text-sm text-ink-500">
      Question not covered here? Ask the{" "}
      <span className="text-ink-200">AI assistant in the corner</span> — it answers from this site&rsquo;s
      knowledge base and tells you honestly when it does not know. Or{" "}
      <Link href="/contact" className="text-brand-400 underline underline-offset-4">
        send the brief directly
      </Link>
      .
    </p>
  );
}
