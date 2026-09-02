import { describe, expect, it } from "vitest";
import { buildChannels, primaryChannel, whatsappHref } from "@/data/channels";
import { caseStudies, liveCaseStudies } from "@/data/case-studies";
import { proofMetrics } from "@/data/proof";
import { audienceTracks, craftToAi } from "@/data/positioning";
import { partnerRoutes, dharmarthlabsHref, stayHereInstead } from "@/data/partnership";
import { cmsSnapshot, controlSchema } from "@/lib/cms/control";
import { signPayload, verifySignature, timingSafeEqualHex } from "@/lib/cms/signature";
import { telemetryBatchSchema } from "@/lib/analytics/events";
import { parseConsent, serialiseConsent, grantAll, denyAll } from "@/lib/analytics/consent";
import { allIndexableUrls } from "@/lib/distribution/indexnow";

describe("contact channels", () => {
  it("hides every channel that has no environment value, rather than rendering a dead link", () => {
    // The test environment sets none of the channel variables.
    for (const c of buildChannels()) {
      expect(c.href, `${c.id} rendered with a null href`).toBeTruthy();
    }
  });

  it("refuses to build a WhatsApp link from a placeholder number", () => {
    expect(whatsappHref()).toBeNull();
  });

  it("returns no primary channel when nothing is configured, so callers fall back", () => {
    expect(primaryChannel()).toBeNull();
  });
});

describe("proof metrics", () => {
  it("never claims more reachable sites than there are", () => {
    const detail = proofMetrics[0]!.detail;
    expect(detail).toContain(String(liveCaseStudies().length));
    expect(proofMetrics[0]!.value).toBe(String(caseStudies.length));
  });
});

describe("positioning", () => {
  it("addresses three distinct audiences, each with an objection answered", () => {
    expect(audienceTracks).toHaveLength(3);
    for (const t of audienceTracks) {
      expect(t.points.length).toBe(3);
      expect(t.objection.q.endsWith("?"), t.id).toBe(true);
      expect(t.objection.a.length, t.id).toBeGreaterThan(120);
      expect(t.cta.href.startsWith("/"), t.id).toBe(true);
    }
  });

  it("pairs the classic foundation with the modern stack", () => {
    expect(craftToAi.columns).toHaveLength(2);
    for (const c of craftToAi.columns) expect(c.items.length).toBeGreaterThanOrEqual(4);
  });
});

describe("partnership funnel", () => {
  it("offers routes for every audience and says when to stay here instead", () => {
    expect(partnerRoutes.length).toBeGreaterThanOrEqual(4);
    expect(stayHereInstead.length).toBeGreaterThanOrEqual(3);
    for (const r of partnerRoutes) {
      expect(r.ctaPath.startsWith("/"), r.id).toBe(true);
      expect(r.outcomes.length, r.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("tags outbound links so the CMS can attribute the referral", () => {
    const href = dharmarthlabsHref("/products");
    expect(href).toContain("utm_source=codehippies");
    expect(href).toContain("utm_medium=referral");
    expect(href).toContain("/products");
  });
});

describe("cms link", () => {
  const secret = "test-secret-value";

  it("round-trips a signature", async () => {
    const body = JSON.stringify({ action: "ping" });
    const { signature, timestamp } = await signPayload(body, secret);
    await expect(verifySignature(body, signature, timestamp, secret)).resolves.toEqual({ ok: true });
  });

  it("rejects a tampered body", async () => {
    const body = JSON.stringify({ action: "ping" });
    const { signature, timestamp } = await signPayload(body, secret);
    const result = await verifySignature('{"action":"revalidate"}', signature, timestamp, secret);
    expect(result).toEqual({ ok: false, reason: "mismatch" });
  });

  it("rejects a replayed request outside the tolerance window", async () => {
    const body = "{}";
    const stale = String(Math.floor(Date.now() / 1000) - 3600);
    const { signature } = await signPayload(body, secret);
    const result = await verifySignature(body, signature, stale, secret);
    expect(result.ok).toBe(false);
  });

  it("is closed by default — no secret means no access", async () => {
    const result = await verifySignature("{}", "abc", "123", undefined);
    expect(result).toEqual({ ok: false, reason: "unconfigured" });
  });

  it("compares digests in constant time", () => {
    expect(timingSafeEqualHex("abcd", "abcd")).toBe(true);
    expect(timingSafeEqualHex("abcd", "abce")).toBe(false);
    expect(timingSafeEqualHex("abcd", "abc")).toBe(false);
  });

  it("exposes a full read snapshot", () => {
    const snap = cmsSnapshot();
    expect(snap.counts.caseStudies).toBe(15);
    expect(snap.counts.faqs).toBe(50);
    expect(snap.routes).toContain("/partner");
    expect(snap.routes).toContain("/enterprise");
    expect(snap.routes.length).toBeGreaterThan(30);
  });

  it("accepts only the three declared control actions", () => {
    expect(controlSchema.safeParse({ action: "revalidate", paths: ["/work"] }).success).toBe(true);
    expect(controlSchema.safeParse({ action: "ping" }).success).toBe(true);
    // Content mutation is deliberately not a supported action.
    expect(controlSchema.safeParse({ action: "set_content", body: "x" }).success).toBe(false);
    // Absolute URLs must not be accepted as revalidation paths.
    expect(
      controlSchema.safeParse({ action: "revalidate", paths: ["https://evil.example/x"] }).success,
    ).toBe(false);
  });
});

describe("telemetry contract", () => {
  const base = {
    name: "page_view" as const,
    path: "/work",
    consent: { analytics: true, attribution: false },
  };

  it("accepts a well-formed batch", () => {
    expect(telemetryBatchSchema.safeParse({ events: [base] }).success).toBe(true);
  });

  it("rejects an event name that is not on the closed list", () => {
    expect(
      telemetryBatchSchema.safeParse({ events: [{ ...base, name: "exfiltrate" }] }).success,
    ).toBe(false);
  });

  it("rejects a full URL in the path field", () => {
    expect(
      telemetryBatchSchema.safeParse({ events: [{ ...base, path: "https://evil.example" }] }).success,
    ).toBe(false);
  });

  it("caps batch size so one request cannot flood the sink", () => {
    const events = Array.from({ length: 21 }, () => base);
    expect(telemetryBatchSchema.safeParse({ events }).success).toBe(false);
  });
});

describe("consent", () => {
  it("round-trips a granted state", () => {
    const granted = grantAll();
    const parsed = parseConsent(serialiseConsent(granted));
    expect(parsed?.analytics).toBe(true);
    expect(parsed?.attribution).toBe(true);
  });

  it("treats a malformed or outdated cookie as no consent at all", () => {
    expect(parseConsent("not-json")).toBeNull();
    expect(parseConsent(undefined)).toBeNull();
    expect(parseConsent(encodeURIComponent(JSON.stringify({ version: 99, analytics: true })))).toBeNull();
  });

  it("keeps essential locked on and everything else off by default", () => {
    const denied = denyAll();
    expect(denied.essential).toBe(true);
    expect(denied.analytics).toBe(false);
    expect(denied.attribution).toBe(false);
  });
});

describe("search distribution", () => {
  it("enumerates every indexable route as an absolute URL", () => {
    const urls = allIndexableUrls();
    expect(urls.length).toBeGreaterThan(30);
    for (const u of urls) expect(u.startsWith("https://")).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes the new funnel pages", () => {
    const urls = allIndexableUrls().join(" ");
    for (const path of ["/enterprise", "/partner", "/hire", "/privacy"]) {
      expect(urls, path).toContain(path);
    }
  });
});
