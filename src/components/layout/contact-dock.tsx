"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle, Phone, CalendarClock, X } from "lucide-react";

import { buildChannels, primaryChannel, type Channel } from "@/data/channels";
import { channelIcon, GenericChannelIcon } from "./channel-icons";
import { cn } from "@/lib/utils";

const fallbackIcon = {
  email: Mail,
  phone: Phone,
  cal: CalendarClock,
} as const;

function IconFor({ id, className }: { id: string; className?: string }) {
  const Brand = channelIcon[id as keyof typeof channelIcon];
  if (Brand) return <Brand className={className} />;
  const Lucide = fallbackIcon[id as keyof typeof fallbackIcon];
  if (Lucide) return <Lucide className={className} aria-hidden="true" />;
  return <GenericChannelIcon className={className} />;
}

/**
 * Floating contact dock.
 *
 * Replaces the single WhatsApp button with "reach me where you already are":
 * the visitor picks the channel they are comfortable with rather than being
 * pushed onto one. Every channel is env-driven and hidden until configured
 * (see src/data/channels.ts), so this never renders a dead link.
 *
 * - Fixed bottom-right, safe-area aware on notched devices.
 * - Fixed-size trigger with an absolutely positioned label, so expanding it
 *   cannot resize the element and therefore cannot register a layout shift.
 * - Full keyboard support: Escape closes and returns focus to the trigger,
 *   and focus is trapped inside the sheet while it is open.
 */
export function ContactDock() {
  const [open, setOpen] = useState(false);
  const [teased, setTeased] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const channels = useMemo(() => buildChannels(), []);
  const primary = useMemo(() => primaryChannel(), []);

  const messaging = channels.filter((c) => c.kind === "messaging");
  const direct = channels.filter((c) => c.kind === "direct");
  const marketplace = channels.filter((c) => c.kind === "marketplace");

  // Brief label tease on mobile so the button explains itself once, then settles.
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const show = window.setTimeout(() => setTeased(true), 1400);
    const hide = window.setTimeout(() => setTeased(false), 5200);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = sheetRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) sheetRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();
  }, [open]);

  const showLabel = teased && !open;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="contact-dock"
        aria-label={open ? "Close contact options" : "Contact Deepak — choose a channel"}
        data-testid="contact-dock-trigger"
        className={cn(
          "group fixed right-4 z-50 grid size-14 place-items-center rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] focus-visible:scale-[1.04] md:right-6",
          /*
           * The foreground has to travel with the background, not sit above the
           * conditional. WhatsApp green is a fixed brand colour while `ink-950`
           * is semantic, so a single shared `text-ink-950` was only ever correct
           * while the theme ran dark: the light theme flipped it to near-white
           * and put white on green at 1.95:1. The open state keeps the token,
           * because there both sides move together.
           */
          open
            ? "bg-ink-100 text-ink-950"
            : "bg-[#25D366] text-[#0b141a] motion-safe:animate-[wa-breathe_3.2s_ease-in-out_infinite]",
        )}
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {!open ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]/40 motion-safe:animate-[wa-ping_3.2s_ease-out_infinite]"
          />
        ) : null}

        {open ? (
          <X className="relative size-6" aria-hidden="true" />
        ) : primary ? (
          <IconFor id={primary.id} className="relative size-7" />
        ) : (
          <MessageCircle className="relative size-7" aria-hidden="true" />
        )}

        <span
          className={cn(
            // #0b141a is WhatsApp's own ink: 9.38:1 on their green, and fixed,
            // so it cannot invert with the theme the way a token would.
            "pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-[#0b141a] shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            showLabel ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0",
          )}
        >
          Talk to a developer
        </span>
      </button>

      <div
        id="contact-dock"
        ref={sheetRef}
        role="dialog"
        aria-label="Contact channels"
        aria-modal="false"
        hidden={!open}
        className="fixed right-3 z-50 flex w-[min(21rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-ink-100/12 bg-ink-950/97 shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl md:right-6"
        style={{
          bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))",
          maxHeight: "min(30rem, calc(100dvh - 9rem))",
        }}
      >
        <div className="border-b border-ink-100/10 px-4 py-3">
          <p className="text-sm font-medium text-ink-50">Reach me where you already are</p>
          <p className="mt-0.5 text-[0.72rem] leading-relaxed text-ink-500">
            All of these reach the same person. Pick whichever you are comfortable with.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {channels.length === 0 ? (
            <div className="px-1 py-2">
              <p className="text-xs leading-relaxed text-ink-400">
                Direct channels are not switched on yet. The project brief form always works and
                reaches me the same way.
              </p>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-ink-950"
              >
                Send a brief
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <ChannelGroup title="Message me" items={messaging} onNavigate={() => setOpen(false)} />
              <ChannelGroup title="Direct" items={direct} onNavigate={() => setOpen(false)} />
              <ChannelGroup
                title="Prefer a platform with escrow?"
                items={marketplace}
                onNavigate={() => setOpen(false)}
              />
            </div>
          )}
        </div>

        <div className="border-t border-ink-100/10 p-3">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
          >
            Or send a full project brief
          </Link>
        </div>
      </div>
    </>
  );
}

function ChannelGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: Channel[];
  onNavigate: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="px-1 pb-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink-500">
        {title}
      </p>
      <ul className="flex flex-col gap-1.5">
        {items.map((c) => (
          <li key={c.id}>
            <a
              href={c.href!}
              target={c.href!.startsWith("http") ? "_blank" : undefined}
              rel={c.href!.startsWith("http") ? "noopener noreferrer" : undefined}
              onClick={onNavigate}
              data-channel={c.id}
              className="flex items-center gap-3 rounded-xl border border-ink-100/10 px-3 py-2.5 transition-colors hover:border-ink-100/25 hover:bg-ink-100/5"
            >
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-lg"
                style={{ backgroundColor: `${c.color}1f`, color: c.color }}
              >
                <IconFor id={c.id} className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink-50">{c.label}</span>
                <span className="block truncate text-[0.7rem] text-ink-500">{c.hint}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
