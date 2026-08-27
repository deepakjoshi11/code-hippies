import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-ink-100/10 bg-ink-900/60 backdrop-blur-sm transition-colors duration-300 hover:border-ink-100/20",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 md:p-7", className)} {...props} />;
}

export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-[0.18em] text-brand-400",
        className,
      )}
      {...props}
    />
  );
}
