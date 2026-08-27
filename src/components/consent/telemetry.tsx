"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import type { ConsentState } from "@/lib/analytics/consent";
import { useConsent } from "./use-consent";

type Queued = {
  name: string;
  path: string;
  meta?: Record<string, string | number | boolean>;
};

/**
 * Client telemetry.
 *
 * Batched and flushed on a timer or when the tab is hidden, so it never
 * competes with rendering. Nothing is sent at all until consent is granted,
 * and the server enforces the same rule again — the client is not a trust
 * boundary here either.
 *
 * The session id is generated per tab in sessionStorage and dies with the tab.
 * It exists so a funnel can be reconstructed within one visit; it is not a
 * cookie, not persistent, and not linked to a person.
 */
export function Telemetry() {
  const pathname = usePathname();
  const { state } = useConsent();
  const consent = useRef<ConsentState | null>(null);
  const queue = useRef<Queued[]>([]);
  const session = useRef<string | undefined>(undefined);

  // Mirrored into a ref so the long-lived document listeners below always read
  // the current value without being torn down and rebound on every change.
  // Written in an effect rather than during render, which React 19 rejects.
  useEffect(() => {
    consent.current = state;
  }, [state]);

  useEffect(() => {
    try {
      let existing = sessionStorage.getItem("ch_sid");
      if (!existing) {
        existing = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
        sessionStorage.setItem("ch_sid", existing);
      }
      session.current = existing;
    } catch {
      // Private mode or blocked storage — the funnel is simply not stitched.
      session.current = undefined;
    }
  }, []);

  useEffect(() => {
    const flush = (useBeacon = false) => {
      const state = consent.current;
      if (!state?.analytics || queue.current.length === 0) {
        queue.current = [];
        return;
      }

      const attribution = state.attribution;
      let referrerHost: string | undefined;
      let campaign: string | undefined;
      if (attribution) {
        try {
          if (document.referrer) {
            const host = new URL(document.referrer).host;
            if (host && host !== location.host) referrerHost = host.slice(0, 120);
          }
          campaign = new URLSearchParams(location.search).get("utm_campaign")?.slice(0, 80) ?? undefined;
        } catch {
          /* malformed referrer — ignore */
        }
      }

      const body = JSON.stringify({
        events: queue.current.slice(0, 20).map((e) => ({
          ...e,
          session: session.current,
          consent: { analytics: state.analytics, attribution: state.attribution },
          referrerHost,
          campaign,
        })),
      });
      queue.current = [];

      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon("/api/telemetry", new Blob([body], { type: "application/json" }));
        return;
      }
      void fetch("/api/telemetry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    };

    const push = (name: string, meta?: Record<string, string | number | boolean>) => {
      queue.current.push({ name, path: window.location.pathname, meta });
      if (queue.current.length >= 10) flush();
    };

    push("page_view");

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-channel], [data-partner-route], [data-cta]");
      if (!target) return;
      if (target.dataset.channel) push("channel_click", { channel: target.dataset.channel });
      else if (target.dataset.partnerRoute) push("partner_click", { route: target.dataset.partnerRoute });
      else if (target.dataset.cta) push("cta_click", { cta: target.dataset.cta });
    };

    const marks = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      const pct = Math.round((doc.scrollTop / max) * 100);
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark && !marks.has(mark)) {
          marks.add(mark);
          push("scroll_depth", { depth: mark });
        }
      }
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") flush(true);
    };

    document.addEventListener("click", onClick, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    const timer = window.setInterval(() => flush(), 15_000);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHide);
      window.clearInterval(timer);
      flush(true);
    };
  }, [pathname]);

  return null;
}
