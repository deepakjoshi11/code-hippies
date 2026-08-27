import fs from "node:fs";
import path from "node:path";

const LOG_PATH = path.join(process.cwd(), "data", "chat-gaps.log");
const MAX_QUESTION_LENGTH = 300;

/**
 * Logs questions the assistant could not answer — Section 8.
 *
 * Deliberately records nothing that identifies a visitor: no IP, no session,
 * no user agent. Just the timestamp and the question text, so the site owner
 * can see which content is missing. Every refusal is a content gap with a
 * date on it.
 *
 * Writes are best-effort: on a read-only filesystem (serverless) the failure
 * is swallowed rather than turned into a request error.
 */
export function logUnansweredQuestion(question: string): void {
  try {
    const sanitised = question
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\S+@\S+\.\S+/g, "[redacted-email]")
      .replace(/\+?\d[\d\s-]{7,}\d/g, "[redacted-number]")
      .trim()
      .slice(0, MAX_QUESTION_LENGTH);

    if (!sanitised) return;

    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.appendFileSync(LOG_PATH, `${new Date().toISOString()}\t${sanitised}\n`, "utf8");
  } catch {
    // Non-fatal by design.
  }
}
