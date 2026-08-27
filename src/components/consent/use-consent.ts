"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  CONSENT_COOKIE,
  parseConsent,
  serialiseConsent,
  type ConsentState,
} from "@/lib/analytics/consent";

const MAX_AGE = 60 * 60 * 24 * 180; // 180 days, then ask again.
const EVENT = "ch:consent";

/**
 * Consent state, read from the cookie.
 *
 * A cookie is external mutable state, so this uses useSyncExternalStore rather
 * than an effect that calls setState — which React 19 flags, correctly, as a
 * cascading render. Snapshots are cached because getSnapshot must return a
 * referentially stable value or React re-renders forever.
 */

let cachedRaw: string | null = null;
let cachedState: ConsentState | null = null;

function readRaw(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  return match?.[1] ?? null;
}

function getSnapshot(): ConsentState | null {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parseConsent(raw);
  }
  return cachedState;
}

/** No cookie is readable during SSR, so the server always renders "undecided". */
function getServerSnapshot(): ConsentState | null {
  return null;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function useConsent() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const save = useCallback((next: ConsentState) => {
    document.cookie = `${CONSENT_COOKIE}=${serialiseConsent(next)}; path=/; max-age=${MAX_AGE}; samesite=lax${
      location.protocol === "https:" ? "; secure" : ""
    }`;
    // Invalidate immediately so the next snapshot reflects the write even if
    // the browser has not surfaced the cookie yet.
    cachedRaw = null;
    window.dispatchEvent(new CustomEvent<ConsentState>(EVENT, { detail: next }));
  }, []);

  return { state, save };
}
