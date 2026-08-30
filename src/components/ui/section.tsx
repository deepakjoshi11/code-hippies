import * as React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./card";

/**
 * Standard vertical rhythm for a page section.
 *
 * Gotcha worth knowing before you override the padding: the default carries an
 * `md:` variant, and tailwind-merge only resolves conflicts *within* a variant.
 * So `className="pt-0"` cancels `py-20` at mobile but loses to `md:py-28` from
 * 768px up, silently leaving the padding it was written to remove. Any padding
 * override must restate itself at `md` — `pt-0 md:pt-0`.
 *
 * This shipped as ~112px of dead space above the content on most pages before
 * anyone noticed, because it is invisible on a phone and looks like design on a
 * desktop.
 */
export function Section({
  className,
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)} {...props}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "max-w-3xl",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading className="text-balance-heading text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-ink-50 md:text-[2.75rem]">
        {title}
      </Heading>
      {description ? (
        <p className="text-balance-heading text-base leading-relaxed text-ink-300 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
