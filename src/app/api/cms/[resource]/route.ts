import { NextResponse } from "next/server";
import { z } from "zod";

import { verifySignature } from "@/lib/cms/signature";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";
import { cmsSnapshot, applyControl, controlSchema } from "@/lib/cms/control";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dharmarthlabs CMS control surface.
 *
 * The "codehippies" section of the Dharmarthlabs CMS talks to this endpoint.
 * It is the ONLY external write path into this site, and it is closed by
 * default: with no CMS_SHARED_SECRET configured every request is rejected, so
 * a fresh deploy is never accidentally controllable by anyone.
 *
 *   GET  /api/cms/snapshot   what this site currently is — routes, services,
 *                            case studies, FAQ, channels, build metadata
 *   POST /api/cms/control    apply a control directive (revalidate a path,
 *                            toggle availability, update the announcement)
 *
 * Both require a valid HMAC signature over timestamp + body, with a 5-minute
 * replay window. See src/lib/cms/signature.ts and docs/CMS-INTEGRATION.md.
 *
 * Deliberately NOT supported: arbitrary content mutation. Content lives in the
 * repository under version control, because a CMS that can silently rewrite
 * published claims about a client's stack is a liability, not a feature. The
 * CMS controls presentation, availability and cache — not the record.
 */

const RESOURCES = ["snapshot", "control", "health"] as const;
const resourceSchema = z.enum(RESOURCES);

async function guard(request: Request, body: string) {
  const limit = rateLimit(clientKey(request, "cms"), 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  const result = await verifySignature(
    body,
    request.headers.get("x-ch-signature"),
    request.headers.get("x-ch-timestamp"),
    process.env.CMS_SHARED_SECRET,
  );

  if (!result.ok) {
    // The reason is logged, never returned — an attacker should not learn
    // whether the secret is unset, the timestamp stale, or the digest wrong.
    console.warn("[cms] rejected request: %s", result.reason);
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const parsed = resourceSchema.safeParse(resource);
  if (!parsed.success) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const denied = await guard(request, "");
  if (denied) return denied;

  if (parsed.data === "health") {
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  }

  if (parsed.data === "snapshot") {
    return NextResponse.json(cmsSnapshot(), {
      headers: { "cache-control": "no-store" },
    });
  }

  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const parsed = resourceSchema.safeParse(resource);
  if (!parsed.success || parsed.data !== "control") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // The raw body must be read once and reused, because the signature covers
  // the exact bytes sent — re-serialising parsed JSON would change them.
  const raw = await request.text();

  const denied = await guard(request, raw);
  if (denied) return denied;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  const directive = controlSchema.safeParse(payload);
  if (!directive.success) {
    return NextResponse.json(
      { error: "invalid_directive", issues: directive.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  const result = await applyControl(directive.data);
  return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
}
