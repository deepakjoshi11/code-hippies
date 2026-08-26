"use client";
import { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
}

export function ShimmerButton({
  shimmerColor = "#f0c48a",
  shimmerSize = "0.06em",
  shimmerDuration = "2.8s",
  borderRadius = "999px",
  background = "linear-gradient(135deg,#e0a45c 0%,#c8873f 48%,#a76d2e 100%)",
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={
        {
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        } as CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap",
        "px-7 py-3.5 text-ink-950 [background:var(--bg)] [border-radius:var(--radius)]",
        "font-medium tracking-tight transition-transform duration-300 ease-in-out",
        "hover:-translate-y-0.5 active:translate-y-0",
        "shadow-[0_10px_34px_-12px_rgba(200,135,63,0.7)]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-400",
        className
      )}
      {...props}
    >
      {/* rotating conic sheen, clipped to the border ring */}
      <div className="absolute inset-0 -z-30 overflow-visible [container-type:size]">
        <div className="animate-shimmer-slide absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </div>
      </div>
      <span className="relative z-10">{children}</span>
      {/* highlight */}
      <div className="absolute inset-0 z-10 [border-radius:var(--radius)] shadow-[inset_0_-8px_10px_#ffffff20] transition-all duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff35] group-active:shadow-[inset_0_-10px_10px_#ffffff35]" />
      {/* backdrop that leaves only the ring showing */}
      <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
    </button>
  );
}
