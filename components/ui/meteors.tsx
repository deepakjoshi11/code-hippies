"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Meteors({ number = 16, className }: { number?: number; className?: string }) {
  const [seeds, setSeeds] = useState<{ left: number; delay: number; duration: number }[]>([]);

  // Generated client-side only so SSR and hydration markup stay identical.
  useEffect(() => {
    setSeeds(
      Array.from({ length: number }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
      }))
    );
  }, [number]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {seeds.map((s, i) => (
        <span
          key={i}
          className={cn(
            "animate-meteor absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] rounded-full bg-brass-400 shadow-[0_0_0_1px_#c8873f22]",
            "before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-brass-400 before:to-transparent before:content-['']",
            className
          )}
          style={{
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
