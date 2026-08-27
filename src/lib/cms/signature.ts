/**
 * HMAC request signing for the Dharmarthlabs CMS link.
 *
 * Both directions are signed with the same shared secret:
 *
 *   codehippies -> CMS   telemetry and lead events
 *   CMS -> codehippies   content and configuration control
 *
 * Signature covers the timestamp AND the body, so a captured request cannot be
 * replayed later or have its payload swapped. Comparison is constant-time, and
 * requests older than the tolerance are rejected outright.
 */

const REPLAY_TOLERANCE_SECONDS = 300;

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signPayload(
  body: string,
  secret: string,
): Promise<{ signature: string; timestamp: string }> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = await hmac(secret, `${timestamp}.${body}`);
  return { signature, timestamp };
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "missing" | "stale" | "mismatch" | "unconfigured" };

export async function verifySignature(
  body: string,
  signature: string | null,
  timestamp: string | null,
  secret: string | undefined,
): Promise<VerifyResult> {
  if (!secret) return { ok: false, reason: "unconfigured" };
  if (!signature || !timestamp) return { ok: false, reason: "missing" };

  const sent = Number(timestamp);
  if (!Number.isFinite(sent)) return { ok: false, reason: "missing" };

  const age = Math.abs(Math.floor(Date.now() / 1000) - sent);
  if (age > REPLAY_TOLERANCE_SECONDS) return { ok: false, reason: "stale" };

  const expected = await hmac(secret, `${timestamp}.${body}`);
  return timingSafeEqualHex(expected, signature) ? { ok: true } : { ok: false, reason: "mismatch" };
}
