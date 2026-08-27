import { NextResponse } from "next/server";
import { chatSchema } from "@/lib/schemas";
import { answerQuestion } from "@/lib/rag/answer";
import { logUnansweredQuestion } from "@/lib/rag/gap-log";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";
import { verifyCsrf } from "@/lib/security/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  if (!(await verifyCsrf(request))) {
    return NextResponse.json({ error: "Invalid request token." }, { status: 403 });
  }

  const limit = rateLimit(clientKey(request, "chat"), LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That's a lot of questions in a short time. Try again shortly, or message on WhatsApp." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Server-side validation with the same schema the client used. The client
  // is not a trust boundary.
  const parsed = chatSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid question." },
      { status: 400 },
    );
  }

  const result = await answerQuestion(parsed.data.question);

  if (result.refused) {
    // Every refusal is a content gap with a date on it. No PII is recorded.
    logUnansweredQuestion(parsed.data.question);
  }

  return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
}
