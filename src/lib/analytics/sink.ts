import type { TelemetryEvent } from "./events";

/**
 * Telemetry sink.
 *
 * Events are forwarded to the Dharmarthlabs CMS when it is configured, and
 * otherwise logged for local inspection. There is deliberately no local
 * database: on Vercel the filesystem is ephemeral, so a file-backed store
 * would silently lose data and give a false sense of having analytics.
 *
 * Country is derived from Vercel's edge geo headers, which are already present
 * on the request — no third-party IP lookup, and no IP is stored. Country is
 * as precise as this gets, and only with attribution consent.
 */

const FORWARD_TIMEOUT_MS = 5000;

export type StoredEvent = TelemetryEvent & {
  at: string;
  country?: string;
};

function countryFrom(request: Request, allowed: boolean): string | undefined {
  if (!allowed) return undefined;
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    undefined;
  return country && /^[A-Z]{2}$/.test(country) ? country : undefined;
}

export async function recordEvents(events: TelemetryEvent[], request: Request): Promise<void> {
  const at = new Date().toISOString();
  const stored: StoredEvent[] = events.map((e) => ({
    ...e,
    at,
    country: countryFrom(request, e.consent.attribution),
  }));

  const endpoint = process.env.CMS_TELEMETRY_URL;
  const secret = process.env.CMS_SHARED_SECRET;

  if (!endpoint || !secret) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[telemetry] %d event(s), no CMS configured: %o", stored.length, stored.map((e) => e.name));
    }
    return;
  }

  try {
    const body = JSON.stringify({ source: "codehippies", events: stored });
    const { signPayload } = await import("@/lib/cms/signature");
    const { signature, timestamp } = await signPayload(body, secret);

    await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-ch-signature": signature,
        "x-ch-timestamp": timestamp,
      },
      body,
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    });
  } catch (error) {
    // Analytics must never degrade the visitor's experience or the response.
    console.error("[telemetry] forward failed", error);
  }
}
