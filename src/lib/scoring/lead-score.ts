import type { LeadInput } from "@/lib/schemas";

/**
 * Lead qualification scoring.
 *
 * A standard binary logistic regression:
 *
 *     z = b0 + Σ wᵢ·xᵢ
 *     p = 1 / (1 + e^(−z))
 *
 * where p is the modelled probability that an enquiry becomes a paid
 * engagement. Features are one-hot encodings of the form's closed enums plus a
 * few derived signals from the message body and the visitor's journey.
 *
 * ── An honest note about the coefficients ────────────────────────────────
 *
 * These weights are NOT fitted on historical data, because no labelled
 * historical data exists yet. They are informative priors — the same
 * relationships an experienced person would apply by hand — expressed in a
 * form that can be REPLACED by fitted coefficients the moment there is real
 * outcome data to fit them on.
 *
 * Presenting hand-set priors as a trained model would be a lie, and a
 * dangerous one: it invites trusting the number more than it deserves. So:
 *
 *   - `MODEL.fitted` is false and is surfaced wherever a score is displayed.
 *   - `scoreLead()` returns its own confidence, which stays low until fitted.
 *   - `scripts/train-lead-model.ts` fits real coefficients by gradient descent
 *     from a labelled CSV and prints a drop-in replacement for MODEL.
 *
 * Until then, treat the score as a triage aid for ordering a morning inbox,
 * not as a decision. It is deliberately never used to reject an enquiry.
 */

export type LeadFeatures = Record<string, number>;

export type LeadScore = {
  /** Modelled probability of conversion, 0–1. */
  probability: number;
  /** 0–100, for display. */
  score: number;
  band: "hot" | "warm" | "nurture" | "unqualified";
  /** Features that pushed the score up or down the most, for explainability. */
  drivers: { feature: string; contribution: number; label: string }[];
  /** How much to trust this. Low until the model is fitted on real outcomes. */
  confidence: "low" | "medium" | "high";
  fitted: boolean;
};

type Model = {
  version: string;
  fitted: boolean;
  /** ISO date of the fit, when there has been one. */
  fittedAt: string | null;
  /** Number of labelled examples the fit used. */
  trainingExamples: number;
  intercept: number;
  weights: Record<string, number>;
};

/**
 * Model coefficients.
 *
 * Replace this whole object with the output of scripts/train-lead-model.ts
 * once you have ~200 labelled outcomes. Nothing else needs to change.
 */
export const MODEL: Model = {
  version: "0.1.0-priors",
  fitted: false,
  fittedAt: null,
  trainingExamples: 0,
  // Base rate: roughly 12% of inbound briefs become paid work. log(0.12/0.88).
  intercept: -1.99,
  weights: {
    // --- Budget. The single strongest signal, and monotonic. ---
    "budget:under_1l": -1.15,
    "budget:1l_3l": 0.35,
    "budget:3l_8l": 1.25,
    "budget:8l_plus": 1.70,
    "budget:retainer": 1.45,
    "budget:unsure": -0.30,

    // --- Timeline. Urgency converts; "exploring" rarely does soon. ---
    "timeline:asap": 0.85,
    "timeline:1_month": 0.70,
    "timeline:1_3_months": 0.30,
    "timeline:3_plus": -0.25,
    "timeline:exploring": -0.90,

    // --- Project type. Reflects observed fit, not preference. ---
    "type:web_app": 0.45,
    "type:marketing_site": 0.20,
    "type:news_platform": 0.55,
    "type:mobile_app": 0.30,
    "type:ai_feature": 0.60,
    "type:seo_performance": 0.35,
    "type:security_review": 0.40,
    "type:other": -0.15,

    // --- Brief quality. A considered brief signals a considered buyer. ---
    "brief:detailed": 0.75, // > 300 characters
    "brief:moderate": 0.25, // 150–300
    "brief:thin": -0.55, // < 150
    "brief:has_constraints": 0.40, // mentions deadline, budget, existing system
    "brief:has_question": 0.15,

    // --- Identity signals. ---
    "identity:company_given": 0.35,
    "identity:business_email": 0.45, // not a free consumer mailbox
    "identity:free_email": -0.10,

    // --- Journey. Read before enquiring is the strongest behavioural signal. ---
    "journey:viewed_pricing": 0.55,
    "journey:viewed_case_study": 0.40,
    "journey:viewed_enterprise": 0.50,
    "journey:used_assistant": 0.30,
    "journey:direct_landing": -0.20,
  },
};

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "yahoo.co.in", "hotmail.com", "outlook.com",
  "live.com", "icloud.com", "aol.com", "proton.me", "protonmail.com",
  "rediffmail.com", "mail.com", "yandex.com", "gmx.com",
]);

