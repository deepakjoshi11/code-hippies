import fs from "node:fs";
import path from "node:path";

export type Chunk = {
  id: string;
  /** Source document file name. */
  doc: string;
  /** Document title (first h1) — kept on the chunk so it carries context. */
  docTitle: string;
  /** Heading breadcrumb, e.g. "Service: Web development › What you get". */
  breadcrumb: string;
  text: string;
  /** Site path this chunk describes, for citation links. */
  page?: string;
};

const KB_DIR = path.join(process.cwd(), "knowledge-base");
const MIN_CHUNK = 220;
const MAX_CHUNK = 1400;

/**
 * Splits on semantic boundaries (headings, then paragraphs) rather than a
 * character count, and prefixes every chunk with its heading breadcrumb so a
 * fragment like "typically two to four weeks" is still answerable.
 */
export function loadChunks(): Chunk[] {
  if (!fs.existsSync(KB_DIR)) return [];

  const chunks: Chunk[] = [];

  for (const file of fs.readdirSync(KB_DIR).filter((f) => f.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(KB_DIR, file), "utf8");
    const docTitle = /^#\s+(.+)$/m.exec(raw)?.[1]?.trim() ?? file;
    const page = /^Page:\s*(\S+)$/m.exec(raw)?.[1];

    // Split into sections at h2/h3 boundaries, keeping the heading with its body.
    const sections = raw.split(/\n(?=##\s)/);

    for (const section of sections) {
      const headingMatch = /^(#{2,3})\s+(.+)$/m.exec(section);
      const heading = headingMatch?.[2]?.trim();
      const body = section.replace(/^#{1,3}\s+.+$/m, "").trim();
      if (!body) continue;

      const breadcrumb = heading ? `${docTitle} › ${heading}` : docTitle;

      for (const piece of splitBody(body)) {
        chunks.push({
          id: `${file}#${chunks.length}`,
          doc: file,
          docTitle,
          breadcrumb,
          text: `${breadcrumb}\n${piece}`,
          page,
        });
      }
    }
  }

  return chunks;
}

/** Groups paragraphs into pieces between MIN_CHUNK and MAX_CHUNK characters. */
function splitBody(body: string): string[] {
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  let buffer = "";

  for (const paragraph of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (candidate.length > MAX_CHUNK && buffer) {
      out.push(buffer);
      buffer = paragraph;
    } else {
      buffer = candidate;
    }
  }
  if (buffer) out.push(buffer);

  // Merge a trailing undersized fragment back into the previous piece.
  if (out.length > 1) {
    const last = out[out.length - 1]!;
    if (last.length < MIN_CHUNK) {
      out[out.length - 2] = `${out[out.length - 2]!}\n\n${last}`;
      out.pop();
    }
  }

  return out;
}
