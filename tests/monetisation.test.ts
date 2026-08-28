import { describe, expect, it } from "vitest";
import { providers, configuredProviders, requiredOrigins, hasAdvertising } from "@/lib/analytics/providers";
import {
  CONSENT_CATEGORIES,
  CONSENT_VERSION,
  consentCopy,
  denyAll,
  grantAll,
  parseConsent,
  serialiseConsent,
} from "@/lib/analytics/consent";
import { learningTracks, aiVisibility } from "@/data/learn";
import { getAllPosts } from "@/lib/blog";

describe("measurement providers", () => {
  it("is fully inert when nothing is configured", () => {
    // The test environment sets no provider IDs, so nothing may be active.
    expect(configuredProviders()).toEqual([]);
    expect(hasAdvertising()).toBe(false);
  });

  it("never widens the CSP for an unconfigured provider", () => {
    // This is the property that keeps a default deployment tight: origins are
    // derived from configuration, not hard-coded permissively.
    expect(requiredOrigins()).toEqual([]);
  });

  it("separates analytics consent from advertising consent", () => {
    const advertising = providers.filter((p) => p.requires === "advertising").map((p) => p.id);
    const analytics = providers.filter((p) => p.requires === "analytics").map((p) => p.id);
    // Ad Manager, AdSense and Comscore send data to third parties and must
    // never ride on an analytics-only consent.
    expect(advertising).toContain("gam");
    expect(advertising).toContain("adsense");
    expect(advertising).toContain("comscore");
    expect(analytics).toContain("ga4");
    expect(advertising).not.toContain("ga4");
  });

  it("declares a third-party origin for every provider, so the CSP can cover it", () => {
    for (const p of providers) {
      expect(p.origins.length, p.id).toBeGreaterThan(0);
      for (const o of p.origins) expect(o.startsWith("https://"), `${p.id}: ${o}`).toBe(true);
    }
  });
});

describe("consent model", () => {
  it("treats advertising as its own category", () => {
    expect(CONSENT_CATEGORIES).toContain("advertising");
    expect(consentCopy.advertising.body.length).toBeGreaterThan(80);
  });

  it("bumped the version so a previous decision cannot silently cover ads", () => {
    // Adding a category invalidates stored consent — an old "yes" must never
    // be read as consent to a kind of processing that did not exist then.
    expect(CONSENT_VERSION).toBeGreaterThanOrEqual(2);
    const stale = encodeURIComponent(
      JSON.stringify({ version: 1, essential: true, analytics: true, attribution: true }),
    );
    expect(parseConsent(stale)).toBeNull();
  });

  it("defaults every optional category to off", () => {
    const denied = denyAll();
    expect(denied.analytics).toBe(false);
    expect(denied.attribution).toBe(false);
    expect(denied.advertising).toBe(false);
    expect(denied.essential).toBe(true);
  });

  it("round-trips advertising consent", () => {
    const parsed = parseConsent(serialiseConsent(grantAll()));
    expect(parsed?.advertising).toBe(true);
  });
});

describe("learning material", () => {
  it("marks the status of every track so nothing looks finished when it is not", () => {
    for (const t of learningTracks) {
      expect(["published", "in-progress", "planned"]).toContain(t.status);
      expect(t.outcomes.length, t.slug).toBeGreaterThanOrEqual(3);
      expect(t.who.length, t.slug).toBeGreaterThan(20);
    }
  });

  it("only links articles that actually exist", () => {
    const slugs = new Set(getAllPosts().map((p) => p.slug));
    for (const t of learningTracks) {
      for (const a of t.articles) {
        expect(slugs.has(a), `${t.slug} links a missing article: ${a}`).toBe(true);
      }
    }
  });

  it("a published track must have at least one article behind it", () => {
    for (const t of learningTracks.filter((x) => x.status === "published")) {
      expect(t.articles.length, `${t.slug} claims published with no reading`).toBeGreaterThan(0);
    }
  });

  it("gives AI visibility a real definition and concrete practices", () => {
    expect(aiVisibility.definition.length).toBeGreaterThan(80);
    expect(aiVisibility.practices.length).toBeGreaterThanOrEqual(5);
    for (const p of aiVisibility.practices) {
      expect(p.body.length, p.title).toBeGreaterThan(80);
    }
  });
});
