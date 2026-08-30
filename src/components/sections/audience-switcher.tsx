"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { audienceTracks } from "@/data/positioning";
import { cn } from "@/lib/utils";

/**
 * Audience switcher.
 *
 * Three readers arrive on the same page with different fears. Rather than
 * writing to an average of them — which convinces nobody — each picks their
 * own frame. All three panels are in the server-rendered HTML, so every
 * version is indexable and readable without JavaScript; the tabs only choose
 * which is visible.
 */
export function AudienceSwitcher() {
  const [active, setActive] = useState(audienceTracks[0]!.id);

  return (
    <div>
      <div role="tablist" aria-label="Choose how you'd like this explained" className="flex flex-wrap gap-2">
        {audienceTracks.map((track) => (
          <button
            key={track.id}
            role="tab"
            type="button"
            id={`aud-tab-${track.id}`}
            aria-selected={active === track.id}
            aria-controls={`aud-panel-${track.id}`}
            onClick={() => setActive(track.id)}
            className={cn(
              "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
              active === track.id
                ? "border-brand-400/50 bg-brand-500/12 text-brand-700"
                : "border-ink-100/12 text-ink-300 hover:border-ink-100/25 hover:text-ink-50",
            )}
          >
            {track.navLabel}
          </button>
        ))}
      </div>

      {audienceTracks.map((track) => (
        <div
          key={track.id}
          role="tabpanel"
          id={`aud-panel-${track.id}`}
          aria-labelledby={`aud-tab-${track.id}`}
          hidden={active !== track.id}
          className="mt-8"
        >
          <p className="text-sm text-ink-500">{track.who}</p>
          <h3 className="mt-3 max-w-3xl text-balance-heading text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink-50 md:text-3xl">
            {track.headline}
          </h3>
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-300">{track.intro}</p>

          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {track.points.map((point) => (
              <li
                key={point.title}
                className="rounded-card border border-ink-100/10 bg-ink-900/50 p-5"
              >
                <h4 className="text-[0.95rem] font-semibold leading-snug text-ink-50">
                  {point.title}
                </h4>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{point.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-card border border-accent-600/25 bg-accent-600/6 p-5">
            <p className="text-sm font-medium text-ink-50">&ldquo;{track.objection.q}&rdquo;</p>
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-ink-300">
              {track.objection.a}
            </p>
          </div>

          <Link
            href={track.cta.href}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-400 underline underline-offset-4"
          >
            {track.cta.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ))}
    </div>
  );
}
