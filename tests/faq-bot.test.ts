import { describe, expect, it } from "vitest";
import { faqCategories, faqs } from "@/data/faq";
import { matchFaq, rankFaqs, EXACT_CONFIDENCE } from "@/lib/rag/faq-match";
import { answerQuestion, NO_INFORMATION_RESPONSE } from "@/lib/rag/answer";

/**
 * The curated FAQ bot — 50 questions the assistant answers verbatim.
 *
 * Two properties are asserted here and both matter:
 *   1. Every one of the 50 canonical questions, and every alias, resolves to
 *      its own answer. A collision means a visitor gets a confident answer to
 *      a question they did not ask.
 *   2. Out-of-scope questions still refuse. Adding 26 questions widened the
 *      surface the matcher searches, which is exactly the change that could
 *      quietly pull a should-refuse question above the threshold.
 */

describe("curated FAQ set", () => {
  it("holds exactly 50 questions", () => {
    expect(faqs).toHaveLength(50);
  });

  it("spans every declared category with no empty category", () => {
    for (const category of faqCategories) {
      expect(faqs.filter((f) => f.category === category).length, category).toBeGreaterThan(0);
    }
    expect(new Set(faqs.map((f) => f.category)).size).toBe(faqCategories.length);
  });

  it("has no duplicate questions or aliases anywhere in the set", () => {
    const all = faqs.flatMap((f) => [f.q, ...(f.aka ?? [])]).map((q) => q.toLowerCase().trim());
    const dupes = all.filter((q, i) => all.indexOf(q) !== i);
    expect(dupes).toEqual([]);
  });

  it("gives every question a substantive answer", () => {
    for (const f of faqs) {
      expect(f.q.endsWith("?"), `not a question: ${f.q}`).toBe(true);
      expect(f.a.length, `answer too short: ${f.q}`).toBeGreaterThan(80);
    }
  });
});

describe("matcher — every canonical question resolves to itself", () => {
  for (const faq of faqs) {
    it(`matches: ${faq.q}`, () => {
      const matched = matchFaq(faq.q);
      expect(matched, `no match above ${EXACT_CONFIDENCE}`).not.toBeNull();
      expect(matched!.q).toBe(faq.q);
    });
  }
});

describe("matcher — alias phrasings reach the right answer", () => {
  const withAliases = faqs.filter((f) => (f.aka?.length ?? 0) > 0);

  it("covers a meaningful share of the set with aliases", () => {
    expect(withAliases.length).toBeGreaterThanOrEqual(40);
  });

  for (const faq of withAliases) {
    for (const alias of faq.aka!) {
      it(`"${alias}" → ${faq.q.slice(0, 44)}`, () => {
        const matched = matchFaq(alias);
        expect(matched, `alias did not match: ${alias}`).not.toBeNull();
        expect(matched!.q, `alias "${alias}" matched the wrong entry`).toBe(faq.q);
      });
    }
  }
});

describe("answer pipeline", () => {
  it("returns the curated answer verbatim, with the FAQ page as its source", async () => {
    const faq = faqs.find((f) => f.q === "Who owns the code you write?")!;
    const result = await answerQuestion(faq.q);
    expect(result.answer).toBe(faq.a);
    expect(result.refused).toBe(false);
    expect(result.faq?.question).toBe(faq.q);
    expect(result.sources[0]?.page).toBe("/faq");
  });

  it("offers follow-up questions from the same category", async () => {
    const result = await answerQuestion("How much does a website or app cost?");
    expect(result.related?.length).toBeGreaterThan(0);
    expect(result.related).not.toContain("How much does a website or app cost?");
  });

  it("still refuses out-of-scope questions after the FAQ layer was added", async () => {
    for (const q of [
      "What is the capital of Mongolia?",
      "Who won the 2026 general election?",
      "Give me the recipe for butter chicken",
      "What are the current Bitcoin prices?",
      "How do I apply for a US work visa?",
      "What is the weather in Dehradun tomorrow?",
    ]) {
      const result = await answerQuestion(q);
      expect(result.refused, `should have refused: ${q}`).toBe(true);
      expect(result.answer).toBe(NO_INFORMATION_RESPONSE);
    }
  });

  it("answers a knowledge-base question that is not in the curated set", async () => {
    const result = await answerQuestion("Tell me about the Uttarakhand news site");
    expect(result.refused).toBe(false);
    expect(result.faq).toBeUndefined();
    expect(result.sources.length).toBeGreaterThan(0);
  });
});

describe("near-miss handling", () => {
  it("suggests candidates for a partial question without answering it", () => {
    const ranked = rankFaqs("pricing", 3);
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0]!.score).toBeLessThanOrEqual(1);
  });

  it("suggests nothing for a question with no shared vocabulary", () => {
    expect(rankFaqs("capital of Mongolia", 3)).toEqual([]);
  });
});
