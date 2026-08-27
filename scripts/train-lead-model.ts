/**
 * Fits the lead-scoring model on real outcomes.
 *
 *   npx tsx scripts/train-lead-model.ts data/leads.csv
 *
 * Input CSV (header required):
 *
 *   budget,timeline,projectType,company,email,message,viewedPricing,viewedCaseStudy,viewedEnterprise,usedAssistant,pageViews,converted
 *
 * `converted` is 1 if the enquiry became paid work and 0 if it did not. Every
 * other column matches the contact form. Export it from your CRM or the lead
 * webhook sink once you have outcomes to label.
 *
 * Method: binary logistic regression fitted by batch gradient descent on the
 * mean cross-entropy loss, with L2 regularisation to stop rare features from
 * acquiring huge weights on a small sample. Deliberately plain — this is a
 * problem with tens of features and hundreds of rows, and anything heavier
 * would overfit while being harder to explain to the person relying on it.
 *
 * The script prints a drop-in replacement for MODEL in
 * src/lib/scoring/lead-score.ts. Paste it over the existing object; nothing
 * else in the codebase needs to change.
 */
import fs from "node:fs";
import path from "node:path";

import { extractFeatures, sigmoid, MODEL } from "../src/lib/scoring/lead-score";
import type { LeadInput } from "../src/lib/schemas";

const LEARNING_RATE = 0.15;
const EPOCHS = 4000;
/** L2 penalty. Higher pulls weights toward zero on a small sample. */
const L2 = 0.01;
/** Below this many labelled rows, a fit is noise dressed as a model. */
const MIN_EXAMPLES = 150;
const HOLDOUT_FRACTION = 0.25;

type Row = { features: Record<string, number>; label: number };

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  const header = splitCsvLine(lines[0]!);
  return lines.slice(1).filter(Boolean).map((line) => {
    const cells = splitCsvLine(line);
    return Object.fromEntries(header.map((h, i) => [h.trim(), (cells[i] ?? "").trim()]));
  });
}

/** Minimal RFC-4180 line splitter — handles quoted fields containing commas. */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

function toRow(record: Record<string, string>): Row | null {
  const label = Number(record.converted);
  if (label !== 0 && label !== 1) return null;

  const lead = {
    name: "x",
    email: record.email || "unknown@example.com",
    company: record.company ?? "",
    projectType: record.projectType ?? "Something else",
    budget: record.budget ?? "Not sure yet",
    timeline: record.timeline ?? "Exploring options",
    message: record.message ?? "",
    website: "",
  } as LeadInput;

  const features = extractFeatures(lead, {
    viewedPricing: record.viewedPricing === "1" || record.viewedPricing === "true",
    viewedCaseStudy: record.viewedCaseStudy === "1" || record.viewedCaseStudy === "true",
    viewedEnterprise: record.viewedEnterprise === "1" || record.viewedEnterprise === "true",
    usedAssistant: record.usedAssistant === "1" || record.usedAssistant === "true",
    pageViews: Number(record.pageViews) || 0,
  });

  return { features, label };
}

