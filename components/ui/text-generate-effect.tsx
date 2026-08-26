"use client";
import { useEffect, useRef } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export function TextGenerateEffect({
  words, className, filter = true, duration = 0.6,
}: { words: string; className?: string; filter?: boolean; duration?: number }) {
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!inView) return;
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration, delay: stagger(0.07) }
    );
  }, [inView, animate, filter, duration]);

  return (
    <div ref={containerRef} className={cn(className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0"
            style={{ filter: filter ? "blur(8px)" : "none" }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
