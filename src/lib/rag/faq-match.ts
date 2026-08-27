import { faqs, type Faq } from "@/data/faq";
import { tokenize } from "./retriever";

/**
 * Curated FAQ matcher — the first layer of the assistant.
 *
 * The 50 questions in data/faq.ts are the ones visitors actually ask, and each
 * has an answer written on purpose. When a question matches one of them there
 * is no reason to go through retrieval and generation at all: matching returns
 * the exact curated answer, which is faster, free, and cannot drift from what
 * the FAQ page says.
 *
 * Only when nothing matches confidently does the question fall through to
 * retrieval, and from there to a refusal. So the pipeline is:
 *
 *     curated match → retrieval → refusal
 *
 * Each stage is strictly more likely to be wrong than the one before it, which
 * is the right order to try them in.
 */

export type FaqMatch = { faq: Faq; score: number };

/** Above this, the curated answer is returned verbatim. */
const EXACT_CONFIDENCE = 0.82;
/** Below this a candidate is not offered at all. */
const SUGGEST_FLOOR = 0.42;

type Variant = { raw: string; tokens: Set<string>; canonical: boolean };
type Indexed = { faq: Faq; variants: Variant[] };

/*
 * Scores are banded so that a literal match always beats a coincidence.
 *
 * Content tokens are stemmed and stopword-filtered, which means a short
 * question can reduce to a single token: "When can you start?" becomes
 * ["start"], and so does the alias "How do I get started?" on a completely
 * different entry. Those two then tie at a perfect Jaccard score of 1.0 and
 * the winner is decided by array order — which is how a visitor gets a
 * confident answer to a question they did not ask.
 *
 * Capping token similarity below the literal bands removes that class of bug
 * entirely: a coincidence can never outrank an exact phrase.
 */
const SCORE_LITERAL_CANONICAL = 1;
const SCORE_LITERAL_ALIAS = 0.98;
const SCORE_CONTAINMENT = 0.86;
const SCORE_TOKEN_CAP = 0.95;

let index: Indexed[] | null = null;

function buildIndex(): Indexed[] {
  return faqs.map((faq) => ({
    faq,
    variants: [
      { raw: normalise(faq.q), tokens: new Set(tokenize(faq.q)), canonical: true },
      ...(faq.aka ?? []).map((raw) => ({
        raw: normalise(raw),
        tokens: new Set(tokenize(raw)),
        canonical: false,
      })),
    ],
  }));
}

function getIndex(): Indexed[] {
  index ??= buildIndex();
  return index;
}

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Jaccard overlap of the two token sets, which rewards shared rare terms. */
function similarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / (a.size + b.size - shared);
}

/**
 * Ranks the curated questions against what the visitor typed.
 * Returns candidates above the suggestion floor, best first.
 */
export function rankFaqs(question: string, limit = 3): FaqMatch[] {
  const asked = normalise(question);
  const askedTokens = new Set(tokenize(question));

  // A question made entirely of stopwords ("Who are you?") tokenises to
  // nothing, but it can still match a variant literally — so bail only when
  // there is no usable text at all.
  if (asked.length === 0) return [];

  const scored = getIndex().map(({ faq, variants }) => {
    let best = 0;
    for (const v of variants) {
      if (v.raw === asked) {
        best = Math.max(best, v.canonical ? SCORE_LITERAL_CANONICAL : SCORE_LITERAL_ALIAS);
        continue;
      }
      let score = Math.min(similarity(askedTokens, v.tokens), SCORE_TOKEN_CAP);
      // Containment handles "pricing?" against "What is your pricing?".
      if (v.raw.includes(asked) || asked.includes(v.raw)) {
        score = Math.max(score, SCORE_CONTAINMENT);
      }
      best = Math.max(best, score);
    }
    return { faq, score: best };
  });

  return scored
    .filter((m) => m.score >= SUGGEST_FLOOR)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** The curated answer, when one matches confidently enough to return verbatim. */
export function matchFaq(question: string): Faq | null {
  const top = rankFaqs(question, 1)[0];
  return top && top.score >= EXACT_CONFIDENCE ? top.faq : null;
}

export { EXACT_CONFIDENCE, SUGGEST_FLOOR };