/** Deterministic shuffle, so a re-run on the same data gives the same split. */
function shuffle<T>(items: T[], seed = 42): T[] {
  const out = [...items];
  let state = seed;
  for (let i = out.length - 1; i > 0; i--) {
    state = (state * 1103515245 + 12345) % 2147483648;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function train(rows: Row[], featureNames: string[]) {
  const weights: Record<string, number> = Object.fromEntries(featureNames.map((f) => [f, 0]));
  let intercept = 0;
  const n = rows.length;

  for (let epoch = 0; epoch < EPOCHS; epoch++) {
    const grad: Record<string, number> = Object.fromEntries(featureNames.map((f) => [f, 0]));
    let gradIntercept = 0;

    for (const row of rows) {
      let z = intercept;
      for (const [f, v] of Object.entries(row.features)) z += (weights[f] ?? 0) * v;
      const error = sigmoid(z) - row.label;

      gradIntercept += error;
      for (const [f, v] of Object.entries(row.features)) grad[f] = (grad[f] ?? 0) + error * v;
    }

    intercept -= LEARNING_RATE * (gradIntercept / n);
    for (const f of featureNames) {
      // The intercept is deliberately not regularised — penalising it would
      // bias the model away from the true base rate.
      weights[f] = weights[f]! - LEARNING_RATE * (grad[f]! / n + L2 * weights[f]!);
    }
  }

  return { weights, intercept };
}

function evaluate(rows: Row[], model: { weights: Record<string, number>; intercept: number }) {
  let tp = 0, fp = 0, tn = 0, fn = 0, loss = 0;
  const scored: { p: number; label: number }[] = [];

  for (const row of rows) {
    let z = model.intercept;
    for (const [f, v] of Object.entries(row.features)) z += (model.weights[f] ?? 0) * v;
    const p = sigmoid(z);
    scored.push({ p, label: row.label });

    loss -= row.label * Math.log(Math.max(p, 1e-12)) + (1 - row.label) * Math.log(Math.max(1 - p, 1e-12));
    const predicted = p >= 0.5 ? 1 : 0;
    if (predicted === 1 && row.label === 1) tp++;
    else if (predicted === 1) fp++;
    else if (row.label === 1) fn++;
    else tn++;
  }

  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);

  // AUC via the rank-based (Mann–Whitney U) formulation.
  const positives = scored.filter((s) => s.label === 1);
  const negatives = scored.filter((s) => s.label === 0);
  let auc = 0.5;
  if (positives.length && negatives.length) {
    let wins = 0;
    for (const pos of positives) {
      for (const neg of negatives) {
        wins += pos.p > neg.p ? 1 : pos.p === neg.p ? 0.5 : 0;
      }
    }
    auc = wins / (positives.length * negatives.length);
  }

  return {
    logLoss: loss / rows.length,
    accuracy: (tp + tn) / rows.length,
    precision,
    recall,
    f1: precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall),
    auc,
    counts: { tp, fp, tn, fn },
  };
}

function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx scripts/train-lead-model.ts <path-to-labelled.csv>");
    process.exit(1);
  }

  const resolved = path.resolve(csvPath);
  if (!fs.existsSync(resolved)) {
    console.error(`No such file: ${resolved}`);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(resolved, "utf8"))
    .map(toRow)
    .filter((r): r is Row => r !== null);

  console.log(`Loaded ${rows.length} labelled examples from ${path.basename(resolved)}`);

  if (rows.length < MIN_EXAMPLES) {
    console.error(
      `\nRefusing to fit on ${rows.length} examples. Below ${MIN_EXAMPLES} the coefficients are\n` +
        `noise with a confidence interval wide enough to include zero, and shipping them\n` +
        `would be worse than the documented priors currently in the model — because a\n` +
        `fitted-looking number invites trust the data does not support.\n\n` +
        `Keep collecting outcomes and re-run.`,
    );
    process.exit(1);
  }

  const positives = rows.filter((r) => r.label === 1).length;
  console.log(`Base rate: ${((positives / rows.length) * 100).toFixed(1)}% converted`);

  const shuffled = shuffle(rows);
  const cut = Math.floor(shuffled.length * (1 - HOLDOUT_FRACTION));
  const trainRows = shuffled.slice(0, cut);
  const testRows = shuffled.slice(cut);

  const featureNames = Object.keys(MODEL.weights);
  const fitted = train(trainRows, featureNames);

  const trainMetrics = evaluate(trainRows, fitted);
  const testMetrics = evaluate(testRows, fitted);

  console.log("\n--- Training set ---");
  console.table(trainMetrics);
  console.log("--- Held-out set (this is the one that matters) ---");
  console.table(testMetrics);

  if (testMetrics.auc < 0.6) {
    console.warn(
      "\nWARNING: held-out AUC below 0.60 — the model barely beats guessing.\n" +
        "Do not ship these coefficients. Either the features do not carry signal\n" +
        "for your funnel, or there are not enough examples yet.",
    );
  }

  const sorted = Object.entries(fitted.weights).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

  console.log("\n--- Paste this over MODEL in src/lib/scoring/lead-score.ts ---\n");
  console.log(`export const MODEL: Model = {
  version: "1.0.0-fitted",
  fitted: true,
  fittedAt: ${JSON.stringify(new Date().toISOString())},
  trainingExamples: ${trainRows.length},
  intercept: ${fitted.intercept.toFixed(4)},
  weights: {
${sorted.map(([f, w]) => `    ${JSON.stringify(f)}: ${w.toFixed(4)},`).join("\n")}
  },
};`);
  console.log(
    `\n// Held-out AUC ${testMetrics.auc.toFixed(3)}, F1 ${testMetrics.f1.toFixed(3)}, ` +
      `log-loss ${testMetrics.logLoss.toFixed(4)} on ${testRows.length} examples.`,
  );
}

main();
