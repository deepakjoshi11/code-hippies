"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export function TracingBeam({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end end"] });

  useEffect(() => {
    if (!contentRef.current) return;
    const update = () => setSvgHeight(contentRef.current?.offsetHeight ?? 0);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  const spring = { stiffness: 500, damping: 90 };
  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), spring);
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), spring);

  return (
    <motion.div ref={ref} className={cn("relative mx-auto h-full w-full max-w-5xl", className)}>
      <div className="absolute top-3 left-0 hidden md:block">
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          className="ml-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-ink-600 shadow-sm"
        >
          <motion.div className="h-2 w-2 rounded-full border border-brass-500 bg-brass-400" />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0 V -36 l 18 24 V ${svgHeight * 0.8} l -18 24 V ${svgHeight}`}
            fill="none"
            stroke="#1a2331"
            strokeOpacity="0.9"
            transition={{ duration: 10 }}
          />
          <motion.path
            d={`M 1 0 V -36 l 18 24 V ${svgHeight * 0.8} l -18 24 V ${svgHeight}`}
            fill="none"
            stroke="url(#beamGradient)"
            strokeWidth="1.5"
            className="motion-reduce:hidden"
            transition={{ duration: 10 }}
          />
          <defs>
            <motion.linearGradient id="beamGradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={y1} y2={y2}>
              <stop stopColor="#c8873f" stopOpacity="0" />
              <stop stopColor="#c8873f" />
              <stop offset="0.36" stopColor="#f0c48a" />
              <stop offset="1" stopColor="#e0a45c" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef} className="md:pl-20">
        {children}
      </div>
    </motion.div>
  );
}
