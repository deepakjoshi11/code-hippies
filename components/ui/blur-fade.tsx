"use client";
import { useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, type Variants } from "motion/react";

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  blur?: string;
  inView?: boolean;
  once?: boolean;
}

export function BlurFade({
  children, className, duration = 0.5, delay = 0,
  yOffset = 8, blur = "6px", once = true,
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewResult = useInView(ref, { once, margin: "-60px" });

  const variants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inViewResult ? "visible" : "hidden"}
        exit="hidden"
        variants={variants}
        transition={{ delay: 0.04 + delay, duration, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
