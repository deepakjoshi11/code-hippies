import { NextResponse } from "next/server";
import { allIndexableUrls, INDEXNOW_KEY, pingSitemapConsumers, submitToIndexNow } from "@/lib/distribution/indexnow";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Distribution run.
 *
 * Triggered by the scheduled GitHub Action every 72 hours, and manually with
 * the same secret. Protected by CRON_SECRET so it cannot be used by anyone
 * else to hammer the search engines on this domain's behalf, which would get
 * the domain rate-limited rather than indexed.
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-cron-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  const limit = rateLimit(clientKey(request, "indexnow"), 6, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfter: limit.retryAfter },
      { status: 429 },
    );
  }

  const urls = allIndexableUrls();
  const [indexnow, pings] = await Promise.all([submitToIndexNow(urls), pingSitemapConsumers()]);

  return NextResponse.json(
    {
      ok: true,
      submitted: urls.length,
      keyConfigured: Boolean(INDEXNOW_KEY),
      indexnow,
      pings,
      at: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
