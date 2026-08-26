"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("mx-auto grid grid-cols-1 gap-4 md:grid-cols-3", className)}>{children}</div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "group/bento relative row-span-1 flex flex-col justify-between overflow-hidden rounded-2xl",
        "border border-ink-700/70 bg-ink-900/60 p-6 backdrop-blur-sm",
        "transition-all duration-500 hover:border-brass-600/50 hover:bg-ink-850/80",
        "hover:shadow-[0_24px_70px_-30px_rgba(200,135,63,0.45)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-brass-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover/bento:opacity-100"
        aria-hidden="true"
      />
      {header}
      <div className="relative z-10 mt-4">
        {icon}
        <h3 className="mt-3 font-display text-xl text-cream-100">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-300">{description}</p>
      </div>
    </div>
  );
}
