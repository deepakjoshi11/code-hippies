"use client";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  className, size = 220, duration = 12, delay = 0,
  colorFrom = "#c8873f", colorTo = "#f0c48a",
}: BorderBeamProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
      aria-hidden="true"
    >
      <div
        className={cn(
          "animate-border-beam absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            "--duration": duration,
            animationDelay: `${delay}s`,
          } as CSSProperties
        }
      />
    </div>
  );
}
