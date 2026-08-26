"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function InfiniteMovingCards({
  items, direction = "left", speed = "slow", pauseOnHover = true, className,
}: {
  items: { quote: string; name: string; title: string; initials: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    // Duplicate the row once so the translate loop is seamless.
    const children = Array.from(scrollerRef.current.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      (clone as HTMLElement).setAttribute("aria-hidden", "true");
      scrollerRef.current?.appendChild(clone);
    });

    const dur = speed === "fast" ? "24s" : speed === "normal" ? "44s" : "72s";
    containerRef.current.style.setProperty("--animation-duration", dur);
    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-5 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <li
            key={item.name}
            className={cn(
              "relative w-[340px] max-w-full shrink-0 rounded-2xl border border-ink-700/70",
              "bg-gradient-to-b from-ink-850 to-ink-900 px-7 py-6 md:w-[440px]",
              "transition-colors duration-300 hover:border-brass-600/45"
            )}
          >
            <blockquote>
              <span className="relative z-20 text-sm leading-relaxed font-normal text-cream-200">
                &ldquo;{item.quote}&rdquo;
              </span>
              <div className="relative z-20 mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brass-600/40 bg-ink-800 font-mono text-[11px] text-brass-400">
                  {item.initials}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-cream-100">{item.name}</span>
                  <span className="text-xs text-cream-300/80">{item.title}</span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
