import { describe, expect, it } from "vitest";
import {
  MODEL,
  FEATURE_LABELS,
  extractFeatures,
  scoreLead,
  sigmoid,
  explainScore,
} from "@/lib/scoring/lead-score";
import type { LeadInput } from "@/lib/schemas";

const base: LeadInput = {
  name: "Test Person",
  email: "person@gmail.com",
  company: "",
  projectType: "Marketing or brand website",
  budget: "Not sure yet",
  timeline: "Exploring options",
  message: "Hi, I want a website.",
  website: "",
};

const strong: LeadInput = {
  ...base,
  email: "cto@acmecorp.com",
  company: "Acme Corp",
  projectType: "Web application",
  budget: "₹8,00,000+ / $9,600+",
  timeline: "As soon as possible",
  message:
    "We run a logistics business and our internal ordering tool is a spreadsheet that three people fight over daily. We need a proper web application with authentication, roles and an audit trail. We have an existing Postgres database with four years of history that cannot be migrated, and a hard deadline of March because our current contract ends then. What would you need from us to scope this?",
};

describe("sigmoid", () => {
  it("maps zero to one half and saturates at the tails without overflowing", () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 10);
    expect(sigmoid(1000)).toBe(1);
    expect(sigmoid(-1000)).toBeCloseTo(0, 10);
    expect(Number.isFinite(sigmoid(-1e9))).toBe(true);
  });

  it("is monotonically increasing", () => {
    let previous = 0;
    for (let z = -10; z <= 10; z += 0.5) {
      const value = sigmoid(z);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });
});

describe("feature extraction", () => {
  it("emits only features the model declares a weight for", () => {
    for (const key of Object.keys(extractFeatures(strong, { viewedPricing: true }))) {
      expect(MODEL.weights, `undeclared feature: ${key}`).toHaveProperty(key);
    }
  });

  it("distinguishes a business address from a consumer one", () => {
    expect(extractFeatures(strong)).toHaveProperty("identity:business_email");
    expect(extractFeatures(base)).toHaveProperty("identity:free_email");
  });

  it("recognises a brief that names real constraints", () => {
    expect(extractFeatures(strong)).toHaveProperty("brief:has_constraints");
    expect(extractFeatures(base)).not.toHaveProperty("brief:has_constraints");
  });

  it("grades brief length into three bands", () => {
    expect(extractFeatures(strong)).toHaveProperty("brief:detailed");
    expect(extractFeatures(base)).toHaveProperty("brief:thin");
    expect(extractFeatures({ ...base, message: "x".repeat(200) })).toHaveProperty("brief:moderate");
  });
});

describe("scoring", () => {
  it("ranks a well-qualified enquiry above a vague one", () => {
    const strongScore = scoreLead(strong, { viewedPricing: true, viewedCaseStudy: true, pageViews: 7 });
    const weakScore = scoreLead(base, { pageViews: 1 });
    expect(strongScore.probability).toBeGreaterThan(weakScore.probability);
    expect(strongScore.band).toBe("hot");
  });

  it("always returns a probability in [0, 1] and a score in [0, 100]", () => {
    for (const lead of [base, strong]) {
      const result = scoreLead(lead);
      expect(result.probability).toBeGreaterThanOrEqual(0);
      expect(result.probability).toBeLessThanOrEqual(1);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });

  it("explains itself with human-readable drivers, not raw feature keys", () => {
    const result = scoreLead(strong, { viewedPricing: true });
    expect(result.drivers.length).toBeGreaterThan(0);
    for (const d of result.drivers) {
      expect(d.label).not.toContain(":");
      expect(d.label.length).toBeGreaterThan(3);
    }
  });

  it("reports low confidence and flags itself while the model is unfitted", () => {
    const result = scoreLead(strong);
    expect(result.fitted).toBe(false);
    expect(result.confidence).toBe("low");
    expect(explainScore(result)).toContain("priors, not fitted");
  });

  it("is monotonic in budget, holding everything else constant", () => {
    const ladder = [
      "Under ₹1,00,000 / under $1,200",
      "₹1,00,000 – ₹3,00,000 / $1,200 – $3,600",
      "₹3,00,000 – ₹8,00,000 / $3,600 – $9,600",
      "₹8,00,000+ / $9,600+",
    ];
    const scores = ladder.map((budget) => scoreLead({ ...strong, budget }).probability);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]!, `budget band ${i} should not score below ${i - 1}`).toBeGreaterThan(scores[i - 1]!);
    }
  });

  it("never rejects — the lowest possible enquiry still returns a band", () => {
    const worst = scoreLead(
      { ...base, budget: "Under ₹1,00,000 / under $1,200", message: "hi" },
      { pageViews: 1 },
    );
    expect(["unqualified", "nurture"]).toContain(worst.band);
    expect(worst.score).toBeGreaterThanOrEqual(0);
  });
});

describe("model integrity", () => {
  it("declares itself unfitted, so no caller mistakes priors for trained weights", () => {
    expect(MODEL.fitted).toBe(false);
    expect(MODEL.trainingExamples).toBe(0);
    expect(MODEL.version).toContain("priors");
  });

  it("has a finite weight for every declared feature", () => {
    for (const [feature, weight] of Object.entries(MODEL.weights)) {
      expect(Number.isFinite(weight), feature).toBe(true);
      expect(Math.abs(weight), `${feature} weight is implausibly large`).toBeLessThan(5);
    }
  });

  it("sets an intercept consistent with a realistic base conversion rate", () => {
    const baseRate = sigmoid(MODEL.intercept);
    expect(baseRate).toBeGreaterThan(0.02);
    expect(baseRate).toBeLessThan(0.35);
  });
});

describe("explainability", () => {
  it("has a human label for every single declared feature", () => {
    // A missing label means explainScore would show a raw key like
    // "type:web_app" to whoever reads the notification.
    const missing = Object.keys(MODEL.weights).filter((f) => !(f in FEATURE_LABELS));
    expect(missing, `features without a human label: ${missing.join(", ")}`).toEqual([]);
  });

  it("never surfaces a raw feature key in a driver label", () => {
    const result = scoreLead(strong, {
      viewedPricing: true,
      viewedCaseStudy: true,
      viewedEnterprise: true,
      usedAssistant: true,
    });
    for (const driver of result.drivers) {
      expect(driver.label, `raw key leaked for ${driver.feature}`).not.toMatch(/^[a-z]+:/);
    }
  });
});
