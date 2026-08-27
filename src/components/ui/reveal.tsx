"use client";

import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal.
 *
 * Two decisions here are load-bearing, and both were made because measurement
 * said so:
 *
 * 1. No animation library. This component is on essentially every page, so a
 *    runtime for it put ~40KB on the critical path of the whole site and cost
 *    roughly 150ms of total blocking time on a throttled mobile CPU. An
 *    IntersectionObserver and a CSS transition do the same job.
 *
 * 2. Nothing is hidden by CSS before hydration. An earlier version hid every
 *    Reveal until its observer fired, which pushed LCP render delay to 2.2s —
 *    the page painted at 1.0s but its largest element was invisible until the
 *    bundle ran. Now the server HTML is fully visible, and the hidden state is
 *    applied on mount ONLY to elements already below the fold. Elements in the
 *    first screen are never hidden, so they can never delay LCP, and content
 *    is fully readable if JavaScript never runs at all.
 *
 * Transform and opacity only, so it composites off the main thread and cannot
 * contribute layout shift. Reduced motion opts out entirely.
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Reveal({
  children,
  delay = 0,
  className,
  as: Component = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only animate what the visitor has not already seen. Anything in the
    // first viewport stays visible and is left alone.
    if (node.getBoundingClientRect().top < window.innerHeight - 40) return;

    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setArmed(false);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      // Cast: the union of element ref types is not expressible here without
      // generics that would leak into every call site.
      ref={ref as React.Ref<never>}
      data-reveal={armed ? "pending" : "shown"}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Component>
  );
}
