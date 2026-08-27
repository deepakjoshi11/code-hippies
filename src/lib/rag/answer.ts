import { retrieve, type Retrieved } from "./retriever";

export const NO_INFORMATION_RESPONSE =
  "I don't have that in my knowledge base, so I'm not going to guess at it. " +
  "The fastest way to get a real answer is the WhatsApp button in the corner of this page, " +
  "or the project brief form at /contact.";

export type Answer = {
  answer: string;
  sources: { title: string; page?: string }[];
  refused: boolean;
};

const SYSTEM_PROMPT = `You are the assistant for Code Hippies, the engineering studio of Deepak Joshi.

Answer ONLY from the numbered sources below. Rules, in priority order:

1. If the sources do not contain the answer, reply with exactly this text and nothing else:
"${NO_INFORMATION_RESPONSE}"
2. Saying you don't know when the sources don't cover it is a CORRECT answer, not a failure.
3. Do not infer, do not generalise from similar cases, and do not use any knowledge from outside the sources.
4. Never invent project details, prices, timelines, client names, metrics or capabilities.
5. Be concise — two to four sentences unless the question genuinely needs a list.
6. Write in plain British English, second person, no marketing language.`;

function buildUserPrompt(question: string, sources: Retrieved[]): string {
  const rendered = sources
    .map((s, i) => `[${i + 1}] ${s.breadcrumb}\n${s.text}`)
    .join("\n\n---\n\n");
  return `Sources:\n\n${rendered}\n\n---\n\nVisitor question: ${question}`;
}

/**
 * Answers a visitor question from the knowledge base.
 *
 * Retrieval runs first and can return nothing — in which case the model is
 * never called at all and the refusal is returned directly. That early return
 * is the highest-value branch in the system: no tokens, no latency, and no
 * opportunity for the model to improvise.
 *
 * When ANTHROPIC_API_KEY is configured the retrieved chunks are passed to the
 * model for a natural-language answer. Without a key the assistant degrades to
 * an extractive answer built from the same retrieved chunks, so the deployment
 * is never silently broken and never ungrounded.
 */
export async function answerQuestion(question: string): Promise<Answer> {
  const sources = retrieve(question, 5);

  if (sources.length === 0) {
    return { answer: NO_INFORMATION_RESPONSE, sources: [], refused: true };
  }

  const citations = dedupeSources(sources);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return { answer: extractiveAnswer(sources), sources: citations, refused: false };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
        max_tokens: 500,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(question, sources) }],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) throw new Error(`Anthropic API returned ${response.status}`);

    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text?.trim();
    if (!text) throw new Error("Empty completion");

    const refused = text.includes("don't have that in my knowledge base");
    return { answer: text, sources: refused ? [] : citations, refused };
  } catch {
    // A model outage must not turn into an ungrounded answer. Fall back to the
    // extractive path, which is built from the same retrieved chunks.
    return { answer: extractiveAnswer(sources), sources: citations, refused: false };
  }
}

/** Builds an answer strictly by quoting the highest-scoring retrieved chunks. */
function extractiveAnswer(sources: Retrieved[]): string {
  const top = sources.slice(0, 2);
  const body = top
    .map((s) => {
      const withoutBreadcrumb = s.text.split("\n").slice(1).join("\n").trim();
      return `**${s.breadcrumb.split(" › ").slice(-1)[0]}**\n${truncate(withoutBreadcrumb, 520)}`;
    })
    .join("\n\n");

  return `Here is what the knowledge base has on that:\n\n${body}\n\nIf that does not cover it, message on WhatsApp and you will get a direct answer.`;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = cut.lastIndexOf(". ");
  return `${lastStop > max * 0.5 ? cut.slice(0, lastStop + 1) : cut.trimEnd()}…`;
}

function dedupeSources(sources: Retrieved[]): { title: string; page?: string }[] {
  const seen = new Set<string>();
  const out: { title: string; page?: string }[] = [];
  for (const s of sources) {
    if (seen.has(s.docTitle)) continue;
    seen.add(s.docTitle);
    out.push({ title: s.docTitle, page: s.page });
  }
  return out.slice(0, 3);
}
