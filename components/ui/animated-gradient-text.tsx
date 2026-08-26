import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AnimatedGradientText({
  children, className,
}: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center",
        "rounded-full border border-brass-600/30 bg-ink-900/70 px-4 py-1.5",
        "text-sm font-medium backdrop-blur-sm transition-colors duration-300",
        "shadow-[inset_0_-6px_10px_#c8873f10] hover:border-brass-500/50",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "animate-gradient bg-gradient-to-r from-brass-500 via-brass-300 to-brass-500 bg-clip-text text-transparent",
        "[background-size:var(--bg-size,300%)_100%]",
        className
      )}
    >
      {children}
    </span>
  );
}
