"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { consentCopy, denyAll, grantAll, type ConsentState } from "@/lib/analytics/consent";
import { Card, CardBody, Eyebrow } from "@/components/ui/card";
import { useConsent } from "./use-consent";

/** Live consent state with one-click withdrawal. */
export function ConsentControls() {
  const { state, save } = useConsent();
  const [saved, setSaved] = useState(false);

  const apply = (next: ConsentState) => {
    save(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const toggle = (key: "analytics" | "attribution") => {
    const base = state ?? denyAll();
    apply({ ...base, [key]: !base[key], decidedAt: new Date().toISOString() });
  };

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <Eyebrow>Your current choices</Eyebrow>

        {state === null ? (
          <p className="text-sm leading-relaxed text-ink-400">
            You have not made a choice yet, so nothing beyond the essentials is being collected.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {(["analytics", "attribution"] as const).map((key) => (
              <li key={key} className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink-100">
                    {consentCopy[key].label}
                  </span>
                  <span className="block text-xs text-ink-500">
                    {state[key] ? "Allowed" : "Not allowed"}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  aria-pressed={state[key]}
                  className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors ${
                    state[key]
                      ? "border-brand-400/40 bg-brand-500/15 text-brand-400"
                      : "border-ink-100/15 text-ink-500 hover:text-ink-200"
                  }`}
                >
                  {state[key] ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <X className="size-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {state[key] ? `Withdraw consent for ${consentCopy[key].label}` : `Allow ${consentCopy[key].label}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 border-t border-ink-100/10 pt-4">
          <button
            type="button"
            onClick={() => apply(grantAll())}
            className="rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
          >
            Allow everything
          </button>
          <button
            type="button"
            onClick={() => apply(denyAll())}
            className="rounded-full border border-ink-100/20 px-4 py-2.5 text-sm font-semibold text-ink-100 transition-colors hover:bg-ink-100/8"
          >
            Withdraw everything
          </button>
        </div>

        <p role="status" className="min-h-[1rem] text-xs text-brand-400">
          {saved ? "Saved. It takes effect immediately." : ""}
        </p>
      </CardBody>
    </Card>
  );
}
