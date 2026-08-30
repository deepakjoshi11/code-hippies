import Image from "next/image";
import { brandAssets, brandColors, brandMark } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Brand mark.
 *
 * Renders the generated monogram until a custom logo is supplied. To swap it:
 * drop your file at public/logo.svg and set NEXT_PUBLIC_HAS_CUSTOM_LOGO=true.
 * Nothing else changes — every place the mark appears reads from here.
 */
export function Logo({
  className,
  size = 32,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  if (brandAssets.hasCustomLogo) {
    return (
      <Image
        src={brandAssets.logoMark}
        alt={brandMark.alt}
        width={size}
        height={size}
        priority={priority}
        /*
         * The portrait is a dark disc on a light page, so it needs an edge or
         * it reads as a hole punched in the header. A hairline ring plus a
         * whisper of shadow gives it the seated look of a struck coin.
         */
        className={cn(
          "rounded-full object-cover ring-1 ring-ink-100/15 shadow-[0_1px_3px_rgba(0,0,0,0.10)]",
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-lg font-mono font-bold text-ink-950",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.44,
        background: `linear-gradient(135deg, ${brandColors.from}, ${brandColors.to})`,
      }}
    >
      {brandMark.initials}
    </span>
  );
}