const CONSTRAINT_HINTS = /\b(deadline|launch|budget|existing|migrat|legacy|integrat|compliance|by (january|february|march|april|may|june|july|august|september|october|november|december)|next (week|month|quarter))\b/i;

const BUDGET_KEY: Record<string, string> = {
  "Under ₹1,00,000 / under $1,200": "budget:under_1l",
  "₹1,00,000 – ₹3,00,000 / $1,200 – $3,600": "budget:1l_3l",
  "₹3,00,000 – ₹8,00,000 / $3,600 – $9,600": "budget:3l_8l",
  "₹8,00,000+ / $9,600+": "budget:8l_plus",
  "Retainer — monthly budget": "budget:retainer",
  "Not sure yet": "budget:unsure",
};

const TIMELINE_KEY: Record<string, string> = {
  "As soon as possible": "timeline:asap",
  "Within 1 month": "timeline:1_month",
  "1–3 months": "timeline:1_3_months",
  "3+ months": "timeline:3_plus",
  "Exploring options": "timeline:exploring",
};

const TYPE_KEY: Record<string, string> = {
  "Web application": "type:web_app",
  "Marketing or brand website": "type:marketing_site",
  "News or publishing platform": "type:news_platform",
  "iOS / Android app": "type:mobile_app",
  "AI or LLM feature": "type:ai_feature",
  "SEO & performance work": "type:seo_performance",
  "Security review": "type:security_review",
  "Something else": "type:other",
};

/** Human-readable labels, so an explanation never shows a raw feature key. */
export const FEATURE_LABELS: Record<string, string> = {
  "type:web_app": "Web application project",
  "type:marketing_site": "Marketing site project",
  "type:news_platform": "News or publishing platform",
  "type:mobile_app": "Mobile app project",
  "type:ai_feature": "AI or LLM feature",
  "type:seo_performance": "SEO and performance work",
  "type:security_review": "Security review",
  "type:other": "Project type not listed",
  "budget:under_1l": "Budget below ₹1L",
  "budget:1l_3l": "Budget ₹1L–3L",
  "budget:3l_8l": "Budget ₹3L–8L",
  "budget:8l_plus": "Budget above ₹8L",
  "budget:retainer": "Monthly retainer budget",
  "budget:unsure": "Budget not yet decided",
  "timeline:asap": "Wants to start immediately",
  "timeline:1_month": "Starting within a month",
  "timeline:1_3_months": "Starting in 1–3 months",
  "timeline:3_plus": "Starting in 3+ months",
  "timeline:exploring": "Still exploring options",
  "brief:detailed": "Detailed brief",
  "brief:moderate": "Reasonable brief",
  "brief:thin": "Very short brief",
  "brief:has_constraints": "Named real constraints",
  "brief:has_question": "Asked a specific question",
  "identity:company_given": "Gave a company name",
  "identity:business_email": "Business email address",
  "identity:free_email": "Consumer email address",
  "journey:viewed_pricing": "Read the pricing page",
  "journey:viewed_case_study": "Read a case study",
  "journey:viewed_enterprise": "Read the enterprise page",
  "journey:used_assistant": "Used the AI assistant",
  "journey:direct_landing": "Enquired without reading much",
};

