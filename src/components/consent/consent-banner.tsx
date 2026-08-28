"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { CONSENT_CATEGORIES, CONSENT_VERSION, consentCopy, denyAll, grantAll } from "@/lib/analytics/consent";
import { cn } from "@/lib/utils";
import { useConsent } from "./use-consent";

/**
 * Consent banner.
 *
 * Accept and reject carry equal visual weight — a reject button hidden behind
 * a link is not a free choice, and a regulator reads it the same way. Rendered
 * only after mount so it can never affect the server HTML, the LCP element, or
 * layout stability.
 */
export function ConsentBanner() {
  const { state, save } = useConsent();
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [attribution, setAttribution] = useState(true);
  const [advertising, setAdvertising] = useState(true);

  // Held back briefly so the banner never competes with first paint, and
  // mounted client-only so it can never affect the server HTML or LCP.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (state !== null || dismissed || !ready) return null;

  const acceptAll = () => {
    save(grantAll());
    setDismissed(true);
  };
  const rejectAll = () => {
    save(denyAll());
    setDismissed(true);
  };
  const saveChoice = () => {
    save({
      version: CONSENT_VERSION,
      essential: true,
      analytics,
      attribution,
      advertising,
      decidedAt: new Date().toISOString(),
    });
    setDismissed(true);
  };

  return (
    <div
      role="dialog"
      aria-label="Privacy choices"
      aria-modal="false"
      className="fixed inset-x-3 z-[55] mx-auto max-w-2xl rounded-2xl border border-ink-100/12 bg-ink-950/98 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl md:inset-x-auto md:left-6 md:p-5"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="text-sm font-medium text-ink-50">A straight answer about cookies</p>
      <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-300">
        Nothing that identifies you is collected unless you say yes, and nothing is ever sold.
        Reject and every page works exactly the same — the ad scripts are simply never requested,
        and I just learn less about which of my work is reaching people.
      </p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-2.5 inline-flex items-center gap-1 text-[0.78rem] text-brand-400 underline underline-offset-4"
      >
        {expanded ? "Hide the detail" : "See exactly what each one does"}
        <ChevronDown
          className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {expanded ? (
        <ul className="mt-3 flex flex-col gap-2.5 border-t border-ink-100/10 pt-3">
          {CONSENT_CATEGORIES.map((key) => {
            const copy = consentCopy[key];
            const checked =
              key === "essential"
                ? true
                : key === "analytics"
                  ? analytics
                  : key === "attribution"
                    ? attribution
                    : advertising;
            const setter =
              key === "analytics" ? setAnalytics : key === "attribution" ? setAttribution : setAdvertising;
            return (
              <li key={key}>
                <label className="flex cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={copy.locked}
                    onChange={(e) => !copy.locked && setter(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-[oklch(0.7_0.16_165)] disabled:opacity-50"
                  />
                  <span>
                    <span className="block text-[0.82rem] font-medium text-ink-100">
                      {copy.label}
                      {copy.locked ? (
                        <span className="ml-2 text-[0.68rem] font-normal text-ink-500">always on</span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-ink-400">
                      {copy.body}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={acceptAll}
          className="flex-1 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={rejectAll}
          className="flex-1 rounded-full border border-ink-100/20 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-colors hover:bg-ink-100/8"
        >
          Reject
        </button>
        {expanded ? (
          <button
            type="button"
            onClick={saveChoice}
            className="flex-1 rounded-full border border-brand-400/40 px-5 py-2.5 text-sm font-semibold text-brand-300 transition-colors hover:bg-brand-500/10"
          >
            Save my choice
          </button>
        ) : null}
      </div>

      <p className="mt-3 text-[0.7rem] text-ink-500">
        Change your mind any time on the{" "}
        <Link href="/privacy" className="text-brand-400 underline underline-offset-2">
          privacy page
        </Link>
        .
      </p>
    </div>
  );
}
