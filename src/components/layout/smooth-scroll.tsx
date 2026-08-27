"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scroll.
 *
 * The library is imported dynamically and only once the browser is idle, so it
 * never lands in the initial bundle or competes with hydration — smooth
 * scrolling is a refinement, not something worth blocking first paint for.
 * Skipped entirely under prefers-reduced-motion, and torn down on unmount so
 * route changes cannot stack multiple RAF loops.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      let frame = requestAnimationFrame(function raf(time: number) {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      });

      cleanup = () => {
        cancelAnimationFrame(frame);
        lenis.destroy();
      };
    };

    const supportsIdle = typeof window.requestIdleCallback === "function";
    const idle: number = supportsIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 2500 })
      : window.setTimeout(() => void start(), 1200);

    return () => {
      cancelled = true;
      if (supportsIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup?.();
    };
  }, []);

  return null;
}