export type JourneySignals = {
  viewedPricing?: boolean;
  viewedCaseStudy?: boolean;
  viewedEnterprise?: boolean;
  usedAssistant?: boolean;
  pageViews?: number;
};

/** Turns a submitted brief into the model's feature vector. */
export function extractFeatures(lead: LeadInput, journey: JourneySignals = {}): LeadFeatures {
  const features: LeadFeatures = {};
  const on = (key: string) => {
    if (key in MODEL.weights) features[key] = 1;
  };

  on(BUDGET_KEY[lead.budget] ?? "budget:unsure");
  on(TIMELINE_KEY[lead.timeline] ?? "timeline:exploring");
  on(TYPE_KEY[lead.projectType] ?? "type:other");

  const message = lead.message.trim();
  if (message.length > 300) on("brief:detailed");
  else if (message.length >= 150) on("brief:moderate");
  else on("brief:thin");

  if (CONSTRAINT_HINTS.test(message)) on("brief:has_constraints");
  if (message.includes("?")) on("brief:has_question");

  if (lead.company && lead.company.trim().length > 1) on("identity:company_given");

  const domain = lead.email.split("@")[1]?.toLowerCase();
  if (domain) on(FREE_EMAIL_DOMAINS.has(domain) ? "identity:free_email" : "identity:business_email");

  if (journey.viewedPricing) on("journey:viewed_pricing");
  if (journey.viewedCaseStudy) on("journey:viewed_case_study");
  if (journey.viewedEnterprise) on("journey:viewed_enterprise");
  if (journey.usedAssistant) on("journey:used_assistant");
  if ((journey.pageViews ?? 0) <= 1) on("journey:direct_landing");

  return features;
}

export function sigmoid(z: number): number {
  // Clamped to avoid overflow at the tails; the result is identical to 15dp.
  if (z >= 0) return 1 / (1 + Math.exp(-Math.min(z, 40)));
  const e = Math.exp(Math.max(z, -40));
  return e / (1 + e);
}

export function scoreLead(lead: LeadInput, journey: JourneySignals = {}): LeadScore {
  const features = extractFeatures(lead, journey);

  let z = MODEL.intercept;
  const contributions: { feature: string; contribution: number; label: string }[] = [];

  for (const [feature, value] of Object.entries(features)) {
    const weight = MODEL.weights[feature];
    if (weight === undefined) continue;
    const contribution = weight * value;
    z += contribution;
    contributions.push({
      feature,
      contribution,
      label: FEATURE_LABELS[feature] ?? feature,
    });
  }

  const probability = sigmoid(z);
  const score = Math.round(probability * 100);

  const band: LeadScore["band"] =
    probability >= 0.6 ? "hot" : probability >= 0.35 ? "warm" : probability >= 0.15 ? "nurture" : "unqualified";

  const drivers = contributions
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 5);

  return {
    probability,
    score,
    band,
    drivers,
    // Confidence tracks whether the coefficients came from data or from
    // judgement. It does not rise just because the score is extreme.
    confidence: !MODEL.fitted
      ? "low"
      : MODEL.trainingExamples >= 500
        ? "high"
        : "medium",
    fitted: MODEL.fitted,
  };
}

/** One-line summary for a notification. Always states whether it is fitted. */
export function explainScore(result: LeadScore): string {
  const top = result.drivers
    .filter((d) => d.contribution > 0)
    .slice(0, 3)
    .map((d) => d.label);
  const drag = result.drivers.filter((d) => d.contribution < 0).slice(0, 2).map((d) => d.label);

  const parts = [`${result.band.toUpperCase()} (${result.score}/100)`];
  if (top.length) parts.push(`for: ${top.join(", ")}`);
  if (drag.length) parts.push(`against: ${drag.join(", ")}`);
  if (!result.fitted) parts.push("[priors, not fitted — triage aid only]");
  return parts.join(" · ");
}
