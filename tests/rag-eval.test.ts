import { describe, expect, it } from "vitest";
import { retrieve, RELEVANCE_FLOOR } from "@/lib/rag/retriever";
import { loadChunks } from "@/lib/rag/chunk";

/**
 * Retrieval evaluation harness — Section 8.
 *
 * Half of this set is questions the assistant MUST refuse. A change to
 * chunking, the relevance floor or the knowledge base that moves the refusal
 * boundary fails here rather than in front of a visitor.
 */

const MUST_ANSWER = [
  { q: "How much does a mobile app cost?", expectDoc: /pricing|service-mobile/ },
  { q: "Do you build iOS and Android apps?", expectDoc: /service-mobile/ },
  { q: "What happens during discovery?", expectDoc: /process|pricing|service-/ },
  { q: "Who owns the code you write?", expectDoc: /faq-security|process/ },
  { q: "Which projects used Next.js?", expectDoc: /case-study/ },
  { q: "How do you stop an AI from hallucinating?", expectDoc: /service-ai-llm|faq-ai/ },
  { q: "What is a retainer engagement?", expectDoc: /pricing/ },
  { q: "Did Deepak Joshi work at Deloitte?", expectDoc: /about|faq-working/ },
  { q: "What security headers do you set?", expectDoc: /service-security|faq-security/ },
  // SOC 2 IS covered by the knowledge base — the honest behaviour is to
  // retrieve that answer ("audits need an accredited third party"), not to
  // refuse. Refusal is only correct when nothing relevant exists.
  { q: "What is your SOC 2 audit report number?", expectDoc: /security/ },
  { q: "Tell me about the Uttarakhand news site", expectDoc: /uttaranchal/ },
];

const MUST_REFUSE = [
  "Who won the 2026 general election?",
  "What is the capital of Mongolia?",
  "Can you write me a Python script to scrape Amazon?",
  "What is the weather in Dehradun tomorrow?",
  "Give me the recipe for butter chicken",
  "How do I apply for a US work visa?",
  "What are the current Bitcoin prices?",
];

describe("knowledge base", () => {
  it("indexes documents from the generated knowledge base", () => {
    const chunks = loadChunks();
    expect(chunks.length).toBeGreaterThan(40);
  });

  it("keeps a heading breadcrumb on every chunk", () => {
    for (const chunk of loadChunks()) {
      expect(chunk.breadcrumb.length).toBeGreaterThan(0);
      expect(chunk.text.startsWith(chunk.breadcrumb)).toBe(true);
    }
  });
});

describe("retrieval — questions that must be answered", () => {
  for (const { q, expectDoc } of MUST_ANSWER) {
    it(`retrieves grounding for: ${q}`, () => {
      const hits = retrieve(q, 5);
      expect(hits.length, `no chunk cleared the ${RELEVANCE_FLOOR} floor`).toBeGreaterThan(0);
      const docs = hits.map((h) => h.doc).join(" ");
      expect(docs, `top documents were: ${docs}`).toMatch(expectDoc);
    });
  }
});

describe("retrieval — questions that must be refused", () => {
  for (const q of MUST_REFUSE) {
    it(`returns nothing above the floor for: ${q}`, () => {
      const hits = retrieve(q, 5);
      expect(
        hits.length,
        `expected a refusal, but retrieved: ${hits.map((h) => `${h.doc}@${h.score.toFixed(3)}`).join(", ")}`,
      ).toBe(0);
    });
  }
});
