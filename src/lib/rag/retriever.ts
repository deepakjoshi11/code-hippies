import { loadChunks, type Chunk } from "./chunk";

/**
 * Local vector retriever.
 *
 * Embeddings are computed in-process with a deterministic hashed bag-of-words
 * projection weighted by inverse document frequency, then compared by cosine
 * similarity. No API key and no external vector service is required, which
 * means the assistant works on a fresh clone with nothing configured.
 *
 * The interface is the part that matters: swap `embed` for a hosted embedding
 * model and `search` for a vector database query and nothing else in the
 * system changes. That separation is the point — see /services/ai-llm-engineering.
 */

const DIMS = 384;

export type Retrieved = Chunk & { score: number };

type Index = {
  chunks: Chunk[];
  vectors: Float32Array[];
  idf: Map<string, number>;
};

let cached: Index | null = null;

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been",
  "being", "to", "of", "in", "on", "at", "for", "with", "by", "from", "as", "it",
  "its", "this", "that", "these", "those", "i", "you", "your", "yours", "we",
  "our", "ours", "my", "mine", "us", "me", "do", "does", "did", "doing", "can",
  "will", "would", "should", "could", "may", "might", "must", "have", "has",
  "had", "not", "no", "so", "if", "than", "then", "there", "here", "what",
  "which", "who", "whom", "whose", "how", "when", "where", "why", "about",
  "tell", "give", "get", "got", "need", "want", "into", "out", "up", "down",
  "over", "under", "again", "just", "also", "very", "too", "own", "same",
  "such", "only", "other", "others", "any", "all", "both", "each", "more",
  "most", "much", "many", "some", "few", "during", "while", "after", "before",
  "between", "through", "like", "make", "makes", "made", "use", "used", "using",
  "happen", "happens", "happened", "thing", "things", "please", "kind", "sort",
]);

/**
 * Light suffix stemmer. Not linguistically rigorous — it exists so that
 * "hallucinating" retrieves a chunk written as "hallucination", which is a
 * concrete failure the eval suite caught. Suffixes are stripped longest-first
 * and only when a usable stem remains.
 */
const SUFFIXES = [
  "ations", "ation", "ating", "ated", "ates", "ising", "izing", "ised", "ized",
  "ements", "ement", "ingly", "ing", "edly", "ies", "ied", "ers", "er", "est",
  "ly", "ed", "es", "s",
];

function stem(token: string): string {
  if (token.length <= 4) return token;
  for (const suffix of SUFFIXES) {
    if (token.length - suffix.length >= 4 && token.endsWith(suffix)) {
      const stemmed = token.slice(0, -suffix.length);
      // Collapse a doubled final consonant left behind ("shipping" -> "ship").
      return stemmed.replace(/([bdfgklmnprt])\1$/, "$1");
    }
  }
  return token;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/[\s/]+/)
    .map((t) => t.replace(/^[-.]+|[-.]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
    .map(stem)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/** Stable 32-bit string hash (FNV-1a). */
function hash(token: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function embed(tokens: string[], idf: Map<string, number>): Float32Array {
  const vector = new Float32Array(DIMS);
  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);

  for (const [token, count] of counts) {
    const weight = (1 + Math.log(count)) * (idf.get(token) ?? defaultIdf(idf));
    const h = hash(token);
    // Two projections per token reduce collision damage at this dimensionality.
    vector[h % DIMS]! += weight;
    vector[(h >>> 9) % DIMS]! += weight * 0.5;
  }

  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < DIMS; i++) vector[i]! /= norm;

  return vector;
}

/** An unseen term is treated as maximally rare rather than as zero-weight. */
function defaultIdf(idf: Map<string, number>): number {
  return Math.max(...idf.values(), 1);
}

function buildIndex(): Index {
  const chunks = loadChunks();
  const docFrequency = new Map<string, number>();

  const tokenised = chunks.map((c) => {
    const tokens = tokenize(c.text);
    for (const token of new Set(tokens)) {
      docFrequency.set(token, (docFrequency.get(token) ?? 0) + 1);
    }
    return tokens;
  });

  const total = Math.max(chunks.length, 1);
  const idf = new Map<string, number>();
  for (const [token, df] of docFrequency) {
    idf.set(token, Math.log((total + 1) / (df + 0.5)));
  }

  const vectors = tokenised.map((tokens) => embed(tokens, idf));
  return { chunks, vectors, idf };
}

export function getIndex(): Index {
  cached ??= buildIndex();
  return cached;
}

function cosine(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < DIMS; i++) sum += a[i]! * b[i]!;
  return sum;
}

/**
 * Retrieval floor. Below this a chunk is treated as irrelevant and is dropped
 * entirely, so the generator can be handed nothing and must refuse. Tuned
 * against a set of deliberately out-of-scope questions — see the eval suite.
 */
export const RELEVANCE_FLOOR = 0.33;

export function retrieve(question: string, topK = 5): Retrieved[] {
  const { chunks, vectors, idf } = getIndex();
  if (chunks.length === 0) return [];

  const queryTokens = tokenize(question);
  if (queryTokens.length === 0) return [];

  const queryVector = embed(queryTokens, idf);
  const querySet = new Set(queryTokens);

  /*
   * Lexical overlap is weighted by inverse document frequency rather than
   * counted raw. Without this, an out-of-scope question like "what are the
   * current Bitcoin prices?" scores well merely because "current" and
   * "prices" appear all over the knowledge base, while the one term that
   * decides relevance — "bitcoin" — matches nothing. IDF weighting makes the
   * rare, meaning-bearing term dominate, which is what pushes genuinely
   * unanswerable questions below the floor.
   */
  const maxIdf = defaultIdf(idf);
  const queryWeights = new Map<string, number>();
  let queryMass = 0;
  for (const token of querySet) {
    const weight = idf.get(token) ?? maxIdf;
    queryWeights.set(token, weight);
    queryMass += weight;
  }
  queryMass ||= 1;

  const scored = chunks.map((chunk, i) => {
    const dense = cosine(queryVector, vectors[i]!);

    const chunkTokens = new Set(tokenize(chunk.text));
    let matchedMass = 0;
    for (const [token, weight] of queryWeights) {
      if (chunkTokens.has(token)) matchedMass += weight;
    }
    const lexical = matchedMass / queryMass;

    return { ...chunk, score: dense * 0.35 + lexical * 0.65 };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((c) => c.score >= RELEVANCE_FLOOR);
}
