"use client";

import { useEffect, useState } from "react";
import { site, whatsappHref } from "@/lib/site";

/**
 * Floating WhatsApp entry point — Section 7.
 *
 * - Fixed bottom-right, safe-area aware on notched devices.
 * - Idle breathing animation, suppressed under prefers-reduced-motion.
 * - On mobile it expands into a labelled pill briefly on load, then settles
 *   back to an icon so it stops covering content.
 * - Keyboard reachable and screen-reader labelled.
 */
export function WhatsAppButton() {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) return;
    const show = window.setTimeout(() => setExpanded(true), 1400);
    const hide = window.setTimeout(() => setExpanded(false), 5200);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const open = expanded || hovered;

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${site.whatsappLabel} on WhatsApp`}
      data-testid="whatsapp-button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group fixed right-4 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-ink-950 shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:shadow-[0_10px_38px_rgba(37,211,102,0.5)] focus-visible:scale-[1.03] motion-safe:animate-[wa-breathe_3.2s_ease-in-out_infinite] md:right-6"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full motion-safe:animate-[wa-ping_3.2s_ease-out_infinite] bg-[#25D366]/40"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="relative size-7 shrink-0 fill-current"
        focusable="false"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.99 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      {/*
        Absolutely positioned so expanding the label cannot change the
        button's layout box. A fixed element that resizes still registers as
        a layout shift in Core Web Vitals — this keeps CLS at zero.
      */}
      <span
        className={`pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-ink-950 shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
        }`}
      >
        {site.whatsappLabel}
      </span>
    </a>
  );
}
