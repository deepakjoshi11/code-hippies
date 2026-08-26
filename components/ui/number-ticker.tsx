"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export function NumberTicker({
  value, direction = "up", delay = 0, className, decimalPlaces = 0,
}: {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  decimalPlaces?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 90 });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => motionValue.set(direction === "down" ? 0 : value), delay * 1000);
    return () => clearTimeout(t);
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      spring.on("change", (latest: number) => {
        if (!ref.current) return;
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }),
    [spring, decimalPlaces]
  );

  return (
    <span ref={ref} className={cn("inline-block tabular-nums tracking-tight", className)}>
      0
    </span>
  );
}
