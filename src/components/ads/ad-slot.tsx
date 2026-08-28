"use client";

import { useEffect, useRef } from "react";
import { getProvider } from "@/lib/analytics/providers";
import { useConsent } from "@/components/consent/use-consent";
import { cn } from "@/lib/utils";

/**
 * An advertising slot.
 *
 * Two properties matter more than the ad itself:
 *
 *  1. **Reserved height.** The container holds its size whether or not an ad
 *     fills it. An ad that arrives late and pushes content down is the single
 *     most common cause of a failed CLS budget, and this site asserts CLS
 *     0.000 in CI. If the slot cannot reserve space, it does not render.
 *
 *  2. **Nothing without consent.** No placeholder, no reserved box, no
 *     request. A visitor who declined advertising sees a page with no trace
 *     of it — not an empty grey rectangle telling them what they are missing.
 *
 * Labelled "Advertisement" because an unlabelled ad next to editorial content
 * is deceptive, and because AdSense policy requires it.
 */
export function AdSlot({
  slotId,
  format = "auto",
  minHeight = 280,
  className,
  label = "Advertisement",
}: {
  /** AdSense data-ad-slot, or a GAM slot path. */
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal";
  /** Reserved height in px. Must match the smallest ad that can serve here. */
  minHeight?: number;
  className?: string;
  label?: string;
}) {
  const { state } = useConsent();
  const containerRef = useRef<HTMLElement>(null);
  const pushed = useRef(false);

  const adsense = getProvider("adsense");
  const allowed = Boolean(state?.advertising) && Boolean(adsense) && Boolean(slotId);

  useEffect(() => {
    if (!allowed || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /*
       * A blocked or failed ad script must never surface to the reader as an
       * empty labelled box. Hidden through the ref rather than through state:
       * this is updating an external system after render, which is what an
       * effect is for — calling setState here would trigger a second render
       * pass for something the reader must never see either way.
       */
      if (containerRef.current) containerRef.current.hidden = true;
    }
  }, [allowed]);

  if (!allowed) return null;

  return (
    <aside
      ref={containerRef}
      aria-label={label}
      className={cn("my-8 flex flex-col items-center gap-2", className)}
    >
      <span className="text-[0.65rem] uppercase tracking-[0.16em] text-ink-500">{label}</span>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight }}
        data-ad-client={adsense!.account!}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
