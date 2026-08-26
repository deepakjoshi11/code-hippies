import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";

export function SectionHeading({
  eyebrow, title, lead, align = "left", className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <BlurFade>
        <p className="font-mono text-[11px] tracking-[0.24em] text-brass-500 uppercase">
          <span className="mr-3 inline-block h-px w-8 translate-y-[-4px] bg-brass-600/60" aria-hidden="true" />
          {eyebrow}
        </p>
      </BlurFade>
      <BlurFade delay={0.08}>
        <h2 className="mt-5 font-display text-3xl leading-[1.12] text-cream-100 sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </BlurFade>
      {lead && (
        <BlurFade delay={0.14}>
          <p className="text-balance-pretty mt-5 text-base leading-relaxed text-cream-300 md:text-lg">
            {lead}
          </p>
        </BlurFade>
      )}
    </div>
  );
}
