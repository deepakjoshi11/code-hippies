import { NextResponse } from "next/server";
import { telemetryBatchSchema } from "@/lib/analytics/events";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";
import { recordEvents } from "@/lib/analytics/sink";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 120;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Telemetry intake.
 *
 * No CSRF token is required — this is an append-only counter with no
 * side effects a forged request could exploit, and demanding a token would
 * mean issuing one to every visitor including those who declined analytics.
 * It is rate limited by IP instead.
 *
 * Consent is enforced HERE as well as on the client. The client sends what it
 * believes it is allowed to; the server drops anything the accompanying
 * consent flags do not cover. A tampered client cannot widen what is stored.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "telemetry"), LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return new NextResponse(null, {
      status: 429,
      headers: { "retry-after": String(limit.retryAfter) },
    });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const parsed = telemetryBatchSchema.safeParse(payload);
  if (!parsed.success) {
    return new NextResponse(null, { status: 400 });
  }

  const accepted = parsed.data.events.filter((e) => e.consent.analytics);
  const sanitised = accepted.map((e) => ({
    ...e,
    // Attribution fields are dropped server-side when that box was not ticked,
    // regardless of what the client sent.
    referrerHost: e.consent.attribution ? e.referrerHost : undefined,
    campaign: e.consent.attribution ? e.campaign : undefined,
  }));

  if (sanitised.length > 0) {
    await recordEvents(sanitised, request);
  }

  // 204 with no body — nothing to leak, nothing to cache.
  return new NextResponse(null, { status: 204 });
}
